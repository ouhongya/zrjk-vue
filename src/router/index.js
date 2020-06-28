import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import account from '@/views/system/account/index'
import role from '@/views/system/role/index'
import addRole from '@/views/system/role/addRole/index'
import addAcc from '@/views/system/account/add/index'
import editUser from '@/views/system/account/edit/index'
import editRole from '@/views/system/role/editRole/index'
import file from '@/views/FilePicture/file/index'
import image from '@/views/FilePicture/image/index'
import video from '@/views/FilePicture/video/index'
import index from '@/views/index/index.vue'
import avideo from '@/views/Health/video/index'
import aarticle from '@/views/Health/article/index'
import addArticle from '@/views/Health/article/addArticle/index'
import editArticle from '@/views/Health/article/editArticle/index'
import addVideo from '@/views/Health/video/addVideo/index'
import editVideo from '@/views/Health/video/editVideo/index'
import alabel from '@/views/Health/label/index'
import doctors from '@/views/Health/doctors/index'
import addDoctors from '@/views/Health/doctors/addDoctors/index'
import editDoctors from '@/views/Health/doctors/editDoctors/index'
import reply from '@/views/Reply/reply/index'
import userList from '@/views/UserCenter/userList/index'
import dataHealth from '@/views/data/health/index'
import banner from '@/views/Health/banner/index'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: index,
        meta: {title: '首页', icon: 'dashboard'}
      }
    ]
  },
  /*{
    path: '/system',
    component: Layout,
    name: 'system',
    alwaysShow: true,
    meta: {title: '系统设置', icon: 'example'},
    children: [
      {
        path: 'account',
        name: 'account',
        component: account,
        meta: {title: '账号设置', icon: 'example'}
      },
      {
        path: 'role',
        name: 'role',
        component: role,
        meta: {title: '角色设置', icon: 'example'}
      },
      {
        path: 'addRole',
        name: 'addRole',
        hidden: true,
        component: addRole,
        meta: {title: '添加角色', icon: 'example'}
      },
      {
        path: 'editRole',
        name: 'editRole',
        hidden: true,
        component: editRole,
        meta: {title: '编辑角色', icon: 'editRole'}
      },
      {
        path: 'editUser',
        name: 'editUser',
        hidden: true,
        component: editUser,
        meta: {title: '编辑账号', icon: 'example'}
      },
      {
        path: 'addAcc',
        name: 'addAcc',
        hidden: true,
        component: addAcc,
        meta: {title: '添加账号', icon: 'example'}
      },
      /!*{
        path: 'areaAndCity',
        component: city,
        name: 'areaAndCity',
        meta: {title: '市区', icon: 'example'}
      },
      {
        path: 'label',
        component: label,
        name: 'label',
        meta: {title: '标签', icon: 'example'}
      }*!/
    ]
  },
  {
    path: '/database',
    component: Layout,
    name: 'database',
    alwaysShow: true,
    meta: {title: '资料库', icon: 'database'},
    children: [
      {
        path: 'file',
        name: 'file',
        component: file,
        meta: {title: '文件管理', icon: 'fileUpload'}
      },
      {
        path: 'image',
        name: 'image',
        component: image,
        meta: {title: '图片管理', icon: 'imageUpload'}
      },
      {
        path: 'video',
        name: 'video',
        component: video,
        meta: {title: '视频管理', icon: 'video'}
      },
    ]
  },
  {
    path: '/health',
    component: Layout,
    name: 'health',
    alwaysShow: true,
    meta: {title: '健康主题', icon: 'health'},
    children: [
      {
        path: 'alabel',
        name: 'alabel',
        component: alabel,
        meta: {title: '主题分类'}
      },
      {
        path: 'banner',
        name: 'banner',
        component: banner,
        meta: {title: '首页图片'}
      },
      {
        path: 'aarticle',
        name: 'aarticle',
        component: aarticle,
        meta: {title: '文章发布'}
      },
      {
        path: 'avideo',
        name: 'avideo',
        component: avideo,
        meta: {title: '视频发布'}
      },
      {
        path: 'doctors',
        name: 'doctors',
        component: doctors,
        meta: {title: '医生列表'}
      },
      {
        path: 'addDoctors',
        name: 'addDoctors',
        hidden:true,
        component: addDoctors,
        meta: {title: '添加医生'}
      },
      {
        path: 'editDoctors',
        name: 'editDoctors',
        hidden:true,
        component: editDoctors,
        meta: {title: '编辑医生'}
      },
      {
        path: 'addArticle',
        name: 'addArticle',
        hidden: true,
        component: addArticle,
        meta: {title: '添加文章'}
      },
      {
        path: 'editArticle',
        name: 'editArticle',
        hidden: true,
        component: editArticle,
        meta: {title: '编辑文章'}
      },
      {
        path: 'addVideo',
        name: 'addVideo',
        hidden: true,
        component: addVideo,
        meta: {title: '添加视频'}
      },
      {
        path: 'editVideo',
        name: 'editVideo',
        hidden: true,
        component: editVideo,
        meta: {title: '编辑视频'}
      }
    ]
  },
  {
    path: '/advisory',
    component: Layout,
    name: 'advisory',
    alwaysShow: true,
    meta: {title: '咨询中心', icon: 'advisory'},
    children: [
      {
        path: 'reply',
        name: 'reply',
        component: reply,
        meta: {title: '留言回复'}
      }
    ]
  },
  {
    path: '/UserCenter',
    component: Layout,
    name: 'UserCenter',
    alwaysShow: true,
    meta: {title: '用户中心', icon: 'UserCenter'},
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: userList,
        meta: {title: '用户列表'}
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    name: 'data',
    alwaysShow: true,
    meta: {title: '数据中心', icon: 'data'},
    children: [
      {
        path: 'dataHealth',
        name: 'dataHealth',
        component: dataHealth,
        meta: {title: '资料库统计'}
      }
    ]
  },*/
]
const createRouter = () => new Router({
  mode: 'history',
  routes: constantRoutes
})
// 路由合并
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
router.$addRoutes = (params) => {
  //清空路由,动态路由时生效
  router.matcher = new Router({ mode: 'history' }).matcher
  router.addRoutes(params)
}

export default router
