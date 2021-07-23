const NewClient=function() {
  var ws = new WebSocket('ws://192.168.88.130:8080/v1/ws');
  ws.onopen = function() {
    console.log('open')
  }
  ws.onclose= function(e) {
    console.log("close",e.reason)
  }
  ws.onerror = function(e) {
    console.log(e)
  }
  return ws
}

export {NewClient}
