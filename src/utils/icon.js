import account from '@/views/system/account/index'
import role from '@/views/system/role/index'
import city from '@/views/system/city/index'
import file from '@/views/FilePicture/file/index'
import image from '@/views/FilePicture/image/index'
import video from '@/views/FilePicture/video/index'
import avideo from '@/views/Health/video/index'
import aarticle from '@/views/Health/article/index'
import alabel from '@/views/Health/label/index'
import doctors from '@/views/Health/doctors/index'
import reply from "@/views/Reply/reply/index";
import userList from '@/views/UserCenter/userList/index'
import dataHealth from '@/views/data/health/index'
import banner from '@/views/Health/banner/index'

export function map() {
  const map = new Map()
  map.set('account', account)
  map.set('role', role)
  map.set('areaAndCity', city)
  map.set('fileUpload', file)
  map.set('imageUpload', image)
  map.set('video', video)
  map.set('alabel', alabel)
  map.set('aarticle', aarticle)
  map.set('avideo', avideo)
  map.set('doctors', doctors)
  map.set('reply', reply)
  map.set('userList', userList)
  map.set('dataHealth', dataHealth)
  map.set('banner', banner)
  return map
}

export function iconMap() {
  const arr = new map()
  arr.set('/system', 'example')
  arr.set('/database', 'database')
  arr.set('/health', 'health')
  arr.set('/advisory', 'advisory')
  arr.set('/UserCenter', 'UserCenter')
  arr.set('/data', 'data')
  return arr
}
