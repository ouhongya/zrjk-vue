/* 系统设置*/
import addRole from '@/views/system/role/addRole/index'
import addAcc from '@/views/system/account/add/index'
import editUser from '@/views/system/account/edit/index'
import editRole from '@/views/system/role/editRole/index'
import addDoctors from "@/views/Health/doctors/addDoctors/index";
import editDoctors from "@/views/Health/doctors/editDoctors/index";
import addArticle from "@/views/Health/article/addArticle/index";
import editArticle from "@/views/Health/article/editArticle/index";
import addVideo from "@/views/Health/video/addVideo/index";
import editVideo from "@/views/Health/video/editVideo/index";

const addRouterSplice = {
  addRole: {
    path: 'addRole',
    name: 'addRole',
    hidden: true,
    component: addRole,
    meta: {title: '添加角色', icon: 'example'}
  },
  editRole: {
    path: 'editRole',
    name: 'editRole',
    hidden: true,
    component: editRole,
    meta: {title: '编辑角色', icon: 'example'}
  },
  editUser: {
    path: 'editUser',
    name: 'editUser',
    hidden: true,
    component: editUser,
    meta: {title: '编辑账号', icon: 'example'}
  },
  addAcc: {
    path: 'addAcc',
    name: 'addAcc',
    hidden: true,
    component: addAcc,
    meta: {title: '添加账号', icon: 'example'}
  },
  addDoctors: {
    path: 'addDoctors',
    name: 'addDoctors',
    hidden: true,
    component: addDoctors,
    meta: {title: '添加医生'}
  },
  editDoctors:
    {
      path: 'editDoctors',
      name: 'editDoctors',
      hidden: true,
      component: editDoctors,
      meta: {title: '编辑医生'}
    },
  addArticle:
    {
      path: 'addArticle',
      name: 'addArticle',
      hidden: true,
      component: addArticle,
      meta: {title: '添加文章'}
    }
  ,
  editArticle: {
    path: 'editArticle',
    name: 'editArticle',
    hidden: true,
    component: editArticle,
    meta: {title: '编辑文章'}
  },
  addVideo: {
    path: 'addVideo',
    name: 'addVideo',
    hidden: true,
    component: addVideo,
    meta: {title: '添加视频'}
  },
  editVideo: {
    path: 'editVideo',
    name: 'editVideo',
    hidden: true,
    component: editVideo,
    meta: {title: '编辑视频'}
  }
}

export default addRouterSplice
