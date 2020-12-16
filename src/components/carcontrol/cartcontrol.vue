<template>
    <div class="cartcontrol">
      <span class="fa fa-minus-circle" style="color: #b4b4b4"
      v-if="food.count"
      @click.stop="decreaseCart"></span>
      <span class="cart-count" style="font-size: 12px"
      v-if="food.count">{{food.count}}</span>
      <span class="fa fa-plus-circle" style="color: #ffd161"
      @click.stop="increaseCart"></span>
    </div>
</template>

<script>
    export default {
        name: "cartcontrol",
      props:{
          food:{
            type:Object
          },
        selectFoods: {
          type: Array,
          default(){

          }

        }
      },

      methods:{
        decreaseCart(){
          // this.food.count--;
          this.$emit('decrementFoodCount')
        },
        increaseCart(){
          // if(!this.food.count){
          //  this.$set(this.food,"count", 1)
          // }else{
          //   this.food.count++;
          // }
          this.$emit('incrementFoodCount')
        }
      },

    }
</script>

<style scoped>

</style>
