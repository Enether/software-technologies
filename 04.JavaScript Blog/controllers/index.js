/**
 * this module exports an object holding ANOTHER OBJECT holding functions for each of the pages the controllers manages
 * ex: homeControllers returns an object holding as key the page and as value a functions
 * {
    index: (req, res) => {
      res.render('home/index')
    },
    about: (req, res) => {
      res.render('home/about')
    }
   }
 */
const userController = require('./user-controller')
const homeController = require('./home-controller')
const articleController = require('./article-controller')
const adminController = require('./admin')
const tagController = require('./tag-controller')

module.exports = {
  user: userController,
  home: homeController,
  article: articleController,
  admin: adminController,
  tag: tagController
}

