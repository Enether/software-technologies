const controllers = require('./../controllers')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/user/register', controllers.user.registerGet)
  app.post('/user/register', controllers.user.registerPost)

  app.get('/user/login', controllers.user.loginGet)
  app.post('/user/login', controllers.user.loginPost)

  app.get('/user/logout', controllers.user.logout)
}

