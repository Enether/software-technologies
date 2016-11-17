const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const Category = mongoose.model('Category')
const User = mongoose.model('User')

module.exports = {
  index: (req, res) => {
    Category.find({}).populate('articles').then(categories => {
      res.render('home/index', {categories: categories})
    })
  },

  listCategoryArticles: (req, res) => {
    let categoryId = req.params.id
    // get all the articles from the category
    Category.findById(categoryId).populate('articles').then(category => {
      User.populate(category.articles, {path: 'author'}, (err) => {
        if (err) {
          res.render('home/index', {error: err.message})
        }

        res.render('home/articles', {articles: category.articles})
      })
    })
  }
}
