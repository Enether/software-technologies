const controllers = require('./../controllers')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/user/register', controllers.user.registerGet)
  app.post('/user/register', controllers.user.registerPost)

  app.get('/user/login', controllers.user.loginGet)
  app.post('/user/login', controllers.user.loginPost)

  app.get('/user/logout', controllers.user.logout)

  app.get('/article/create', controllers.article.createGet)
  app.post('/article/create', controllers.article.createPost)
  app.get('/article/details/:id', controllers.article.detailsGet)

  app.get('/article/edit/:id', controllers.article.editGet)
  app.post('/article/edit/:id', controllers.article.editPost)

  app.get('/article/delete/:id', controllers.article.deleteGet)
  app.post('/article/delete/:id', controllers.article.deletePost)
  // EVERYTHING BELOW REQUIRES AUTH
  // admin authentication middleware
  app.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnUrl = req.url

      res.redirect('/user/login')
    } else {
      req.user.isAdmin().then(isAdmin => {
        if (!isAdmin) {
          res.redirect('/')
        }
        next()
      })
    }
  })
  app.get('/admin/user/all', controllers.admin.user.allUsersGet)
  app.get('/admin/user/:id/edit', controllers.admin.user.editGet)
  app.post('/admin/user/:id/edit', controllers.admin.user.editPost)
  app.get('/admin/user/:id/delete', controllers.admin.user.deleteGet)
  app.post('/admin/user/:id/delete', controllers.admin.user.deletePost)
  app.get('/admin/category/all', controllers.admin.category.allGet)
  app.get('/admin/category/create', controllers.admin.category.createGet)  
  app.post('/admin/category/create', controllers.admin.category.createPost)
}

