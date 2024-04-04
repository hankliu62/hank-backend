const BaseClass = require('../base/BaseClass')
class UserController extends BaseClass {
  async getUser () {
    const { service, app, ctx } = this
    const { $helper } = app
    const user = await service.UserService.getCurrentUser()
    ctx.body = $helper.Result.success(user)
  }
}
module.exports = UserController
