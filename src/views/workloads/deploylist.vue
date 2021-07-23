<template>
  <div class="app-container">
    <div class="demo">
      <select  v-model="selected" @change="fetchData">
        <option v-for="option in options" v-bind:value="option.Name">
          {{ option.Name }}
        </option>
      </select>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :row-class-name="gettableRowClassName"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Deplyment Name" width="300">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="NameSpace" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.NameSpace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Images" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.Images }}
        </template>
      </el-table-column>
      <el-table-column label="Active" width="300" align="center">
        <template slot-scope="scope">
          <p v-html="getStatus(scope.row)"></p>
          <p class="red">{{getMessage(scope.row)}}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.CreateTime }}
        </template>
      </el-table-column>
      <el-table-column label="标签" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.Lables }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-widthd align="center">
        <template slot-scope="scope">
          <el-button
            @click="dialogVisible = true" type="primary" style="margin-left: 16px;">详细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getList } from '@/api/deployments'
import { NewClient } from "@/utils/ws";
import { getnsList} from "@/api/ns";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      podlist: null,
      wsClient: null,
      options: [],
      selected: 'default',
      dialogVisible: false
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
      getList(this.selected).then(response => {
        this.list = response.data
        this.listLoading = false
      })
      // 新建websocket
      this.newSocket()
    },
    newSocket() {
      this.wsClient = NewClient()
      this.wsClient.onmessage =(e)=>{
        // 传递过来的需要先进行json.parse才能进行正常取值，否则会报错未定义
        if(e.data !== 'ping' && JSON.parse(e.data).Type === "deployment"){
          this.list = JSON.parse(e.data).data
          this.$forceUpdate()
        }
      }
    },
    getStatus(row){
      if (row.IsComplete) {
        return "<span class='green'>Running</span>"
      }
      return "<span class='red'>Waiting</span>"
    },
    getMessage(row){
      if (!row.IsComplete){
        return row.Message
      }
      return ''
    },
    gettableRowClassName(row,index){
      if (!row.row.IsComplete){
        return 'warning-row';
      }
      return 'success-row'
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
}
</script>
<style>
  .red {
    font-weight: bolder;
    color: red;
  }
  .green {
    font-weight: bolder;
    color: green;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .demo {
    font-family: sans-serif;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 20px 30px;
    margin-top: 1em;
    margin-bottom: 40px;
    user-select: none;
    overflow-x: auto;
  }
</style>
