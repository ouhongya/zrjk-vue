import axios from '@/utils/request'

export function fetchData(page,search,size,sortField,sortWay) {
  return axios.get(`recommendation/findRecom?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findRecomExhibition(page,id,search,size,sortField,sortWay) {
  return axios.get(`/recommendation/findRecomExhibition?page=${page}&rid=${id}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function optionEnd(id,data) {
  return axios.post(`/recommendation/optionEnd?id=${id}`,data)
}
