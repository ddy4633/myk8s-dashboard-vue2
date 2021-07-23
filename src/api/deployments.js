import request from '@/utils/request'

//获取所有 指定ns下的deployments
export function getList(ns) {
  console.log("执行了")
  return request({
    url: '/deployments?ns=' + ns,
    method: 'get',
  })
}
