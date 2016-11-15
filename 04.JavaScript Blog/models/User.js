const mongoose = require('mongoose')
const encryption = require('./../utilities/encryption')

let userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    salt: { type: String, required: true },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article', default: [] }],
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role'}
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



