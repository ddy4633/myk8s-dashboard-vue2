<template>
  <div>
    <el-container v-for="ns in nslist" >
      <el-header>
        <span>当前名称空间：{{ ns.Name }} </span>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="getPodsList(ns.Name)"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :row-class-name="gettableRowClassName"
          :summary-method=getPodCount
          show-summary
        >
        <el-table-column label="Pod Name" min-widthd>
          <template slot-scope="scope">
            {{ scope.row.Name }}
          </template>
        </el-table-column>
        <el-table-column label="NameSpace" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.NameSpace }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在节点" min-width="50" align="center">
          <template slot-scope="scope">
            {{ scope.row.NodeName }}
          </template>
        </el-table-column>
        <el-table-column label="当前状态" width="80" align="center">
          <template slot-scope="scope">
            <p v-html="getStatus(scope.row)"></p>
          </template>
        </el-table-column>
        <el-table-column label="当前IP" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.IP[0] }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.CreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="重启" width="50" align="center">
          <template slot-scope="scope">
            {{ scope.row.RestartCount }}
          </template>
        </el-table-column>
          <p>这是一段内容这是一段内容确定删除吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
          </div>
        <el-table-column label="操作" min-widthd align="center">
           <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="primary"
                 :visible.sync="drawer"
                 @click="getpet(scope.row)">详细信息</el-button>
               <el-button
                 size="mini"
                 type="danger"
                 @click="handleLog(scope.row.NameSpace,scope.row.Name)">日志</el-button>
               <el-button
                 size="mini"
                 type="info"
                 @click="handleshell(scope.row.NameSpace,scope.row.Name)">终端</el-button>
             <el-button
               size="mini"
               type="danger"
               @click="rmpod(scope.row.NameSpace,scope.row.Name)">删除</el-button>
           </template>
         </el-table-column>
        </el-table>
        <el-pagination
        background
        layout="prev, pager, next"
        :total="getPodsTot(ns.Name)"
        :page-size="8"
        :current-page.sync="pages[ns.Name]"
        @current-change="(current)=>changePage(ns.Name,current)"
        :hide-on-single-page="true"
        >
        </el-pagination>
      </el-main>
    </el-container>
    <el-drawer
      size="40%"
      direction="rtl"
      title="Pod详细信息"
      :visible.sync="drawer">
      <template>
        <div>
          <ve-line
          :data="puc"
          ></ve-line>
          <el-card class="box-card" >
            <span>容器名称：</span>
            <span class="dig">{{diapodinfo.Name}}</span>
            <el-divider></el-divider>
            <span>名称空间：</span>
            <span class="dig">{{diapodinfo.NameSpace}}</span>
            <el-divider></el-divider>
            <span>镜像名称：</span>
            <span class="dig">{{diapodinfo.Images}}</span>
            <el-divider></el-divider>
            <span>所在节点：</span>
            <span class="dig">{{diapodinfo.NodeName}}</span>
            <span></span>
            <el-divider content-position="left">对象标签：</el-divider>
            <el-row :gutter="20">
        <span v-for="(va,key) in diapodinfo.Labels" >
          <el-tag style="font-size: 15px">{{key}}={{va}}</el-tag><br>
        </span>
            </el-row>
            <el-divider content-position="left">挂载信息</el-divider>
            <el-table
              :data="diapodinfo.Mount"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                width="220">
              </el-table-column>
              <el-table-column
                prop="mountPath"
                label="挂载点"
                width="400">
              </el-table-column>
            </el-table>
            <el-divider content-position="left">pod事件：</el-divider>
            <span class="red">{{diapodinfo.Message}}</span>
            <el-divider content-position="left">容忍度：</el-divider>
            <el-table
              :data="diapodinfo.Tolerations"
              border
              style="width: 100%">
              <el-table-column
                prop="key"
                label="Key"
                width="320">
              </el-table-column>
              <el-table-column
                prop="operator"
                label="Opeator"
                width="100">
              </el-table-column>
              <el-table-column
                prop="effect"
                label="影响">
              </el-table-column>
              <el-table-column
                prop="tolerationSeconds"
                label="持续时间">
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </template>
    </el-drawer>
    <div >
      <el-button type="text" @click="dialogVisible = true">点击打开 蔡徐坤</el-button>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :append-to-body="true"
        :before-close="handleClose"
        :close-on-click-modal="false">
        <span>删除是危险操作确定执行吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPodList,deletePod } from '@/api/pods'
import { getnsList } from "@/api/ns";
import { NewClient } from "@/utils/ws";

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
      nslist: null,
      podslist: {},
      pages: {}, // 存储当前NS的页码
      diapodinfo: {},
      drawer: false,
      visible: false,
      dialogVisible:false,
      // 图测试参数
      puc: {
        columns: ['日期','cpu'],
        rows: [
          {
            '日期': '1月1日',
            'cpu': '123',
          },
          {
            '日期': '1月2日',
            'cpu': '23',
          },
          {
            '日期': '1月3日',
            'cpu': '52435',
          },
          {
            '日期': '1月4日',
            'cpu': '1234',
          },
          {
            '日期': '1月5日',
            'cpu': '12',
          },
        ]
    }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // 返回namespace列表
      getnsList().then(response => {
        this.nslist = response.data
        this.nslist.forEach(ns =>{
          // 设置初始化页码
          this.pages[ns.Name] = 1
          // 加载带分页的
          this.loadPods(ns.Name,1)
        })
      })
      // 简历websocket连接
      this.createWebSockt()
      this.listLoading = false
    },
    createWebSockt(){
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping' && JSON.parse(e.data).type==='pod'){
          const ob = JSON.parse(e.data)
          //console.log(ob.data.Ext)
          // 设置页码
          this.pages[ob.ns]=1
          this.podslist[ob.ns]=ob.data
          this.$forceUpdate()
        }
      }
    },
    gettableRowClassName(row,index){
      if (!row.row.IsRead){
        return 'warning-row';
      }
      return 'success-row'
    },
    getStatus(row){
      if (!row.IsRead){
        return "<p class='red'>warning</p>"
      }
      return  "<p>Running</p>"
    },
    getMessage(row){
      if (!row.IsRead){
        return row.Message
      }
      return ''
    },
    getPodCount(param){
      const { data } = param
      let podAllNum = 0
      const sum = []
      sum[0] = 'Pod总数'
      sum[2] = '就绪的Pod'
      if (data !== null && data.length > 0){
        const ns=data[0].NameSpace
        if (typeof (this.podslist[ns]) === 'undefined' || this.podslist == null){
          sum[1] = 0
        }else {
          sum[1]=this.podslist[ns].Total
          sum[3]=this.podslist[ns].Ext.ReadyNum
        }
      }else {
        sum[1]=0
      }
      return sum
    },
    // 加载分页的代码
    loadPods(ns,current){
      getPodList(ns,current).then(rsp=>{
        this.podslist[ns] = rsp.data
        this.$forceUpdate()
      })
    },
    changePage(ns,current){
      this.loadPods(ns,current)
    },
    // 打开抽屉
    getpet(row){
      this.drawer=true
      this.diapodinfo = row
      console.log("触发详细",this.diapodinfo)
    },
    // 获取labels对象
    getLabels(xx) {
      if (typeof(xx) === 'undefined'||typeof(xx) ==='null' ){
        return '<p></p>'
      }
       console.log(xx)
      xx.forEach(function(key){
        console.log(key,obj[key]);
        return "<p class='red'>warning</p>"
      })
      // return "<p class='red'>warning</p>"
    },
    handleLog(ns,pod){
        this.$router.push({name:'Podlogs',params:{ns:ns,pod:pod}})
    },
    handleshell(ns,pod) {
      this.$router.push({name:'podshell',params:{ns:ns,pod:pod}})
    },
    handledelete(ns,pod) {
      deletePod(ns.pod)
    },
    closeShadow(){
      this.dialogVisible=false;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    rmpod (ns,name) {
      this.$confirm('此操作将永久删除'+name+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deletePod(ns,name).then(rep=>{
          if (rep.data === null){
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
  },
  computed: {
    // 获取pod信息
    getPodsList(ns) {
      return (ns) => {
        //console.log(ns,"分页获取",this.podslist[ns],typeof (this.podslist[ns]) === "undefined" )
        if (typeof(this.podslist[ns]) === 'undefined' || this.podslist[ns].Data.length <=0 ){
            return null
        }else {
          return this.podslist[ns].Data
        }
      }
    },
    // 获取后端返回的页码
    getPodsTot(ns){
      return (ns)=>{
        if(typeof(this.podslist[ns]) === 'undefined' || this.podslist[ns] == null){
          return 0
        }else {
          return this.podslist[ns].Total
        }

      }
    },
  }
}
</script>
<style>
.el-drawer__body {
  overflow: auto;
}
.el-header, .el-footer {
  font-weight: bolder;
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;

}
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
.dig {
  margin-left:100px;
  color: #1482f0;
  font-weight:bold;
}
.top {
  text-align:left
}
</style>
