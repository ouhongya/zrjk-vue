import request from '@/utils/request'

export function addRole(data) {
  return request.post(`/account/addRole`,data)
}
export function getRoleList() {
  return request.get(`/account/findAllFB`)
}
export function editRole(data) {
  return request.post(`/account/updateRole`,data)
}
export function getRoleId(id) {
  return request.get(`/account/findRoleById?id=${id}`)
}

export function fetchData(page,search,size,sortField,sortWay) {
  return  request.get(`/account/findAllRole?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function deleteRole(data) {
  return  request.get(`/account/deleteRole?id=${data}`)
}
