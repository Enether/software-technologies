const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const Category = mongoose.model('Category')

module.exports = {
  createGet: (req, res) => {
    Category.find({}).then(categories => {
      res.render('article/create', {categories: categories})
    })
  },

  createPost: (req, res) => {
    let article = req.body
    if (!req.isAuthenticated()) {
      // need to be logged in!
      res.render('article/create', { error: 'You need to be logged in to create an article!' })
      return
    } else if (!article || !article.title || !article.content) {
      res.render('article/create', { error: 'Invalid article!' })
      return
    }
    article.author = req.user._id

    Article
      .create(article)
      .then((article) => {
        console.log('User ' + req.user.fullName + ' with e-mail ' + req.user.email + ' created an article named ' + article.title)
        // add the article to the user's articles
        article.insert()
        res.redirect('/')
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

        res.render('article/details', { article: article, user: req.user })
      })
  },

  editGet: (req, res) => {
    let articleId = req.params.id

    // check if user is logged in
    if (!req.isAuthenticated()) {
      req.session.returnUrl = `/article/edit/${articleId}`
      res.redirect('/user/login')
      return
    }

    Article
      .findById(articleId)
      .then((article) => {
        req.user.isAdmin().then(isAdmin => {
          if (!article || !(req.user.isAuthor(article) || isAdmin)) {
            res.redirect('/')
            return
          }

          res.render('article/edit', { article: article })
        })
      })
  },

  editPost: (req, res) => {
    let articleId = req.params.id

    // check if user is logged in
    if (!req.isAuthenticated()) {
      req.session.returnUrl = `/article/edit/${articleId}`
      res.redirect('/user/login')
      return
    }

    let editedTitle = req.body.title
    let editedContent = req.body.content

    let errorMsg = ''
    if (!editedTitle) {
      errorMsg = 'Title must not be empty!'
    } else if (!editedContent) {
      errorMsg = 'Content must not be empty!'
    }

    if (errorMsg) {
      res.render('article/edit', { error: errorMsg, article: {} })
      return
    }
    Article
      .findById(articleId)
      .then(article => {
        if (!(req.user.isAuthor(article) || req.user.isAdmin())) {
          res.redirect('/')
          return
        }
        article.title = editedTitle
        article.content = editedContent
        article.save().then((err, article) => {
          if (!err) {
            res.render('article/edit', { error: err.message })
            return
          }
          res.redirect(`/article/details/${articleId}`)
        })
      })
  },

  deleteGet: (req, res) => {
    let articleId = req.params.id

    if (!req.isAuthenticated()) {
      req.session.returnUrl = `/article/delete/${articleId}`
      res.redirect('/user/login')
      return
    }

    Article
      .findById(articleId)
      .then((article) => {
        if (!article) {
          res.render('article/delete', { error: `Article with ID ${articleId} does not exist!`, article: {} })
          return
        }
        if (!req.user.isAuthor(article) || !req.user.isAdmin()) {
          res.redirect('/')
          return
        }

        res.render('article/delete', { article: article })
      })
  },

  deletePost: (req, res) => {
    let articleId = req.params.id
    if (!req.isAuthenticated()) {
      req.session.returnUrl = `/article/delete/${articleId}`
      res.redirect('/user/login')
      return
    }
    Article
      .findById(articleId)
      .populate('author')
      .then((article) => {
        if (!(req.user.isAuthor(article) || req.user.isAdmin())) {
          res.redirect('/')
          return
        }

        let articleIndex = article.author.articles.indexOf(articleId)
        if (articleIndex === -1) {
          res.render('article/delete', { error: `The author of article with id ${articleIndex} does not seem to have it in his articles collection.` })
          return
        }
        // TODO: Use promises once we add more things to article
        article.delete()
        article.remove()
        res.redirect('/')
      })
  }
}
