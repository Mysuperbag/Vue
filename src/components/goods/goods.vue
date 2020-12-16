<template>
  <div class="goods">
    <!--分类列表-->
    <div class="menu-wrapper" ref="menuscroll">
      <ul>
        <li class="menu-item"
            :class="{'current': currentIndex === 0}"
            @click="selectMenu(0)"
        >
          <p class="text">
            <img class="icon" :src="container.tag_icon" alt="">
            {{container.tag_name}}
          </p>
        </li>
        <li class="menu-item"
            :class="{'current': currentIndex === index+1}"
            v-for="(item, index) in goods"
            @click="selectMenu(index+1)">
          <p class="text">
<!--             v-if="item.icon"判断如果数据中有图片的时候就会将图片显示在相应的位置，如果没有图片则不会显示-->
<!--            图片需要绑定-->
            <img class="icon" :src="item.icon" v-if="item.icon" alt="">
            {{item.name}}
          </p>
<!--         v-if在这里判断了calculateCount（）函数返回的count是否为空。如果为空的话，则
              i标签是不会显示的，只有当count的数值发生变化是才会显示，
              此处的循环是一个二级训话所以我们只能使用item来循环数据
-->
          <i class="num" v-if="calculateCount(item.spus)">
<!--
            {{calculateCount(item.spus)}}表示calculateCount()函数返回的数值
-->
            {{calculateCount(item.spus)}}
          </i>
        </li>
      </ul>

    </div>

    <!--商品列表-->
    <div class="foods-wrapper" ref="foodscroll">



<!--   开始   -->
      <ul>
        <!--专场菜单,对应的只有两张图片-->
        <li class="container-list food-list-hook">
          <div v-for="(item,index) in container.operation_source_list" :key="index">
            <img :src="item.pic_url"/>
          </div>
        </li>
        <!--具体分类-->
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <!--具体商品列表-->
          <ul>
<!--            此处是一个二级的循环，因此我们不能在使用item，-->
            <li v-for="(food,indey) in item.spus" :key="indey"
                @click="showDetail(food)"
                class="food-item">
<!--              定义一个head_bg函数（需要定义在methods中，返回一个图片的地址 ，因为计算属性不能传参，）-->
              <div class="icon" :style="head_bg(food.picture)"></div>
              <div class="content">

                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="saled">{{food.praise_content}}</span>
                </div>
                <img class="product" :src="food.product_label_picture" v-if="food.product_label_picture"/>
                <p class="price">
                  <span class="text">￥{{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>
              <cartcontrol :food="food" @decrementFoodCount='decrementFoodCount(index,indey)' @incrementFoodCount='incrementFoodCount(index,indey)'></cartcontrol>
            </li>
          </ul>
        </li>
      </ul>

<!--  结束    -->

    </div>
    <shopcart :poiInfo="poiInfo" :selectFoods="selectFoods"></shopcart>
    <product-detail :food="selectFood" ref="foodView"></product-detail>
  </div>

</template>

<script>

  /**
   * 引用axios 的插件
   * */
    import axios from "axios";
    import BScroll from "better-scroll"
    import shopcart from "../shopcart/shopcart";
    import cartcontrol from "../carcontrol/cartcontrol";
    import productDetail from "../productDetail/productDetail";

    export default {
      /**
       * 组件的注册方法
       * */
      components:{
        //此处使用了es6的数据
        shopcart,
        cartcontrol,
        productDetail
      },

      data(){
          return{
            container :{},
            goods:[],
            poiInfo:{},
            listHeight:[],
            menuscroll:{},
            foodscroll:{},
            scrollY:0,
            selectFood:{},

          }
      },
      /**
       *在插件呗创建后执行
       * */
      created() {
          /**
           * 使用axios的插件来请求数据-
           * */
          axios.get('/api/goods').then(res=>{
             console.log(res)
            /**
             * 将获取到的数据赋值给vue 中的数组
             * */
            this.container = res.data.data.container_operation_source
            this.goods = res.data.data.food_spu_tags
            this.poiInfo = res.data.data.poi_info
            // console.log(this.poiInfo)

            this.$nextTick(()=>{
              this.instscroll()
              this.calculateHeight()
            })

          })
      },



      methods:{
        /**
         * 定义一个函数将图片的地址返回出去
         * */
        decrementFoodCount(index,indey) {
          let count = this.goods[index].spus[indey].count - 1;
          this.$set(this.goods[index].spus[indey],'count',count)

        },
        incrementFoodCount(index,indey) {
            // console.log(index,indey);
            if(!this.goods[index].spus[indey].count){
              // console.log(1);
              this.$set(this.goods[index].spus[indey],'count',1)
            }else{
              // console.log(this.goods[index].spus[indey].count++);
              let count = this.goods[index].spus[indey].count + 1;
              this.$set(this.goods[index].spus[indey],'count',count)

            }
            
            // console.log(this.goods[index].spus[indey]);
        },
    head_bg(imgName){
      return "background-image: url(" + imgName + ");"
    },
    instscroll(){
      this.$nextTick(()=>{
        /**此处使用了better-scroll*/
        this.menuscroll = new BScroll(this.$refs.menuscroll,{
          click:true,
        })


      }),
      this.$nextTick(()=>{

        this.foodscroll = new BScroll(this.$refs.foodscroll,{
            /**
             * probeType:值为0时不会发生滚动
             * 值为1时，会发生非实时的滚动（屏幕滑动完后才会发生滚动）
             * 值为2时，会在屏幕滑动一段后才会发生滚动
             * 值为3时，会发生实时滚动就是当屏幕滑动时就会立即发生滚动
             * */
            click:true,
            probeType:3
        }),
          /**
           * on 监听事件，用来监听商品列表的滚动事件
           * */
          this.foodscroll.on('scroll',(pos)=>{
            //Math.abs()表示获取绝对值
            //Math.round()表示取整
            
            this.scrollY = Math.abs(Math.round(pos.y))
            // console.log(this.scrollY)
          })

      })


    },

        calculateHeight(){
          /**
           * foodlist表示获取到的li（v-for循环的li 的数量） 的数量，
           * */
          let foodlist = this.$refs.foodscroll.getElementsByClassName("food-list-hook");
          // console.log(foodlist)
          let height=0;
          this.listHeight.push(height);
          /**
           * 使用for循环来我们将foodlist中的数据进行遍历添加至数组中
           * */
          for (let i=0;i<foodlist.length;i++){
            let item = foodlist[i]
            //累加数据将其添加至数组中
            height+= item.clientHeight;
            // console.log(item.clientHeight)
            this.listHeight.push(height);
          }

        },

        selectMenu(index){
          // console.log(index);
          /**
           * 定义一个变量接收获取到v-for的li的数量
           * */
          let  foodlist = this.$refs.foodscroll.getElementsByClassName('food-list-hook');
          //定义一个变量来接收foodlist中的数据
          let element1 = foodlist[index];
          // console.log(foodlist[index])
          //scrollToElement是better-scroll中的一个方法，
          /**
           * 第一个参数为要滚动的对象
           * 第二个参数为滚动所需要的时间
           * */
          this.foodscroll.scrollToElement(element1,250)


        },
        /**
         * 此处计算的是单个食品选择数量的计算，
         * 此处传参，所以我们需要将函数放在methods的方法中，不能鞋子啊comuted计算属性中
         * */
        calculateCount(spus){
          let count = 0;
          //遍历data数据spus的数据，
          spus.forEach((food)=>{
            //判断当count的数值大于0时，就会将所有的count的数值累加在一起
            if(food.count>0){
              count += food.count
            }

          })
          //将count返回出去
          return count
        },
        showDetail(food){
          this.selectFood = food
          this.$refs.foodView.showView();
          // console.log(this.selectFood)
        }


      },
      computed:{

        currentIndex(){
          for (let i=0; i<this.listHeight.length;i++){
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i+1]
            //判断当大于height2则表示没有这个数据，就会显示最前面的第一条数据
            if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
              return i;
            }
          }
          return 0
        },

        selectFoods(){
          let foods=[];
          this.goods.forEach((myfoods)=>{
            myfoods.spus.forEach((food)=>{
              if(food.count>0){
               foods.push(food)
              }
            })
          })
          return foods
        }


      }

    }
</script>

<style scoped>
  .goods{
    display: flex;
    position: absolute;
    top: 200px;
    bottom: 51px;
    overflow: hidden;
    width: 100%;
  }

  .goods .menu-wrapper{
    flex:0 0 85px;
    background: #f4f4f4;
  }

  .goods .foods-wrapper{
    flex:1;
    /* background: blue; */
  }

  /* Menu item */
  .goods .menu-wrapper .menu-item{
    padding: 16px 23px 15px 10px;
    border-bottom: 1px solid #E4E4E4;
    position: relative;
  }

  .goods .menu-wrapper .menu-item .text{
    font-size: 13px;
    color: #333333;
    line-height: 17px;
    vertical-align: middle;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .goods .menu-wrapper .menu-item .text .icon{
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }

  /* 专场样式 */
  .goods .foods-wrapper .container-list{
    padding: 11px 11px 0 11px;
    border-bottom: 1px solid #E4E4E4;
  }

  .goods .foods-wrapper .container-list img{
    width: 100%;
    margin-bottom: 11px;
    border-radius: 5px;
  }

  /* 具体分类商品布局 */
  .goods .foods-wrapper .food-list{
    padding: 11px;
  }
  .goods .foods-wrapper .food-list .title{
    height: 13px;
    font-size: 13px;
    background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
    background-size: 2px 10px;
    padding-left: 7px;
    margin-bottom: 12px;
  }
  .goods .foods-wrapper .food-list .food-item{
    display: flex;
    margin-bottom: 25px;
    position: relative;
  }

  .goods .foods-wrapper .food-list .food-item  .icon{
    flex: 0 0 63px;
    background-position: center;
    background-size: 120% 100%;background-repeat: no-repeat;
    margin-right: 11px;
    height: 75px;
  }
  .goods .foods-wrapper .food-list .food-item .content{
    flex: 1;
  }

  /* 具体内容样式 */
  .goods .foods-wrapper .food-list .food-item .content .name{
    font-size: 16px;
    line-height: 21px;
    color: #333333;
    margin-bottom: 10px;
    padding-right: 27px;
  }

  .goods .foods-wrapper .food-list .food-item .content .desc{
    font-size: 10px;
    line-height: 19px;
    color: #bfbfbf;
    margin-bottom: 8px;

    /* 超出部分显示省略号*/
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .goods .foods-wrapper .food-list .food-item .content .extra{
    font-size: 10px;
    color: #BFBFBF;
    margin-bottom: 7px;
  }
  .goods .foods-wrapper .food-list .food-item .content .extra .saled{
    margin-right: 14px;
  }
  .goods .foods-wrapper .food-list .food-item .content .product{
    height: 15px;
    margin-bottom: 6px;
  }
  .goods .foods-wrapper .food-list .food-item .content .price{
    font-size: 0;
  }
  .goods .foods-wrapper .food-list .food-item .content .price .text{
    font-size: 14px;
    color: #fb4e44;
  }
  .goods .foods-wrapper .food-list .food-item .content .price .unit{
    font-size: 12px;
    color: #BFBFBF;
  }

  /* 当前选中 */
  .goods .menu-wrapper .menu-item.current{
    background: white;
    font-weight: bold;
    margin-top: -1px;
  }
  .goods .menu-wrapper .menu-item:first-child.current{
    margin-top: 1px;
  }

  .goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper{
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .goods .menu-wrapper .menu-item .num{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    color: white;
    background: red;
    text-align: center;
    font-size: 7px;
    line-height: 13px;
  }
</style>
