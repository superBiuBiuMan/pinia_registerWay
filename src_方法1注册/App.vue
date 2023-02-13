
<template>
  <div>
    {{appStore.shopInfo.item}}
    <div>
      货物名称<input v-model="name"/>
    </div>
    <div>
      价格<input v-model="price"/>
    </div>
    <div>
      <button @click="handleAdd">添加进购物车</button>
    </div>
    <div>
      总金额{{appStore.shopInfo?.totalMoney}}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const name = ref('超人');//货物名称
const price = ref(12);//货物名称
import appStore from "./store/index";

/*添加进购物车回调*/
const handleAdd = () => {
  appStore.shopInfo.money = 1000
  appStore.shopInfo.addCar({
    name:name.value,
    price:price.value
  })
}
</script>

<style scoped>
</style>
