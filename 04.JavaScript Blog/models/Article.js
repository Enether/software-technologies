const mongoose = require('mongoose')

let articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'},
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
  }
)

articleSchema.method({
  insert: function () {
    let User = mongoose.model('User')
    User.findById(this.author).then(user => {
      user.articles.push(this.id)
      user.save()
    })

    let Category = mongoose.model('Category')
    Category.findById(this.category).then(category => {
      if (category) {
        category.articles.push(this.id)
        category.save()
      }
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

    let Category = mongoose.model('Category')
    Category.findById(this.category).then(category => {
      if (category) {
        category.articles.remove(this.id)
        category.save()
      }
    })
  }
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
