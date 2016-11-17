const Category = require('mongoose').model('Category')

module.exports = {
  allGet: (req, res) => {
    Category.find({}).then(categories => {
      res.render('admin/category/all', {categories: categories})
    })
  },

  createGet: (req, res) => {
    res.render('admin/category/create')
  },

  createPost: (req, res) => {
    let category = req.body
    if (!category.name) {
      let errorMsg = 'Category name cannot be null!'
      res.render('admin/category/create', {error: errorMsg})
    }
    Category.findOne({name: category.name}).then(existingCategory => {
      if (existingCategory) {
        // category with such a name already exists!
        let errorMsg = 'Category with such a name already exists!'
        res.render('admin/category/create', {error: errorMsg})
        return
      }
      Category.create(category).then(() => {
        res.redirect('/admin/category/all')
      })
    })
  }
}
