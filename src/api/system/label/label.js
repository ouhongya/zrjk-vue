import request from '@/utils/request'

export function addLabel(data) {
  return request.post('/exhibition/addExhibitionTag',data)
}
