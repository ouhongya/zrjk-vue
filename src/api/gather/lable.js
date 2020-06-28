import axios from '@/utils/request'

export function fetchDataPage(page,searcg,size,sortField,sortWay){
    return axios.get(`/exhibition/findAllETag?page=${page}&search=${searcg}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function addTag(data){
    return axios.post(`/exhibition/addExhibitionTag`,data)
}

export function editTag(data){
    return axios.post(`/exhibition/updateETag `,data)
}


export function deleTag(data){
    return axios.get(`/exhibition/deleteETag?tid=${data}`)
}
