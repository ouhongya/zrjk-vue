import axios from '@/utils/request'

export function findWXUser(page, search, size, sortField, sortWay) {
  return axios.get(`/WXUser/findWXUser?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findFollowVideo(id, page, search, size, sortField, sortWay) {
  return axios.get(`/WXUser/findFollowVideo?uid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findFollowHealthTheme(id, page, search, size, sortField, sortWay) {
  return axios.get(`/WXUser/findFollowHealthTheme?uid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findFollowDoctor(id, page, search, size, sortField, sortWay) {
  return axios.get(`/WXUser/findFollowDoctor?uid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findFollowArticle(id, page, search, size, sortField, sortWay) {
  return axios.get(`/WXUser/findFollowArticle?uid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function addColumn(data) {
  return axios.post(`/WXUser/addColumn?name=${data}`)
}

export function deleteColumn(data) {
  return axios.get(`/WXUser/deleteColumn?cid=${data}`)
}

export function findColumn() {
  return axios.get(`/WXUser/findColumn`)
}

export function addColumnContent(cid,content,uid) {
  return axios.post(`/WXUser/addColumnContent?cid=${cid}&content=${content}&uid=${uid}`)
}
