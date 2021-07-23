<template>
  <div class="app-container">
    <div>
      <el-card class="box-card">
        <div>
          <el-form :inline="true">
            <el-form-item label="选择名称空间">
              <el-select v-model="selectns" @change="fetchData">
                <el-option
                  v-for="ns in nslist"
                  v-bind:value="ns.Name"
                >
                  {{ ns.Name }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-button type="success" round>
                新建Secret
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card">
        <el-table
        v-loading="listLoading"
        :data="secretlist"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 80%"
        >
          <el-table-column label="名称" >
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="命名空间" >
            <template slot-scope="scope">
              <p>{{ scope.row.NameSpace }}</p>
            </template>
          </el-table-column>
          <el-table-column label="账号类型" >
            <template slot-scope="scope">
              <p>{{ scope.row.Type }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" >
            <template slot-scope="scope">
              <p>{{ scope.row.CreateTime }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle @click="()=>deleteSecret(scope.row.NameSpace,scope.row.Name)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getnsList } from "@/api/ns";
import { getSecret,DeleteSercet } from "@/api/secrets";
import {NewClient} from "@/utils/ws";

export default {
  data(){
    return{
      nslist: [],
      selectns: 'default',
      listLoading: true,
      secretlist: null,
      wsclient: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(){
      this.listLoading = false
      // 获取ns列表信息
      getnsList().then(res => {
        this.nslist = res.data
      })
      // 获取secret对象
      getSecret(this.selectns).then(res => {
        this.secretlist = res.data
      })
      // 初始化websocket
      this.wsclient = NewClient()
      this.wsclient.onmessage= (e)=>{
        if (e.data !== 'ping'){
          const object = JSON.parse(e.data)
          if (object.type === 'secret' && object.ns=== this.selectns){
            this.secretlist = object.data
            this.$forceUpdate()
          }
        }
      }
    },
    deleteSecret(ns,name){
      this.$confirm('此操作将永久删除该Secret, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        DeleteSercet(ns,name).then(rep=>{
          if (rep.data === "ok"){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
