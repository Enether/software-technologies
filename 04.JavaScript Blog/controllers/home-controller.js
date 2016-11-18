const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const User = mongoose.model('User')
const Tag = mongoose.model('Tag')

module.exports = {
  index: (req, res) => {
    Category.find({}).populate('articles').then(categories => {
      res.render('home/index', { categories: categories })
    })
  },

  listCategoryArticles: (req, res) => {
    let categoryId = req.params.id
    // get all the articles from the category
    Category.findById(categoryId).populate('articles').then(category => {
      User.populate(category.articles, { path: 'author' }, (err) => {
        if (err) {
          res.render('home/index', { error: err.message })
        }
        Tag.populate(category.articles, { path: 'tags' }, (err) => {
          if (err) {
            res.render('home/index', { error: `Error populating tags! \n ${err.message}`, categories: {} })
            return
          }
          res.render('home/articles', { articles: category.articles })
        })
      })
    })
  }
}
