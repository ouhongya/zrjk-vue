import axios from '@/utils/request.js'

export function fetchData(city,page,search,size,sortField,sortWay,status) {
  return axios.get(`/assemble/findAllAssemble?cityId=${city}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&status=${status}`)
}

export function findById(id,page,search,size,sortField,sortWay,status) {
  return axios.get(`/assemble/findAllAssemble?eid=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&status=${status}`)
}

export function findAssembleDetails(data) {
  return axios.get(`/assemble/findAssembleDetails?assembleId=${data}`)
}
