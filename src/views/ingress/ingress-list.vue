<template>
<div class="aap-containers">
  <div class="demo">
    <el-select  v-model="selected" @change="fetchData">
      <el-option
        v-for="option in options"
        v-bind:value="option.Name"
      >
        {{ option.Name }}
      </el-option>
    </el-select>
  </div>
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="Loading"
    border
    fit
    highlight-current-row
  >
    <el-table-column align="center" label="序号" width="95">
      <template slot-scope="scope">
        {{ scope.$index+1 }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100">
      <template slot-scope="scope">
        <p></p>
      </template>
    </el-table-column>
    <el-table-column label="名称" width="350">
      <template slot-scope="scope">
        <p>{{ scope.row.Name }}</p>
      </template>
    </el-table-column>
    <el-table-column label="命名空间" width="110" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.NameSpace }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="170" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.CreateTime }}</span>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { getIngressList } from "@/api/ingress";
import { NewClient } from "@/utils/ws";
import { getnsList } from "@/api/ns";

export default {
  data(){
    return{
      list: null,
      listLoading: true,
      wsClient: null,
      selected: 'default',
      options: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // 获取ns列表信息
      getnsList().then(res => {
        this.options = res.data
      })
      // 获取ingress信息
      getIngressList(this.selected).then(rep => {
        console.log(rep.data)
        this.list = rep.data
        this.listLoading = false
      })
      // 建立websocket连接
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== "ping") {
          const object = JSON.parse(e.data)
          if (object.type === "ingress"){
            this.list = object.result.data
            this.$forceUpdate()
          }
        }
      }
    },
    getStatus(row){
      if(row.IsComplete)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
    getMessage(row){
      if(!row.IsComplete){
        return row.Message
      }
      return ''
    },
  }
}
</script>

<style scoped>
.red{color: #d20000
}
.green{color:green}
</style>
