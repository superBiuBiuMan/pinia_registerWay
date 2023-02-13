import { createApp } from 'vue'
import App from './App.vue'
import Pinia from "./store"
const app = createApp(App);
const bootstrap = () => {
    app.mount('#app')
    // 加载pinia(可选)
    app.use(Pinia);
}
bootstrap();


