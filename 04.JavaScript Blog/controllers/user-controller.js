const User = require('mongoose').model('User')
const encryption = require('./../utilities/encryption')

module.exports = {
  registerGet: (req, res) => {
    res.render('user/register', { user: {} })
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
        res.render('user/register', {regArgs: registerArgs, error: errorMsg})
      } else {
        let salt = encryption.generateSalt()
        let passwordHash = encryption.hashPassword(registerArgs.password, salt)

        let userObject = {
          email: registerArgs.email,
          passwordHash: passwordHash,
          fullName: registerArgs.fullName,
          salt: salt
        }

        User.create(userObject).then(user => {
          req.logIn(user, (err) => {
            if (err) {
              registerArgs.error = err.message
              res.render('user/register', {regArgs: registerArgs, error: err.message})
              return
            }

            res.redirect('/')
          })
        })
      }
    })
  },

  loginGet: (req, res) => {
    res.render('user/login')
  },

  loginPost: (req, res) => {
    let loginArgs = req.body
    User.findOne({ email: loginArgs.email }).then(user => {
      if (!user || !user.authenticate(loginArgs.password)) {
        let errorMsg = 'Either username or password is invalid!'
        loginArgs.error = errorMsg
        res.render('user/login', {loginArgs: loginArgs})
        return
      }

      req.logIn(user, (err) => {
        if (err) {
          console.log(err)
          res.redirect('/user/login', { error: err.message })
          return
        }

        res.redirect('/')
      })
    })
  },

  logout: (req, res) => {
    req.logOut()
    res.redirect('/')
  }
}

