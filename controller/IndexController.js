const BaseClass = require('../base/BaseClass')
class LazyController extends BaseClass {
  async pong () {
    const { ctx } = this
    // LeanCloud 健康检查
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = `${new Date().valueOf()}`
  }
}
module.exports = LazyController