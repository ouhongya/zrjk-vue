import axios from '@/utils/request'

export  function fetchData(page,search,size,sortField,sortWay) {
  return axios.get(`/exhibition/findAllExhibition?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&status=${status}`)
}

export  function deleteExhibition(data) {
  return axios.get(`/exhibition/deleteExhibition?eid=${data}`)
}

export  function updateExhibitionDetails(data) {
  return axios.post(`/exhibition/updateExhibitionDetails`,data)
}

export  function updateExhibitionHall(data) {
  return axios.post(`/exhibition/updateExhibitionHall`,data)
}

export  function addExhibition(data) {
  return axios.post(`/exhibition/addExhibition`,data)
}

export function tagList(){
  return axios.get(`/exhibition/findAllETag`)
}

export function exhibitionHallList(){
  return axios.get(`/exhibition/findAllExhibitionHall`)
}
export function exhibitionUpDown(eid,status){
  return axios.get(`/exhibition/exhibitionUpDown?eid=${eid}&status=${status}`)
}

export function findExhibitionDetails(data){
  return axios.get(`/exhibition/findExhibitionDetails?eid=${data}`)
}
export function findExhibitionById(data){
  return axios.get(`/exhibition/findExhibitionById?eid=${data}`)
}

export function updateExhibition(data) {
  return axios.post(`/exhibition/updateExhibition`,data)
}
