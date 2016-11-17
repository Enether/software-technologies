const mongoose = require('mongoose')

let articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    categpry: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'},
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
  }
)

articleSchema.method({
  insertInAuthor: function () {
    let User = mongoose.model('User')
    User.findById(this.author).then(user => {
      user.articles.push(this.id)
      user.save()
    })
  },

  delete: function () {
    let User = mongoose.model('User')
    User.findById(this.author).then(user => {
      if (user) {
        user.articles.remove(this.id)
        user.save()
      }
    })
  }
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
