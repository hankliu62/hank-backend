module.exports = (app) => {
  const { router, controller } = app
  router.post('/lazy/comment/makeADecision', controller.LazyController.makeADecision)
}
