<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Ingress基础配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="Ingress名称">
          <el-input v-model="name" placeholder="请输人Ingress名称" style="width:250px"></el-input>
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

      <el-form v-for="(annotat,annotationindex) in annotationsdata">
        <div style="text-align: right">
        </div>
        <template v-for="(obj,objindex) in annotat.rules">
          <el-form :inline="true">
            <el-form-item label="Ingress自定义参数">
              <el-select v-model="obj.key" placeholder="请选择或者搜索" filterable style="width:400px">
                <el-option
                  v-for="item in annotations"
                  :key="item.remarks"
                  :label="item.name"
                  :value="'nginx.ingress.kubernetes.io/'+item.name">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 10px">{{ item.remarks }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数的值">
              <template>
                <el-tooltip placement="top">
                  <template #content>
                    <span v-for="item in annotations">
                    <span v-if="item.name === obj.key.substring(28,100)">说明：{{ item.description }}</span>
                  </span>
                  </template>
                  <el-input v-model="obj.value" placeholder="参数的值" style="width: 300px"></el-input>
                </el-tooltip>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button v-show="objindex>0" type="danger" @click="rmAnnotationCfg(annotationindex,objindex)" >删除配置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <div style="text-align: center" >
          <el-button type="success" @click="addAnnotationCfg(annotationindex)">新增规则</el-button>
          <el-button type="info">
            <el-link href="https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/" style="color: white">文档帮助</el-link>
          </el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>路由规则配置</span>
      </div>
      <el-form label-width="120px" v-model="rules" v-for="(rule,ruleindex) in rules">
        <el-form :inline="true">
          <el-form-item label="匹配的域名">
            <el-input v-model="rule.host" placeholder="例如:996icu.com"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="success" @click="addPathCfg(ruleindex)" >新增规则</el-button>
          </el-form-item>
        </el-form>
        <el-form>
          <template v-for="(pathcfg,pathindex) in rule.paths">
            <el-form :inline="true">
              <el-form-item label="PATH">
                <el-input v-model="pathcfg.path" placeholder="PATH"></el-input>
              </el-form-item>
              <el-form-item label="选择服务名">
                <el-select  v-model="pathcfg.svc_name" >
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
              <el-form-item>
                <el-button v-show="pathindex>0" type="danger" @click="rmPathCfg(ruleindex,pathindex)" >删除配置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-form>
      </el-form>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" @click="createIngress()">保存</el-button>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :append-to-body="true"
          :close-on-click-modal="false">
          <span>{{message}}</span>
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
        </el-dialog>
      </div>
      </el-card>
  </div>

</template>

<script>
import { getnsList } from "@/api/ns";
import { getService } from "@/api/services";
import {GetAnnotations, CreateIngress, DeleteIngress} from "@/api/ingress";


export default {
  data(){
    return{
      selected: "default",
      svcselected: "",
      name: "",
      annotationvalue: null,
      options: null,
      annotationsdata: [
        {rules:[{key:'',value:''}]}
      ],
      rules:[
        {host:"",paths:[{path:"",svc_name:'',port:"80"}]}
      ],
      services: [],
      annotations: null,
      dialogVisible: false, //dig开关
      message: "" //错误信息
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.clearSelectSVC()
      this.getns()
      this.getServicelist()
      this.getingressannotations()
    },
    // 获取ns列表信息
    getns() {
      getnsList().then(res => {
        this.options = res.data
      })
    },
    // 切换NS后把svc字段清空
    clearSelectSVC() {
      this.rules.forEach(rule=>{
        rule.paths.forEach(cfg=>{
          cfg.svc_name = ''
        })
      })
    },
    // 获取对应ns下的service信息
    getServicelist() {
      getService(this.selected).then(rep=>{
        this.services = rep.data
      })
    },
    // 获取所有的annotations
    getingressannotations() {
      GetAnnotations().then(res => {
        this.annotations = res.data
      })
    },
    // 新增path的配置
    addPathCfg(index) {
      this.rules.forEach((rule,ruleindex)=>{
        if (ruleindex === index){
          rule.paths.push({path: "",svc_name: "",port: "80"})
        }
      })
    },
    // 删除Path配置
    rmPathCfg(ruleindex,pathIndex) {
      this.rules.forEach((rule,ruleindexs)=>{
        if (ruleindexs === ruleindex) {
          rule.paths.forEach((path,pathindexs)=>{
            if (pathindexs === pathIndex){
              rule.paths.splice(pathindexs,1)
            }
          })
        }
      })
    },
    // 新增annotation的配置
    addAnnotationCfg(index) {
      this.annotationsdata.forEach((annotation,annotationindex)=>{
        if(index === annotationindex){
          annotation.rules.push({key:'',value:''})
          console.log(index,annotationindex,this.annotationsdata)
        }
      })
    },
    // 删除annotation的配置
    rmAnnotationCfg(annotationindex,objindex) {
      this.annotationsdata.forEach((annotation,annotatindex)=>{
        if (annotationindex === annotatindex) {
          annotation.rules.forEach((rule,ruleindex)=>{
            if (ruleindex===objindex){
              annotation.rules.splice(ruleindex,1)
            }
          })
        }
      })
    },
    pushtolist(){
      this.$router.push({name:'Ingresslist'})
    },
    // 提交ingress-create请求
    createIngress() {
      let data = {Name: this.name, NameSpace: this.selected, Rules: this.rules, annotationsdata: this.annotationsdata}
      this.dialogVisible = true
      CreateIngress(data).then((rep) => {
        console.log(rep)
        if (rep.code === 20000 && rep.data === null) {
          this.message = '创建成功!3秒后自动跳转请等待...'
          setTimeout(()=>{ this.pushtolist(); }, 2000);
        }else{
          this.message = rep.data.ErrStatus.message
        }
      }).catch((error) => {
        if (error.response) {
          this.message = JSON.stringify(error.response.data)
        } else {
          this.message = JSON.stringify(error.message)
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
