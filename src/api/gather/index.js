import axios from  '@/utils/request'
export function addCity(data) {
  return axios.post(`/exhibition/addCity?name=${data}`)
}
export function addArea(data) {
  return axios.post(`/exhibition/addArea`,data)
}
export function deleteArea(data) {
  return axios.get(`/exhibition/deleteArea?aid=${data}`)
}
export function deleteCity(data) {
  return axios.get(`/exhibition/deleteCity?cid=${data}`)
}
export function findCity(data) {
  return axios.get(`/exhibition/findCity`)
}
export function updateArea(data) {
  return axios.post(`/exhibition/updateArea`,data)
}
export function updateCity(data) {
  return axios.post(`/exhibition/updateCity`,data)
}
export function findArea(cid,page,search,size,sortField,sortWay) {
  return axios.get(`/exhibition/findAreaByCid?cid=${cid}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findAreaAndCity() {
  return axios.get(`/exhibition/findCityArea`)
}

