<template>
<div class="aap-containers">
  <div >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>参数选项</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="选择名称空间">
          <el-select  v-model="selected" @change="fetchData">
            <el-option
              v-for="option in options"
              v-bind:value="option.Name"
            >
              {{ option.Name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="      ">
          <el-button  type="success" round @click="pushcreateingress">
            新建Ingress
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 80%">
      >
        <el-table-column label="名称" width="250">
          <template slot-scope="scope">
            <p>{{ scope.row.Name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="命名空间" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.NameSpace }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路由规则" width="170" align="center">
          <template slot-scope="scope">
            <span v-for="rule in scope.row.Rules" v-bind:value="rule.host">{{ rule.host }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Annoatations"  align="center">
          <template slot-scope="scope">
            <span v-for="(value,key) in scope.row.Annotations">
              <span>
                <el-tag
                  :key="value+key"
                  style="font-size: 16px;"
                >
              {{ key }}={{value}}
            </el-tag><br>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="基础操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="()=>rmIngress(scope.row.NameSpace,scope.row.Name)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <template>
  </template>
</div>
</template>

<script>
import { getIngressList,DeleteIngress } from "@/api/ingress";
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
      this.listLoading = false
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
          if (object.type === "ingress" && object.ns === this.selected){
            this.list = object.data
            this.$forceUpdate()
          }
        }
      }
    },
    pushcreateingress(){
      this.$router.push({name:"Ingresscreate"})
    },
    // 删除ingress
    rmIngress(ns,name) {
      this.$confirm('此操作将永久删除该Ingress, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        DeleteIngress(ns,name).then(rep=>{
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
    },
  }
}
</script>

<style scoped>
.red{color: #d20000
}
.green{color:green}
</style>
