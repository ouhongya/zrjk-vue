import axios from '@/utils/request'

export function findAllExhibitionHall(page,searcg,size,sortField,sortWay){
    return axios.get(`/exhibition/findAllExhibitionHall?page=${page}&search=${searcg}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function addExhibitionHall(data){
    return axios.post(`/exhibition/addExhibitionHall`,data)
}

export function updateExhibitionHall(data){
    return axios.post(`/exhibition/updateExhibitionHall`,data)
}

export function deleteExhibitionHall(data){
    return axios.get(`/exhibition/deleteExhibitionHall?hid=${data}`)
}
