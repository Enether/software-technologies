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
        Article.findById(articleId).then(article => {
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
  // remove the tag from an article
  deleteArticle: function (articleId) {
    return new Promise((resolve, reject) => {
      this.articles.remove(articleId)
      this.save().then(() => {
        resolve()
      })
    })
  },
  // delete the tag, removing it from each article that has it
  delete: function () {
    let Article = mongoose.model('Article')
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

    return articlePromises
  }
})

tagSchema.set('versionKey', false)
const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
// called when we create a new article with tags
module.exports.initializeTag = function (newTags, articleId) {
  // create any non-existing tags and add the given article to each tag's list
  for (let newTag of newTags) {
    Tag.findOne({ name: newTag }).then(potentialTag => {
      return new Promise((resolve, reject) => {
        if (!potentialTag) {
          Tag.create({ name: newTag }).then(tag => {
            tag.articles.push(articleId)
            let tagPromise = tag.insert()
            Promise.all(tagPromise).then(() => {
              tag.save().then(() => {
                resolve()
              })
            })
          })
        } else {
          // tag exists, add the article to it's list of articles
          if (potentialTag.articles.indexOf(articleId) === -1) {
            potentialTag.articles.push(articleId)
            let tagPromise = potentialTag.insert()
            Promise.all(tagPromise).then(() => {
              potentialTag.save().then(() => {
                resolve()
              })
            })
          } else { /* article is in the list already */ resolve() }
        }
      })
    })
  }
}
