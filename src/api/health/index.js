import axios from '@/utils/request'
export function addHealthTheme(data) {
  return axios.post(`/health/addHealthTheme`,data)
}
export function updateHealthTheme(data) {
  return axios.post(`/health/updateHealthTheme`,data)
}
export function deleteHealthTheme(data) {
  return axios.get(`/health/deleteHealthTheme?id=${data}`)
}
export function findHealthTheme( page, search, size, sortField, sortWay) {
  return axios.get(`/health/findHealthTheme?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findHealthThemeAll() {
  return axios.get(`/health/findHealthTheme`)
}
export function addArticle(data) {
  return axios.post(`/health/addArticle`,data)
}
export function updateArtcle(data) {
  return axios.post(`/health/updateArtcle`,data)
}
export function upArtcle(data) {
  return axios.get(`/health/upArtcle?id=${data}`)
}
export function downArtcle(data) {
  return axios.get(`/health/downArtcle?id=${data}`)
}
export function deleteArtcle(data) {
  return axios.get(`/health/deleteArtcle?id=${data}`)
}
export function findArtcle(id,page, search, size, sortField, sortWay) {
  return axios.get(`/health/findArtcle?id=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findArtcleById(id) {
  return axios.get(`/health/findArtcleById?id=${id}`)
}

export function addVideo(data) {
  return axios.post(`/health/addVideo`,data)
}
export function upVideo(id) {
  return axios.get(`/health/upVideo?id=${id}`)
}
export function downVideo(id) {
  return axios.get(`/health/downVideo?id=${id}`)
}
export function deleteVideo(id) {
  return axios.get(`/health/deleteVideo?id=${id}`)
}
export function updateVideo(data) {
  return axios.post(`/health/updateVideo`,data)
}
export function findVideo(id,page, search, size, sortField, sortWay) {
  return axios.get(`/health/findVideo?healthThemeId=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findVideoById(id) {
  return axios.get(`/health/findVideoById?id=${id}`)
}
export function updateIndexBanner(id) {
  return axios.get(`/health/updateIndexBanner?url=${id}`)
}
export function findIndexBanner() {
  return axios.get(`/health/findIndexBanner`)
}
