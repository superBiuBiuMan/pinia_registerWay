import { createApp } from 'vue'
import { createPinia } from "pinia";
import './style.css'
import App from './App.vue'
import {registerStore} from "./store";

const app = createApp(App);
app.use(createPinia())
/* 使用pinia后就可以紧跟着注册了 */
// 注册pinia状态管理库
registerStore();

app.mount('#app')
