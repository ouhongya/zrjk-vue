import axios from '@/utils/request'

export function  findHealthTheme(page,search,size,sortField,sortWay) {
  return  axios.get(`/datacenter/findHealthTheme?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function  findArticle(page,search,size,sortField,sortWay) {
  return  axios.get(`/datacenter/findArticle?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function  findDoctor(page,search,size,sortField,sortWay) {
  return  axios.get(`/datacenter/findDoctor?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function  findVideo(page,search,size,sortField,sortWay) {
  return  axios.get(`/datacenter/findVideo?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
