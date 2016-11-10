const Article = require('mongoose').model('Article')

module.exports = {
  index: (req, res) => {
    Article
      .find()
      .then((articles) => {
        res.render('home/index', {articles: articles})
      })
  }
}
