import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken,removeToken} from '@/utils/auth'
import {addRouter} from '@/utils/addRouter'
import {getRouterList,userInfo} from '@/api/user'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login']
let data = false
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path !== '/login') {
      if (data) {
        next()
      } else {
        await gotoRouter(to, next)
      }
    } else {
      next({ path: '/' })
      Message({ message: '您已经登录', type: 'info' })
      next('/')
    }
  } else {
    data = false
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
function gotoRouter(to, next) {
  getRouterList()
    .then(res => {
      const asyncRouter = addRouter(res.data)
      getUsername(to, next)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      return asyncRouter
    })
    .then(asyncRouter => {
      router.addRoutes(asyncRouter)
      data = true
      store.dispatch('user/setRouterList', asyncRouter)
      next({ ...to, replace: true })
    })
    .catch(e => {
      removeToken()
    })
}
function getUsername(to, next) {
  userInfo().then( (res)=>{
    if(res.data){
      store.dispatch('user/setName', res.data.trueName)
      next()
    }
  })
}
