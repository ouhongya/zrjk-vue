import Layout from '@/layout'
import addRouterSplice from '@/utils/router'
import { map, iconMap } from '@/utils/icon'
import store from '@/store'

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(list) {
  // 处理后的路由结果
  const arr = []
  let button = []
  for (let x = 0; x < list.length; x++) {
    const obj = {}
    obj.name = list[x].name
    obj.component = Layout
    obj.path = list[x].path
    obj.alwaysShow = true
    const metaObj = {}
    metaObj.title = list[x].meta.title
    for (const [key, val] of iconMap()) {
      if (list[x].path === key) {
        metaObj.icon = val
      }
    }
    obj.meta = metaObj
    obj.children = new Array()
    for (let i = 0; i < list[x].childrens.length; i++) {
      const childrenObj = {}
      childrenObj.path = list[x].childrens[i].path
      childrenObj.name = list[x].childrens[i].name
      const parse = JSON.parse(JSON.stringify(list[x].childrens[i].component))
      for (const [key, val] of map()) {
        if (parse === key) {
          childrenObj.component = val
        }
      }
      const childrenMeta = {}
      childrenMeta.title = list[x].childrens[i].meta.title
      childrenMeta.icon = list[x].childrens[i].meta.icon
      childrenObj.meta = childrenMeta
      obj.children.push(childrenObj)
      if (list[x].childrens[i].buttonAlias !== null) {
        list[x].childrens[i].buttonAlias.forEach(item => {
          button.push(item)
        })
      }
    }
    store.dispatch('user/setButtonList', button)
    arr.push(obj)
  }
  arr.forEach(item => {
    if(item.name==='system'){
      item.children.push(addRouterSplice.editUser)
      item.children.push(addRouterSplice.addAcc)
      item.children.push(addRouterSplice.addRole)
      item.children.push(addRouterSplice.editRole)
    }
    if(item.name==='health'){
      item.children.push(addRouterSplice.addDoctors)
      item.children.push(addRouterSplice.editDoctors)
      item.children.push(addRouterSplice.addArticle)
      item.children.push(addRouterSplice.editArticle)
      item.children.push(addRouterSplice.addVideo)
      item.children.push(addRouterSplice.editVideo)
    }
    item.children.forEach(val=>{
      val.meta.icon=item.meta.icon
    })
  })
  return arr
}
