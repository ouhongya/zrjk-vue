import axios from '@/utils/request'

export function addFolder(name,state) {
  return axios.get(`/file/addFolder?name=${name}&state=${state}`)
}
export function deleteFile(date) {
  return axios.post(`/file/deleteFile`,date)
}
export function findFile(folderId,page,search,size,sortField,sortWay,state) {
  return axios.get(`/file/findFile?folderId=${folderId}&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&state=${state}`)
}
export function findFileData(page,search,size,sortField,sortWay,state) {
  return axios.get(`/file/findFile?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&state=${state}`)
}
export function findFolder(search,state) {
  return axios.get(`/file/findFolder?search=${search}&state=${state}`)
}
export function findJournal(page,size,sortField,sortWay,state) {
  return axios.get(`/file/findJournal?page=${page}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&state=${state}`)
}
export const downloadFile = url => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.style.height = 0;
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => {
    iframe.remove();
  }, 5 * 60 * 1000);
};
