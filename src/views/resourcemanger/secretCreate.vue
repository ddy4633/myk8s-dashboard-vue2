<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基础配置</span>
          <el-form :inline="true">
            <el-form-item label="Secret名称">
              <el-input v-model="secretName"></el-input>
            </el-form-item>
            <el-form-item label="选择名称空间">
              <el-select  v-model="selectns" @change="fetchData">
                <el-option
                  v-for="option in ns"
                  v-bind:value="option.Name"
                >
                  {{ option.Name }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择Secret类型">

            </el-form-item>
          </el-form>
      </div>
    </el-card>
    <Opaque v-bind:Name="secretName" v-bind:NameSpace="selectns"></Opaque>
  </div>
</template>

<script>
import { getnsList } from "@/api/ns";

export default {
  data(){
    return{
      secretName: '',
      ns: null,
      selectns: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取ns列表信息
      getnsList().then(res => {
        this.ns = res.data
      })
    }
  },
  components: {
    Opaque: () => import('./secret-opaque')
  }
}
</script>

<style scoped>

</style>
