const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = mongoose.model('Role')
const encryption = require('./../utilities/encryption')

module.exports = {
  registerGet: (req, res) => {
    res.render('user/register', { user: {}, regArgs: {} })
  },

  registerPost: (req, res) => {
    let registerArgs = req.body

    User.findOne({ email: registerArgs.email }).then(user => {
      let errorMsg = ''
      if (user) {
        errorMsg = 'User with the same username exists!'
      } else if (registerArgs.password !== registerArgs.repeatedPassword) {
        errorMsg = 'Passwords do not match!'
      }

      if (errorMsg) {
        res.render('user/register', { regArgs: registerArgs, error: errorMsg })
      } else {
        Role.findOne({ name: 'User' }).then(role => {
          if (!role) {
            console.log('Cannot register user because role User does not exist!')
            res.render('user/register', {regArgs: registerArgs, error: 'Error while registering.'})
            return
          }

          let salt = encryption.generateSalt()
          let passwordHash = encryption.hashPassword(registerArgs.password, salt)
          // create the user object
          let userObject = {
            email: registerArgs.email,
            passwordHash: passwordHash,
            fullName: registerArgs.fullName,
            salt: salt,
            roles: [role._id]
          }
          // save the user
          User.create(userObject).then(user => {
            req.logIn(user, (err) => {
              if (err) {
                registerArgs.error = err.message
                res.render('user/register', { regArgs: registerArgs, error: err.message })
                return
              }
              // Add the user to the role's array
              role.users.push(user.id)
              role.save()

              res.redirect('/')
            })
          })
        })
      }
    })
  },

  loginGet: (req, res) => {
    res.render('user/login', { loginArgs: {} })
  },

  loginPost: (req, res) => {
    let loginArgs = req.body
    User.findOne({ email: loginArgs.email }).then(user => {
      if (!user || !user.authenticate(loginArgs.password)) {
        let errorMsg = 'Either username or password is invalid!'
        loginArgs.error = errorMsg
        res.render('user/login', { loginArgs: loginArgs })
        return
      }

      req.logIn(user, (err) => {
        if (err) {
          console.log(err)
          res.redirect('/user/login', { error: err.message })
          return
        }
        let returnUrl = '/'
        if (req.session.returnUrl) {
          returnUrl = req.session.returnUrl
          delete req.session.returnUrl
        }

        res.redirect(returnUrl)
      })
    })
  },

  logout: (req, res) => {
    req.logOut()
    res.redirect('/')
  }
}

