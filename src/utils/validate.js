import store  from '@/store'

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function hasPermission(permisson) {
    let buttonList = store.getters.buttonList
    return buttonList.indexOf(permisson) > -1;
}
export function message(mes,type) {
  this.$message({
    message: mes,
    type: type
  });
}
