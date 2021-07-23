<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自定义类型</span>
      </div>
      <el-form  :inline="true" label-width="80px" v-for="(item,index) in kvs">
        <el-form-item label="Key">
          <el-input v-model="item.key"></el-input>
        </el-form-item>
        <el-form-item label="Value">
          <el-input v-model="item.value"></el-input>
        </el-form-item>
        <el-button v-show="index>0" @click="rmKVS(index)" type="promary" icon="el-icon-minus" circle></el-button>
      </el-form>
      <div >
        <el-button type="primary" @click="addKVS" icon="el-icon-plus">添加密文</el-button>
        <el-button type="info" @click="Save" icon="el-icon-success">保存配置</el-button>
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
import {CreateSecret} from "@/api/secrets";
export default {
  props: ["Name","NameSpace"],
  data(){
    return{
      kvs: [
        {key:"",value:""}
      ],
      dialogVisible: false,
      message: '',
    }
  },
  methods: {
    rmKVS(index) {
      this.kvs.splice(index,1)
    },
    addKVS() {
      this.kvs.push({key:"",value: ""})
    },
    Save() {
      // 把前端填写的kv聚合成为一个大的对象
      let data = {}
      this.kvs.forEach((item)=>{
        data[item.key]=item.value
      })
      // 组装模型方便后端直接使用
      const dataModel={
       Name: this.$props.Name,
       NameSpace: this.$props.NameSpace,
       Type: "Opaque",
       Data: data,
      }
      console.log(dataModel)
      // 提交secret对象
      CreateSecret(dataModel).then(rep=>{
        if (rep.data === null ) {
          this.$message({
            type: 'success',
            message: dataModel.NameSpace+"/"+dataModel.Name+"创建成功！"
          })
          setTimeout(()=>{ this.$router.push({name:'Secretscreate'}) }, 2000);
        }else {
          this.dialogVisible = true
          this.message = rep.data
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
