import ShopInfo from "./useShopInfo"
import {createPinia} from "pinia";
import type {App} from "vue";//或者import {App} from "vue"
const store = createPinia();

//如果需要美观下,想要在main.js全局注册,可以添加下面方法
export default (app:App) => {
  app.use(store);
}

export const shopInfo = ShopInfo(store);
