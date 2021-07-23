<template>
  <div
    style="min-height: 500px;
    padding: 10px"
  >
    <div style="padding-left: 20px;padding-top:30px">
      容器: <el-select placeholder="选择容器"
                      v-model="selectedContainer">
      <el-option v-for="c in containers "
                 :label="c.Name"
                 :value="c.Name"/>
    </el-select>
      <span >
              <el-button   size="mini" type="primary" @click="bashclick" v-model="terms">BASH</el-button>
      </span>
      <span style="display: inline-block; width: 60px;text-align: center;">
              <el-button   size="mini" type="success" @click="shclick" v-model="terms">SH</el-button>
      </span>
    </div>
      <div id="terminal" ref="terminal" ></div>
  </div>
</template>
<script>
import { Terminal } from "xterm";
import { getPodContainersName} from "@/api/pods";
import "xterm/css/xterm.css";

export default {
  data(){
    return {
      rows: 40,
      cols: 100,
      term:null,//终端对象
      ws:null, //ws 客户端
      wsInited:false , //是否初始化完毕
      containers:[],
      ns: "",
      pod:"",
      selectedContainer:"",
      terms: "",
      update: false,
    }
  },
  created() {
    const ns=this.$route.params.ns
    const pod=this.$route.params.pod
    if(ns===undefined || pod===undefined){
      alert("错误的参数")
    }else{
      this.ns=ns
      this.pod=pod
      getPodContainersName(ns,pod).then(rsp=>{
        this.containers=rsp.data
      })
    }

  },

  methods:{
    bashclick() {
      this.terms="bash"
      this.update=true
      console.log(this.terms)
      this.containerChange()
    },
    shclick() {
      this.terms="sh"
      this.update=true
      console.log(this.terms)
      this.containerChange()
    },
    containerChange() {
      this.initWS()// 初始化 websocket
      this.initTerm() //初始化term
    },
    //初始化 websocket 客户端
    initWS(){
      var ws = new WebSocket("ws://192.168.88.129:8080/v1/execws?ns="
        +this.ns+"&pod="+this.pod+"&cname="+this.selectedContainer+"&terms="+this.terms);
      ws.onopen = function(){
        console.log("open");
      }
      ws.onmessage = (e)=>{
        this.wsInited=true //初始化完毕了
        this.term.write(e.data)
      }
      ws.onclose = function(e){
        console.log("close");
        this.update=false
      }
      ws.onerror = function(e){
        console.log(e);
      }
      this.ws=ws
    },
    //初始化shell组件
    initTerm(){
      let term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: parseInt(this.rows), //行数
        cols: parseInt(this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        mode: "groovy",       // 设置高亮类型
        theme: {
          //foreground: "#7e9192", //字体
          background: "#000000", //背景色
          cursor: "help", //设置光标
          lineHeight: 18,
          foreground: 'yellow',
        }
      });
      // 创建terminal实例
      term.open(this.$refs["terminal"]);
      term.prompt = () => {
        term.writeln("\n\n 欢迎使用RF PodShell . ");
        term.writeln("\n 正在初始化终端 .....");
      };
      term.prompt();

      term.onData((key)=> {
        if(this.wsInited){
          this.ws.send(key)
        }
      });
      this.term=term
    }
  }

}

</script>
