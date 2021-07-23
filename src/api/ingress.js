import request from "@/utils/request";

// 获取所有的 Ingress列表
export function getIngressList(ns) {
  return request({
    url: '/ingress?ns=' + ns,
    method: 'get',
  })
}

// 新建一个Ingress对象
export function CreateIngress(data) {
  return request({
    url: '/ingress',
    method: 'post',
    data
  })
}

// 获取Ingress的Annotations
export function GetAnnotations() {
  return request({
    url: '/ingress/annotations',
    method: 'get',
  })
}

// 删除Ingress对象
export function DeleteIngress(ns,name) {
  return request({
    url: '/ingress?ns'+ ns + '&name=' + name,
    method: 'delete',
    })
}
