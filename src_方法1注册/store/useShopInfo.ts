import {defineStore} from "pinia";

export interface Item {
  name:string,//商品名称
  price:number,//商品价格
  amount:number,//商品数量
}
export interface State {
  item:Item[],//商品列表
}

export default defineStore('shopInfo',{
  state: ():State => ({
    item:[],
  }),
  getters:{
    /*总金额*/
    totalMoney: (state:State) => {
      return state.item?.reduce((prev, item) => {
        const a = prev + item?.amount ? item?.amount * item.price : prev;
        //console.log(a)
        return a;
      },0)
    },
  },
  actions: {
    // 这种写法不建议写成箭头函数，写成箭头函数访问不到state中的状态
    // actions中的代码可以是同步也可以是异步
    addCar(item:Omit<Item,'amount'>){
      ///*查找是否有*/
      const itemInfo = this.item?.find(ele => ele.name === item.name);
      if(itemInfo){
        itemInfo.amount = itemInfo.amount ? itemInfo.amount + 1  : 1;
      }else{
        this.item.push({...item,amount:1});
      }
    }
  }
})
