const mongoose = require('mongoose')
const Role = mongoose.model('Role')
const encryption = require('./../utilities/encryption')

let userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    salt: { type: String, required: true },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article', default: [] }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
  }
)

userSchema.method({
  authenticate: function (password) {
    let inputPasswordHash = encryption.hashPassword(password, this.salt)
    return inputPasswordHash === this.passwordHash
  },

  isAuthor: function (article) {
    // returns a boolean indicating if the user is the author of the given article
    if (!article) {
      console.log("Don't send me empty articles you doofus")
      return false
    }

    return article.author.toString() === this.id.toString()
  },

  isAdmin: function () {
    // returns a promise returning a boolean indicating if the user is an admin
    return Role
      .findOne({name: 'Admin'})
      .then(role => {
        if (!role) {
          console.log('Admin role does not exist!')
          return false
        }

        return this.roles.indexOf(role.id.toString()) !== -1
      })
  },

  isInRole: function (role) {
    // returns a promise returning a boolean indicating if the user has the given role
    return Role.findOne({name: role}).then(role => {
      if (!role) {
        console.log(`No role such as ${role}!`)
        return false
      }

      return this.roles.indexOf(role) !== -1
    })
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User

// create an admin on server start if he doesn't exist
module.exports.seedAdmin = () => {
  Role
    .findOne({name: 'Admin'})
    .then(role => {
      if (!role) {
        console.log('The Admin role is missing, cannot seed the admin')
        return
      }

      User
        .findOne({email: 'admin'})
        .then(admin => {
          if (!admin) {
            let adminSalt = encryption.generateSalt()
            let adminObject = {
              email: 'admin',
              passwordHash: encryption.hashPassword('123', adminSalt),
              fullName: 'ANONYMOUS',
              salt: adminSalt,
              roles: [role._id]
            }

            User.create(adminObject).then(admin => {
              role.users.push(admin._id)
              role.save(err => {
                if (err) {
                  console.log(err.message)
                } else {
                  console.log('Admin seeded successfully!')
                }
              })
            })
          }
        })
    })
}



