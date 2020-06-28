import request from '@/utils/request'
import qs from 'qs'
export function login(data) {
  return request.post(`/login`,qs.stringify(data))
}

export function getInfo(token) {
  return request({
    url: '/account/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getRouterList() {
  return request({
    url:'/account/findAccountPower',
    method:'get'
  })
}
export function file(data) {
  return request.post('/upload',data)
}

export function userInfo() {
  return request.get('/account/findNowUser')
}


export function files(data) {
  return request.post(`/health/videoUpload`,data)
}


