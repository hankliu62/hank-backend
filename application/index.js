const Koa = require('koa')
const chalk = require('chalk')

const { initConfig, initController, initRouter, initService, initLog4, initExtend, initMiddleware, initNodeCache, initSchedule, initSettings, initLeanEngine } = require('./loader')

class Application extends Koa {
  constructor () {
    super()

    this.$app = this
    this.beforeAll(this)
    initConfig(this)
    initNodeCache(this)
    initLeanEngine(this)
    initMiddleware(this)
    initLog4(this)
    initExtend(this)
    initService(this)
    initController(this)
    initRouter(this)
    initSettings()
    this.afterAll(this)
  }

  /**
   * Initialize the middleware should be load before others
   * @param app
   */
  beforeAll () {
    // do something...
  }

  /**
   * Initialize the middleware should be load after others
   * @param app
   */
  afterAll (app) {
    // start schedules
    initSchedule(app)
  }

  start (port) {
    this.$app.listen(port, () => {
      console.log(chalk.green('server start on ' + port + '..........'))
    });
  }
}

module.exports = Application
