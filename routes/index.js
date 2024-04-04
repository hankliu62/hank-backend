module.exports = (app) => {
  const { router, controller } = app
  // LeanCloud 的健康检查
  router.get('/', controller.IndexController.pong)
}
