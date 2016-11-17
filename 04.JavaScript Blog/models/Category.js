const mongoose = require('mongoose')

let categorySchema = mongoose.Schema(
  {
    name: {type: String, required: true, unique: true},
    articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}]
  }
)

categorySchema.method({
  delete: function () {
    let Article = mongoose.model('Article')
    // delete from the article's categories array
    let articlePromises = this.articles.map((article) => {
      return new Promise((resolve, reject) => {
        Article.findById(article).then(article => {
          article.delete() // TODO: promise
          article.remove().then(() => {
            resolve()  // resolve promise only after we've successfully saved the article
          })
        })
      })
    })
    return articlePromises
  }
})

categorySchema.set('versionKey', false)
const Category = mongoose.model('Category', categorySchema)

module.exports = Category
