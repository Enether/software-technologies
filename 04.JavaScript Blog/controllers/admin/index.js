// all admin related controllers
const userController = require('./user-controller')
const categoryController = require('./category-controller')

module.exports = {
  user: userController,
  category: categoryController
}
