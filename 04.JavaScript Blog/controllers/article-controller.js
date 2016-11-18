const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const Category = mongoose.model('Category')
// function for creating non-existing tags and adding the article to the tag's list
const initializeTags = require('./../models/Tag').initializeTag

module.exports = {
  createGet: (req, res) => {
    Category.find({}).then(categories => {
      res.render('article/create', { categories: categories })
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
      .then((newArticle) => {
        console.log('User ' + req.user.fullName + ' with e-mail ' + req.user.email + ' created an article named ' + newArticle.title)
        // add the article to the user's articles
        let tagNames = article.tagNames.split(/\s+|,/).filter(tag => { return tag })
        let tagPromise = initializeTags(tagNames, newArticle.id)
        let articlePromise = newArticle.insert()
        Promise.all([tagPromise, articlePromise]).then(() => {
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
      .populate('tags')
      .then((article) => {
        req.user.isAdmin().then(isAdmin => {
          if (!article || !(req.user.isAuthor(article) || isAdmin)) {
            res.redirect('/')
            return
          }
          Category.find({}).then(categories => {
            let tagsWithNames = article.tags.map(tag => { return tag.name })
            res.render('article/edit', { article: article, categories: categories, tags: tagsWithNames.join(', ') })
          })
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
    let editedCategory = req.body.category

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
      .populate(['category', 'tags'])
      .then(article => {
        if (!(req.user.isAuthor(article) || req.user.isAdmin())) {
          res.redirect('/')
          return
        }
        // new tags
        let editedTags = req.body.tags.split(/\s+|,/).filter(tag => { return tag })
        // old tags which are not in the editedTags, therefore should be removed
        let oldTags = article.tags.filter(tag => {
          return editedTags.indexOf(tag.name === -1)
        })
        // TODO: move to a function
        let promises = []
        for (let tag of oldTags) {
          let removeFromTagPromise = tag.deleteArticle(article.id)
          let removeFromArticlePromise = article.deleteTag(tag.id)
          promises.push(removeFromTagPromise)
          promises.push(removeFromArticlePromise)
        }
        Promise.all(promises).then(() => {
          let initializedTagsPromise = [initializeTags(editedTags, article.id)]
          Promise.all(initializedTagsPromise).then(() => {
            if (article.category.id !== editedCategory) {
              article.category.articles.remove(article.id)
            }
            article.category.save().then(() => {
              article.title = editedTitle
              article.content = editedContent
              article.category = editedCategory

              article.save().then((err) => {
                if (!err) {
                  res.render('article/edit', { error: err.message })
                  return
                }

                Category.findById(article.category).then(category => {
                  if (category.articles.indexOf(article.id) === -1) {
                    category.articles.push(article.id)
                  }
                  category.save().then(() => {
                    res.redirect(`/article/details/${articleId}`)
                  })
                })
              })
            })
          })
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
      .populate('category')
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

        let promises = article.delete()
        Promise.all(promises).then(() => {
          article.remove()
          res.redirect('/')
        })
      })
  }
}
