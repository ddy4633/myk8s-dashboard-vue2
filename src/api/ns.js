import request from '@/utils/request'

// 获取当前机器的所有Namespace
export function getnsList(){
  return request({
    url: '/nslist',
    method: 'get'
    })
}
