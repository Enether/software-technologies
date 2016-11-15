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



