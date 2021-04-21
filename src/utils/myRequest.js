import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: "http://192.168.26.128:8080", // url = base url + request
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
export default service
