<template>
  <div class="shopcart">
    <div class="shopcart-wrapper">
      <!--    左边的部分-->
      <div class="content-left">
        <!--      logo部分-->
        <div class="logo-wrapper"
             :class="{'highligh':totalCount>0}"
        >
        <span class="fa fa-shopping-cart logo"
              :class="{'highligh':totalCount>0}"
              @click="toggleList"></span>
          <i class="num" v-if="totalCount">{{totalCount}}</i>
        </div>
        <div class="desc-wrapper">
          <p class="tip">
            <span class="total-price"  v-if="totalPrice">￥{{totalPrice}}</span>
            <br>
            另需{{poiInfo.shipping_fee_tip}}
          </p>
        </div>
      </div>
      <!--    右边的部分-->
      <div  class="content-right"
            :class="{'highligh':totalCount>0}">
        {{paystr}}

      </div>

      <!--    购物车的列表-->
      <div class="shopcart-list show"
           v-if="listShow"
           :class="{'show':listShow}">
        <div class="list-top"
             v-if="poiInfo.discounts2">
          {{poiInfo.discounts2[0].info}}
        </div>
        <!--      top部分结束-->
        <div class="list-header">
          <h3 class="title">1号口袋</h3>
          <div class="empty" @click="clearAll">
            <img src="" alt="">
            <span>清空购物车</span>
          </div>
        </div>
        <!--      header结束-->
        <div class="list-content"
             ref="listContent">
          <ul>
            <li class="food-item" v-for="(food, index) in selectFoods">
              <div class="desc-wrapper">
                <div class="desc-left">
                  <p class="name">{{food.name}}</p>
                  <p class="unit" v-if="!food.description">{{food.unit}}</p>
                  <p class="description" v-if="!food.unit">{{food.description}}</p>
                </div>
                <div class="desc-right">
                  ￥{{food.min_price}}
                </div>
              </div>
              <div class="cartcontrol-wrapper">
                <Cartcontrol :food="food"></Cartcontrol>
              </div>
            </li>
          </ul>

        </div>
        <!--      listcontent  结束-->
        <div class="list-bottom"></div>
      </div>

    </div>
    <div class="shopcart-mask" v-show="listShow" @click="hideMask"></div>

  </div>


</template>

<script>
  import Cartcontrol from "../carcontrol/cartcontrol";
  import Bscroll from "better-scroll"
    export default {
      components:{
        //此处使用了es6的数据
        Cartcontrol
      },
      props:{
        poiInfo:{
          type:Object,
          default:{}
        },
        selectFoods:{
          type: Array,
          default(){
            return []
          }
        }
      },
        data(){
          return{
            fold:true
          }
        },
      computed:{
        paystr(){
          if(this.totalCount>0){
            return "去结算"
          }else{
            return  this.poiInfo.min_price_tip
          }
        },
        totalCount(){
          let num = 0;
          this.selectFoods.forEach((food)=>{
            // console.log(food.count)
            num += food.count
          })
          return num;
        },
        totalPrice(){
          let total = 0;
          this.selectFoods.forEach((food)=>{
            total+= food.min_price * food.count
          })
          return total;

        },
        listShow(){
          if(!this.totalCount){
            this.fold = true
            return false;
          }
           //定义一个show来接收fold 的取反的值
           let show = !this.fold;
          if(show){
            this.$nextTick(()=>{
              //判断当总的数量发生变化时，
              if(!this.shopscroll){
                //如果没有shopscroll就会自动的定义一个新的实例
                this.shopscroll = new Bscroll(this.$refs.listContent,{
                  click: true
                })

              }else{
                  //刷新
                  this.shopscroll.refresh()
              }
            })
          }

          return show
        }
      },
      methods:{
        toggleList(){
          if(!this.totalCount){

            return;
          }
          this.fold = !this.fold
        },
        clearAll(){
          this
          .selectFoods.forEach((food)=>{
             food.count = 0
          })
        },
        hideMask(){
          this.fold = true;
        }

      }

    }
</script>

<style scoped>
  @import url("../../common/css/font-awesome.css");

  .shopcart-wrapper{
    width: 100%;
    height: 51px;
    background: #514f4f;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    z-index: 99;
  }

  .shopcart-wrapper .content-left{
    flex: 1;
  }

  .shopcart-wrapper .content-right{
    flex: 0 0 110px;
    font-size: 15px;
    color: #BAB9B9;
    line-height: 51px;
    text-align: center;
    font-weight: bold;
  }

  .shopcart-wrapper .content-left .logo-wrapper{
    width: 50px;
    height: 50px;
    background: #666666;
    border-radius: 50%;
    position: relative;
    top: -14px;
    left: 10px;
    text-align: center;
    float: left;
  }

  .shopcart-wrapper .content-left .logo-wrapper .logo{
    font-size: 28px;
    color: #c4c4c4;
    line-height: 50px;
  }

  .shopcart-wrapper .content-left .desc-wrapper{
    float: left;
    margin-left: 13px;
  }

  .shopcart-wrapper .content-left .desc-wrapper .tip{
    font-size: 12px;
    color: #bab9b9;
    line-height: 15px;

  }
  .shopcart-wrapper .content-left .logo-wrapper.highligh{
    background: #ffd161;
  }
  .shopcart-wrapper .content-left .logo-wrapper .logo.highligh{
    color: #2D2B2A;
  }
  .shopcart-wrapper .content-left .logo-wrapper .num{
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 50%;
    font-size: 9px;
    color: white;
    background: red;
    position: absolute;
    right: 0;
    top: 0;
  }
  .shopcart-wrapper .content-left .desc-wrapper .total-price {
    font-size: 18px;
    line-height: 33px;
    color: white;
  }
  .shopcart-wrapper .content-right.highligh{
    background: #FFD161;
    color: #2D2B2A;
  }

  /*点击购物车展示购物详情的样式*/
  .shopcart-wrapper .shopcart-list{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
  }
  .shopcart-wrapper .shopcart-list.show{
    transform: translateY(-100%);
  }

  .shopcart-wrapper .shopcart-list .list-top{
    height: 30px;
    text-align: center;
    font-size: 11px;
    background: #f3e6c6;
    line-height: 30px;
    color: #646158;
  }


  .shopcart-wrapper .shopcart-list .list-header{
    height: 30px;
    background: #F4F4F4;
  }
  .shopcart-wrapper .shopcart-list .list-header .title{
    float: left;
    border-left: 4px solid #53c123;
    padding-left: 6px;
    line-height: 30px;
    font-size: 12px;
  }
  .shopcart-wrapper .shopcart-list .list-header .empty{
    float: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 0;
  }
  .shopcart-wrapper .shopcart-list .list-header .empty img{
    height: 14px;
    margin-right: 9px;
    vertical-align: middle;
  }
  .shopcart-wrapper .shopcart-list .list-header .empty span{
    font-size: 12px;
    vertical-align: middle;
  }

  .shopcart-wrapper .shopcart-list .list-content{
    max-height: 360px;
    overflow: hidden;
    background: white;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item{
    height: 38px;
    padding: 12px 12px 10px 12px;
    border-bottom: 1px solid #F4F4F4;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper{
    float: left;
    width: 240px;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left{
    float: left;
    width: 170px;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .name{
    font-size: 16px;
    margin-bottom: 8px;

    /* 超出部分隐藏*/
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 16px;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .unit{
    font-size: 12px;
    color: #B4B4B4;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .description{
    font-size: 12px;
    color: #B4B4B4;

    /* 超出部分隐藏*/
    overflow: hidden;
    height: 12px;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right{
    float: right;
    width: 70px;
    text-align: right;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right .price{
    font-size: 12px;
    line-height: 38px;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .cartcontrol-wrapper{
    float: right;
    margin-top: 6px;
  }

  .shopcart .shopcart-mask{
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
    background: rgba(7,17,27,0.6);
  }

</style>
