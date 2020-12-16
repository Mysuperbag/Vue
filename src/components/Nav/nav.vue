<template>
<div class="nav">
<!--  路由跳转至商品的界面-->
  <router-link class="nav-item" to="/goods">
    商品
    <i class="line"></i>
  </router-link>
<!--  跳转至评价的界面-->
  <router-link class="nav-item" to="/ratings">
    评价({{commentNum}})
    <i class="line"></i>
  </router-link>
<!--  跳转至卖家的详情页面-->
  <router-link class="nav-item" to="/seller">
    卖家
    <i class="line"></i>
  </router-link>
</div>
</template>

<script>

    export default {
      props:{
        commentNum:{
          type:Number,
          default:0
        }
      },

      data(){
          return{

          }
      }
    }
</script>

<style scoped>
  *{
    padding: 0;
    margin:0px;
  }
  .nav{
    width: 100%;
    height: 35px;
    display: flex;
    line-height: 35px;
  }
  .nav-item{
    flex: 1;
    text-align: center;
    color: black;
    text-decoration: none;
    position: relative;
  }
  .nav .active{
    color: #ffbb22;
    /*background: pink;*/
  }
  .nav .active .line{
    width: 30px;
    height: 2px;
    display: inline-block;
    background: #ffbb22;
    position: absolute;
    left: 46%;
    bottom: 0;
    margin-left: -10px;
  }


</style>
