import axios from '@/utils/request'

export function fetchData(page,search,size,sortField,sortWay) {
  return axios.get(`/bigstar/、findBigStar?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function addBigStar(data) {
  return axios.post(`/bigstar/addBigStar`,data)
}

export function addBigStarAlbum(id,data) {
  return axios.post(`/bigstar/addBigStarAlbum?bid=${id}`,data)
}

export function addBigStarShop(data) {
  return axios.post(`/bigstar/addBigStarShop`,data)
}

export function deleteBigStar(data) {
  return axios.get(`/bigstar/deleteBigStar?bid=${data}`)
}

export function deleteBigStarAlbum(data) {
  return axios.get(`/bigstar/deleteBigStarAlbum?bid=${data}`)
}

export function findBigStarAlbum(data) {
  return axios.get(`/bigstar/findBigStarAlbum?bid=${data}`)
}

export function findBigStarById(data) {
  return axios.get(`/bigstar/findBigStarById?bid=${data}`)
}

export function signUDBigStarShop(id,status) {
  return axios.post(`/bigstar/signUDBigStarShop?bid=${id}&status=${status}`)
}

export function updateBigStar(data) {
  return axios.post(`/bigstar/updateBigStar`,data)
}

export function updateBigStarShop(data) {
  return axios.post(`/bigstar/updateBigStarShop`,data)
}

export function updateBigStarAlbum(data) {
  return axios.post(`/bigstar/updateBigStarAlbum`,data)
}


