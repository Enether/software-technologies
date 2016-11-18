const mongoose = require('mongoose')

let tagSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
})

tagSchema.method({
  insert: function () {
    let Article = mongoose.model('Article')

    let articlePromises = this.articles.map((articleId) => {
      return new Promise((resolve, reject) => {
        Article.findById(article).then(article => {
          if (article.tags.indexOf(this.id) === -1) {
            article.tags.push(this.id)
            article.save().then(() => {
              resolve()
            })
          }
        })
      })
    })

    return articlePromises
  },

  deleteArticle: function (articleId) {
    return new Promise((resolve, reject) => {
      this.articles.remove(articleId)
      this.save().then(() => {
        resolve()
      })
    })
  },

  delete: function () {
    let Article = mongoose.model('Article')
    // remove the tag from each article that has it
    let articlePromises = this.articles.map((articleId) => {
      return new Promise((resolve, reject) => {
        Article.findById(articleId).then(article => {
          if (article) {
            article.tags.remove(this.id)
            article.save().then(() => {
              resolve()
            })
          }
        })
      })
    })
  }
})

tagSchema.set('versionKey', false)
const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag