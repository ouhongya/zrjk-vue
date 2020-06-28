import axios from '@/utils/request'

export function fetchDataPage(page,searcg,size,sortField,sortWay){
  return axios.get(`/bigstar/findBigStarShopClass?page=${page}&search=${searcg}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function addTag(data){
  return axios.post(`/bigstar/addBigStarShopClass`,data)
}

export function editTag(data){
  return axios.post(`/bigstar/updateBigStarShopClass`,data)
}

export function deleTag(data){
  return axios.get(`/bigstar/deleteBigStarShopClass?bid=${data}`)
}
