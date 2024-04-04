const Router = require('koa-router')
const chalk = require('chalk')
const path = require('path')
const AV = require('leanengine')
const MapLoader = require('../base/MapClass')
// const { errorLogger } = require('../common/log4')
const { scanFilesByFolder, methodToMiddleware } = require('../utils.js')

const initConfig = function (app) {
  let config = {}
  const projectConfig = require('../config.json')
  config = { ...config, ...projectConfig }
  app.$config = config
};

const initController = function (app) {
  const map = {}
  scanFilesByFolder('./controller/', function (filename, Controller) {
    const proto = Controller.prototype
    const ret = {}
    const keys = Object.getOwnPropertyNames(proto)
    for (const key of keys) {
      if (key === 'constructor') {
        continue
      }
      ret[key] = methodToMiddleware(Controller, key)
    }
    map[filename] = ret
  });

  app.controller = map
};

const initRouter = function (app) {
  const router = new Router()
  scanFilesByFolder('./routes', (filename, route) => {
    route({ ...app, router })
  });
  app.$router = router
  app.use(router.routes())
};

const initService = function (app) {
  const serviceMap = {}
  scanFilesByFolder('./service/', function (filename, Service) {
    serviceMap[filename] = Service
  });
  Object.defineProperty(app.context, 'service', {
    get () {
      return new MapLoader({ ctx: this, properties: serviceMap })
    }
  })
  app.service = serviceMap
};

const initExtend = function (app) {
  scanFilesByFolder('./extends', (filename, extendFn) => {
    app['$' + filename] = Object.assign(app['$' + filename] || {}, extendFn(app))
  });
}

const initMiddleware = function (app) {
  const middleware = {}
  scanFilesByFolder('./middleware', (filename, middlewareConf) => {
    middleware[filename] = middlewareConf(app)
  });
  app.$middleware = middleware
  initDefaultMiddleware(app)
};

const initLog4 = function (app) {
  app.$log4 = require('../common/log4')
};

const initNodeCache = function (app) {
  const NodeCache = require('node-cache')
  app.$nodeCache = new NodeCache()
};

const initSchedule = function (app) {
  const schedule = require('node-schedule')
  const { commonLogger } = app.$log4
  const schedules = {}
  scanFilesByFolder('./schedule', (filename, scheduler) => {
    if (scheduler(app).open) {
      schedules[filename] = schedule.scheduleJob(scheduler(app).interval, scheduler(app).handler)
      console.log(chalk.cyan('the schedule：' + filename, 'started！'))
      commonLogger.info('the schedule：' + filename, 'started')
    } else {
      console.log(chalk.yellow('the schedule：' + filename, 'set to not start！'))
      commonLogger.info('the schedule：' + filename, 'set to not start！')
    }
  })
  app.$schedule = schedules
};

const initDefaultMiddleware = function (app) {
  const json = require('koa-json')
  const onerror = require('koa-onerror')
  const koaStatic = require('koa-static')
  const koaBody = require('koa-body')
  const cors = require('koa2-cors')

  // static resource - one day's cache
  const opts = process.env.NODE_ENV === 'production' ? { maxage: 24 * 60 * 60 * 1000 } : {}
  app.use(koaStatic(path.resolve(__dirname, '../public'), opts))

  app.use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 3000 * 1024 * 1024
      },
    })
  );
  app.use(cors())
  app.use(json())
  onerror(app)
};

const initSettings = function () {
  // rewrite console function at prd env
  console.log = (function (ori) {
    return function () {
      if (process.env.NODE_ENV !== 'production') {
        ori.apply(this, arguments)
      }
    }
  })(console.log)
};

// LeanCloud 相关的配置
const initLeanEngine = function (app) {
  // 判断是否为 LeanCloud 环境
  if (process.env.LEANCLOUD_APP_ID) {
    AV.init({
      serverURLs: 'https://tlj1ryb7.lc-cn-n1-shared.com',
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
      masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
    });

    // Comment the following line if you do not want to use masterKey.
    AV.Cloud.useMasterKey()

    app.use(AV.koa2())
  }
}

module.exports = {
  initSettings,
  initController,
  initRouter,
  initMiddleware,
  initService,
  initConfig,
  initLog4,
  initNodeCache,
  initExtend,
  initSchedule,
  initLeanEngine
};
