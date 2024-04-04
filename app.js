const Application = require('./application')
// create the instance
const app = new Application()

// start the application instance at port 3000(default)
app.start(process.env.LEANCLOUD_APP_PORT || process.env.PORT || app.$config.port || 3000)
