// all the user related functions an admin can do to a user
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = mongoose.model('Role')

const encryption = require('../../utilities/encryption')

module.exports = {
  allUsersGet: (req, res) => {
    User
      .find({})
      .then(users => {
        let promises = users.map((user) => {
          return new Promise((resolve, reject) => {
            user.isAdmin().then(isAdmin => {
              user.isAdministrator = isAdmin
              resolve()
            })
          })
        })
        // The Promise.all(iterable) method returns a promise that resolves when all of the promises in the iterable argument have resolved,
        // or rejects with the reason of the first passed promise that rejects.
        Promise.all(promises).then(() => {
          res.render('admin/user/all', { users: users })
        })
      })
  },
  editGet: (req, res) => {
    let userId = req.params.id

    User.findById(userId).then(user => {
      if (!user) {
        // ERROR
        return
      }
      Role.find({}).then(roles => {
        for (let role of roles) {
          role.isChecked = user.roles.indexOf(role.id) !== -1
        }
        res.render('admin/user/edit', { editUser: user, roles: roles })
      })
    })
  },

  editPost: (req, res) => {
    let userId = req.params.id
    let editArgs = req.body
    // TODO: more thorough validation
    if (editArgs.password !== editArgs.confirmPassword) {
      // ERROR
      console.log('Passwords must MATCH')
      return
    }
    // try to find a different user with the same email
    User.findOne({ email: editArgs.email, _id: { $ne: userId } }).then(user => {
      if (user) {
        // ERROR
        console.log(`User with the email ${editArgs.email} already exists!`)
        return
      }
      User.findById(userId).then(user => {
        Role.find({})
          .then(roles => {
            // read the new roles from the input
            let newRoles = roles.filter(role => {
              return editArgs.roles.indexOf(role.name) !== -1  // get the roles that are in
            }).map(role => { return role.id })

            if (editArgs.password) {
              let hashedPassword = encryption.hashPassword(editArgs.password, user.salt)
              user.passwordHash = hashedPassword
            }
            user.email = editArgs.email
            user.fullName = editArgs.fullName
            user.roles = newRoles
            user.save(err => {
              if (err) {
                console.log(err.message)
                return
              }
              // Successful edit!
              res.redirect('/admin/user/all')
            })
          })
      })
    })
  },

  deleteGet: (req, res) => {
    let userId = req.params.id
    User.findById(userId).then(user => {
      if (!user) {
        console.log('No such user exists!')
        return
      }

      res.render('admin/user/delete', { delUser: user })
    })
  },

  deletePost: (req, res) => {
    let userId = req.params.id
    User.findById(userId).then(user => {
      if (!user) {
        console.log('No such user exists!')
        return
      }

      // clean up articles
      let deletionPromises = user.delete()
      Promise.all(deletionPromises).then(() => {
        user.remove()
        res.redirect('/')
      })
    })
  }
}
