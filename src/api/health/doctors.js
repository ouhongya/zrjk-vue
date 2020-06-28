import axios from '@/utils/request'
export function addDoctors(data) {
  return axios.post(`/health/addDoctor`,data)
}
export function updateDoctors(data) {
  return axios.post(`/health/updateDoctor`,data)
}
export function findDoctorById(data) {
  return axios.get(`/health/findDoctorById?id=${data}`)
}
export function deleteDoctors(data) {
  return axios.get(`/health/deleteDoctor?id=${data}`)
}
export function findDoctors(id,page, search, size, sortField, sortWay) {
  return axios.get(`/health/findDoctor?healthThemeId=${id}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findDoctorsAll() {
  return axios.get(`/health/findDoctor?healthThemeId=default`)
}
export function findHealthThemeAll() {
  return axios.get(`/health/findHealthTheme`)
}
