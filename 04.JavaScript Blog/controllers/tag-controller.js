const mongoose = require('mongoose')
const Tag = mongoose.model('Tag')
const User = mongoose.model('User')

module.exports = {
  showArticles: (req, res) => {
    let tagName = req.params.tag

    Tag.findOne({ name: tagName }).populate('articles').then(tag => {
      if (!tag) {
        res.render('home/index', { error: `No tag with the name ${tagName} exists!`, categories: {} })
        return
      }
      let populateOptions = [{ path: 'articles.author', model: User }, { path: 'articles.tags', model: Tag }]
      Tag.populate(tag, populateOptions, (err, tag) => {
        if (err) {
          res.render('home/index', { error: `Error populating tags! \n ${err.message}`, categories: {} })
          return
        }
        res.render('tag/articles', { articles: tag.articles, tag: tag })
      })
    })
  }
}
