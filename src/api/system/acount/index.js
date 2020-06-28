  import axios from '@/utils/request'

  export function addUser(data) {
    return axios.post(`/account/addAccount`, data)
  }

  export function finByUserId(id) {
    return axios.get(`/account/findAccountFB?id=${id}`)
  }

  export function fetchData(page, search, size, sortField, sortWay) {
    return axios.get(`/account/findAllAccount?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
  }

  export function deleteUser(data) {
    return axios.get(`/account/deleteAccount?uid=${data}`)
  }

  export function fetchDataByRole() {
    return axios.get(`/account/findAllRole`)
  }

  export function updateAccount(data) {
    return axios.post(`/account/updateAccount`,data)
  }
