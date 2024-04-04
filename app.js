const Application = require('./application')
// create the instance
const app = new Application()

// start the application instance at port 3000(default)
app.start(app.$config.port || 3000)
