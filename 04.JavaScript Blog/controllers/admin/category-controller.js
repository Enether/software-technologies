const Category = require('mongoose').model('Category')

module.exports = {
  allGet: (req, res) => {
    Category.find({}).then(categories => {
      res.render('admin/category/all', { categories: categories })
    })
  },

  createGet: (req, res) => {
    res.render('admin/category/create')
  },

  createPost: (req, res) => {
    let category = req.body
    if (!category.name) {
      let errorMsg = 'Category name cannot be null!'
      res.render('admin/category/create', { error: errorMsg })
    }
    Category.findOne({ name: category.name }).then(existingCategory => {
      if (existingCategory) {
        // category with such a name already exists!
        let errorMsg = 'Category with such a name already exists!'
        res.render('admin/category/create', { error: errorMsg })
        return
      }
      Category.create(category).then(() => {
        res.redirect('/admin/category/all')
      })
    })
  },

  editGet: (req, res) => {
    let categoryId = req.params.id

    Category.findById(categoryId).then(category => {
      if (!category) {
        res.render('admin/category/all', { error: 'Category does not exist!' })
      }

      res.render('admin/category/edit', { category: category })
    })
  },

  editPost: (req, res) => {
    let categoryId = req.params.id

    let editArgs = req.body
    if (!editArgs.name) {
      let errorMsg = 'Category name cannot be null!'
      Category.findById(categoryId).then(category => {
        res.render('admin/category/edit', { category: category, error: errorMsg })
      })
    } else {
      Category.findOne({ name: editArgs.name }).then(existingCategory => {
        if (existingCategory) {
          let errorMsg = `A category with the name ${editArgs.name} already exists!`
          Category.findById(categoryId).then(category => {
            res.render('admin/category/edit', { category: category, error: errorMsg })
          })
        } else {
          Category.findOneAndUpdate({_id: categoryId}, {name: editArgs.name}).then(category => {
            res.redirect('/admin/category/all')
          })
        }
      })
    }
  }
}
