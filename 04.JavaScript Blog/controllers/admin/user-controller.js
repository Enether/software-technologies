// all the user related functions an admin can do to a user
const mongoose = require('mongoose')
const User = mongoose.model('User')
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
        // this waits for all the promises to end
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

      res.render('admin/user/edit', { user: user })
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
        if (editArgs.password) {
          let hashedPassword = encryption.hashPassword(editArgs.password, user.salt)
          user.passwordHash = hashedPassword
        }
        user.email = editArgs.email
        user.fullName = editArgs.fullName
        user.save(err => {
          if (err) {
            console.log(err.message)
          }
          // Successful edit!
          res.redirect('/admin/user/all')
        })
      })
    })
  }
}
