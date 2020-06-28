import axios from '@/utils/request'

export function addBigStarShop(data) {
  return axios.post(`/bigstar/addBigStarShop`, data)
}

export function deleteBigStarShop(data) {
  return axios.get(`/bigstar/deleteBigStarShop?bid=${data}`)
}

export function fetchData(id, page, search, size, sortField, sortWay) {
  return axios.get(`/bigstar/findBigStarShop?bid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function updateBigStarShop(data) {
  return axios.post(`/bigstar/updateBigStarShop`, data)
}

export function findBigStarShopById(data) {
  return axios.get(`/bigstar/findBigStarShopById?bid=${data}`)
}

export function findAllBigStart() {
  return axios.get(`/bigstar/、findBigStar`)
}

export function findBigStarShopClass() {
  return axios.get(`/bigstar/findBigStarShopClass`)
}
