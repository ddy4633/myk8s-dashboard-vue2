<template>
  <div style="padding-left: 30px;padding-top: 30px">
    请选择ContainerName
    <el-select
    @change="containerChange" placeholder="选择名称"
    v-model="selectdContainer">
      <el-option
      v-for="c in containers"
      :label="c.Name"
      :value="c.Name"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="showLogs"> 获取日志</el-button>
    <el-button @click="logs=''">清空日志</el-button>
    <div class="logs" ref="logs">
      {{logs}}
    </div>
  </div>
</template>

<script>
import { getPodContainersName,getPodLogs } from '@/api/pods'
import request from '@/utils/request'

export default {
  data(){
    return{
      containers: [],
      selectdContainer: "",
      logs: '',
      ns: '',
      pod: '',
      tail: 300,
    }
  },
  created() {
    const ns = this.$route.params.ns
    const pod = this.$route.params.pod
    if (ns===undefined || pod === undefined) {
      alert('参数错误')
      this.$router.push({name:"pods"}) // 返回pod的页面
    }else {
      this.ns = ns
      this.pod = pod
      getPodContainersName(this.ns, this.pod).then(rsp => {
        console.log(rsp)
        this.containers = rsp.data
      })
    }
  },
  methods: {
    containerChange() {
      getPodLogs(this.ns,this.pod,this.selectdContainer).then(res=>{
        this.logs = rsp.data
      })
    },
    showLogs(){
      request({
        url: '/pods/logs?ns=' + this.ns + '&pname=' + this.pod + '&cname=' + this.selectdContainer + '&tail=' + this.tail,
        methods: 'GET',
        onDownloadProgress: e=>{
          console.log(e)
          const dataChunk = e.currentTarget.response
          this.logs += dataChunk
          if (this.$refs['logs'] !== undefined && this.$refs['logs']){
            this.$refs['logs'].scrollTop = this.$refs['logs'].scrollHeight;
          }
        }
      }).catch(e=>{
        this.$router.push({name:"pods"})
      });
    }
  },
}
</script>

<style>
.logs{
  overflow: auto;
  margin:10px auto;
  min-height: 750px;
  max-height: 900px;
  border: solid 1px black;
  background-color: #454545;
  padding: 10px;
  color:#27aa5e;
  line-height: 21pt;
  white-space: pre;
  width: 90%
}
</style>
