const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const User = mongoose.model('User')

module.exports = {
  createGet: (req, res) => {
    res.render('article/create')
  },

  createPost: (req, res) => {
    let article = req.body
    console.log(article)
    if (!article || !article.title || !article.content) {
      res.render('article/create', { error: 'Invalid article!' })
      return
    } else if (!req.isAuthenticated()) {
      // need to be logged in!
      res.render('article/create', { error: 'You need to be logged in to create an article!' })
      return
    }
    article.author = req.user._id

    Article
      .create(article)
      .then((article) => {
        console.log('User ' + req.user.fullName + ' with e-mail ' + req.user.email + ' created an article named ' + article.title)
        // add the article to the user's articles
        User
          .findOne(req.user._id)
          .then((user) => {
            user.articles.push(article._id)
            user.save()
            res.redirect('/')
          })
      })
  },

  detailsGet: (req, res) => {
    let articleId = req.params.id

    // if (isNaN(parseInt(articleId))) {
    //   res.redirect('/')
    //   return
    // }

    Article
      .findOne({ _id: articleId })
      .populate('author')
      .then((article) => {
        if (!article) {
          res.redirect('/')
          return
        }

        res.render('article/details', article)
      })
  },

  editGet: (req, res) => {
    let articleId = req.params.id
    Article
      .findById(articleId)
      .then((article) => {
        if (!article) {
          res.redirect('/')
          return
        }

        res.render('article/edit', { article: article })
      })
  },

  editPost: (req, res) => {
    let articleId = req.params.id
    let editedTitle = req.body.title
    let editedContent = req.body.content

    let errorMsg = ''
    if (!editedTitle) {
      errorMsg = 'Title must not be empty!'
    } else if (!editedContent) {
      errorMsg = 'Content must not be empty!'
    }

    if (errorMsg) {
      res.render('article/edit', {error: errorMsg, article: {}})
      return
    }

    Article.update({ _id: articleId }, { $set: { title: editedTitle, content: editedContent } })
      .then(() => {
        res.redirect(`/article/details/${articleId}`)
      })
  },

  deleteGet: (req, res) => {
    let articleId = req.params.id
    Article
      .findById(articleId)
      .then((article) => {
        if (!article) {
          res.render('article/delete', {error: `Article with ID ${articleId} does not exist!`, article: {}})
          return
        }

        res.render('article/delete', {article: article})
      })
  },

  deletePost: (req, res) => {
    let articleId = req.params.id
    console.log(articleId)
    Article
      .findOneAndRemove({_id: articleId})
      .populate('author')
      .then((article) => {
        let articleIndex = article.author.articles.indexOf(articleId)

        if (articleIndex === -1) {
          res.render('article/delete', {error: `The author of article with id ${articleIndex} does not seem to have it in his articles collection.`})
          return
        }

        // remove it from the author's articles
        article.author.articles.splice(article.author.articles.indexOf(articleIndex), 1)
        article.author.save().then(() => {
          res.redirect('/')
        })
      })
  }
}
