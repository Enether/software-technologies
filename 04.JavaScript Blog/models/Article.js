const mongoose = require('mongoose')

let articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    date: { type: Date, default: Date.now() }
  }
)

articleSchema.method({
  insert: function () {
    let User = mongoose.model('User')
    let promises = [User.findById(this.author).then(user => {
      return new Promise((resolve, reject) => {
        user.articles.push(this.id)
        user.save().then(() => {
          resolve()
        })
      })
    })]

    let Category = mongoose.model('Category')
    let categoryPromise = Category.findById(this.category).then(category => {
      return new Promise((resolve, reject) => {
        if (category) {
          category.articles.push(this.id)
          category.save().then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })

    promises.push(categoryPromise)

    return promises
  },

  delete: function () {
    let User = mongoose.model('User')

    let promises = [User.findById(this.author).then(user => {
      return new Promise((resolve, reject) => {
        if (user) {
          user.articles.remove(this.id)
          user.save().then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })]

    let Category = mongoose.model('Category')
    let categoryPromise = Category.findById(this.category).then(category => {
      return new Promise((resolve, reject) => {
        if (category) {
          category.articles.remove(this.id)
          category.save().then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })

    promises.push(categoryPromise)

    let Tag = mongoose.model('Tag')
    let tagPromises = this.tags.map((tagId) => {
      return new Promise((resolve, reject) => {
        Tag.findById(tagId).then(tag => {
          // resolev the promise only when the article is removed from the tags
          tag.articles.remove(this.id)
          tag.save().then(() => {
            resolve()
          })
        })
      })
    })

    promises.push.apply(promises, tagPromises)

    return promises
  },

  deleteTag: function (tagId) {
    this.tags.remove(tagId)
    this.save()
  }
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
