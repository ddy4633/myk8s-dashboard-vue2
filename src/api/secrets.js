import request from "@/utils/request";

export function getSecret(ns) {
  return request({
    url : '/secret?ns='+ns,
    method: "get"
  })
}

export function DeleteSercet(ns,name) {
  return request({
    url: '/secret?ns='+ns+'&name='+name,
    method: 'delete'
  })
}

export function CreateSecret(data) {
  return request({
    url: '/secret',
    method: 'post',
    data
  })
}
