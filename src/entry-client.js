import {createApp} from './app.js'
const {app, router} = createApp()

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始化路由 resolve 后执行，以便我们不会二次预取 (double-fetch) 已有数据。
  // 使用 `router.beforeResolve()` ， 以确保所有异步组件都 resolve 。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心之前没有渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }
    // 如果有加载指示器(loading indicator), 就触发
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        // return c.asyncData({store, route: to})
      }
    })).then(() => {
      // 停止加载指示器 (loading indicator)
      next()
    }).catch(next)
  })
  app.$mount('#app')
})