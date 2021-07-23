import request from "@/utils/request";

export function getService(ns) {
  return request({
    url: '/service?ns='+ns,
    method: 'get'
  })
}
