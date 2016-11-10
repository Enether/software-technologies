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
          })
      })
  }
}
