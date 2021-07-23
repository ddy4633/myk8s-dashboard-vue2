import request from '@/utils/request'

//获取所有 指定ns下的deployments
export function getPodList(ns,page) {
  return request({
    url: '/pods?ns=' + ns + "&current=" + page,
    method: 'get',
  })
}

// 获取Pod的容器列表
export function getPodContainersName(ns,podname){
  return request({
    url: '/pods/containers?ns=' + ns + '&name=' + podname,
    method: 'get',
  })
}

// 获取Container的日志
export function getPodLogs(ns,podName,conTanerName){
  return request({
    url: '/pods/logs?ns='+ns+'&pname='+podName+'&cname='+conTanerName,
    method: 'get',
  })
}

// 删除指定的pod
export function deletePod(ns,name) {
  return request({
    url: '/pods?ns=' + ns + '&name=' + name,
    method: 'delete',
  })
}
