const BaseClass = require('../base/BaseClass')
class LazyController extends BaseClass {
  async makeADecision () {
    const { service, app, ctx } = this
    const { $helper } = app
    const ctxBody = ctx.request.body
    const result = await service.LazyService.makeADecision(ctxBody)
    ctx.body = $helper.Result.success(result)
  }
}
module.exports = LazyController
