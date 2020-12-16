<template>
  <div id="app">
<!--    绑定数组，给子组件传值-->
    <Header :poiInfo="poiInfo"></Header>
    <Nav :commentNum="commentNum"></Nav>
    <router-view/>
  </div>
</template>

<script>
  import Header from "@/components/header/header";
  import  Nav from '@/components/Nav/nav.vue'
  import axios from 'axios'
export default {
  components: {
    Header,
    Nav
  },

  name: 'App',
  data(){
    return{
      /**
       * 定义一个数组来接收数据
       * */
      poiInfo:{},
      commentNum:0
    }
  },
  /**
   * 组件被创建时执行的函数
   * */
  created() {
    /**
     * 使用axios的插件中的get方法获取数据
     * */
    axios.get('/api/goods').then(res=>{
      //将获取到的数据赋值给定义的数组
      this.poiInfo = res.data.data.poi_info
      // console.log(this.poiInfo)
    }),
      //获取到评价的条数
    axios.get('/api/ratings').then(res=>{
        // console.log(res.data.data.comment_num)
        this.commentNum = res.data.data.comment_num
      })
  }
}
</script>
<!--引入默认的样式-->
<style src="../static/css/reset.css"></style>
<style src="./common/css/font-awesome.css"></style>


