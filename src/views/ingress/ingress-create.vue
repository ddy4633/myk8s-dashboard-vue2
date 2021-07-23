<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Ingress基础配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="Ingress名称">
          <el-input v-model="name" placeholder="请输人Ingress名称"></el-input>
        </el-form-item >
        <el-form-item label="选择名称空间">
          <el-select  v-model="selected"  @change="fetchData">
            <el-option
              v-for="option in options"
              v-bind:value="option.Name"
            >
              {{ option.Name }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>特殊配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item >

        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>路由规则配置</span>
      </div>
      <el-form v-model="rules" v-for="(rule,ruleindex) in rules">
        <el-form :inline="true">
          <el-form-item label="匹配的域名">
            <el-input v-model="rule.host" placeholder="例如:996icu.com"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addPathCfg(ruleindex)" >添加域名</el-button>
        </el-form>
        <el-form>
          <template v-for="(pathcfg,pathindex) in rule.paths">
            <el-form :inline="true">
              <el-form-item label="PATH">
                <el-input v-model="pathcfg.path" placeholder="PATH"></el-input>
              </el-form-item>
              <el-form-item label="选择服务名">
                <el-select  v-model="svcselected" >
                  <el-option
                    v-for="option in services"
                    v-bind:value="option.Name"
                  >
                    {{ option.Name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="后端转发到的端口">
                <el-input v-model="pathcfg.port" placeholder="后端pod的端口号"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getnsList } from "@/api/ns";
import { getService } from "@/api/services";

export default {
  data(){
    return{
      selected: "default",
      svcselected: "",
      name: "",
      options: null,
      rules:[
        {host:"",paths:[{path:"",svc_name:"",port:"80"}]}
      ],
      services: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.getns()
      this.getServicelist()
    },
    // 获取ns列表信息
    getns() {
      getnsList().then(res => {
        this.options = res.data
      })
    },
    // 获取对应ns下的service信息
    getServicelist() {
      getService(this.selected).then(rep=>{
        this.services = rep.data
      })
    }

  },
}
</script>

<style scoped>

</style>
