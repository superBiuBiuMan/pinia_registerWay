## 在线代码演示

* https://stackblitz.com/github/superBiuBiuMan/pinia_registerWay

## 使用注意点

### 不能直接结构赋值

* 如果直接结构赋值,就像下面一样,就会失去响应式效果(数据变了,视图依旧不会更新)

```js
<template>
	{{ name }}
</template>

const { name } = useCounterStore();
```

* 如果确实需要解构赋值,可以使用`storeToRefs`
    * https://pinia.vuejs.org/zh/core-concepts/index.html#using-the-store

```js
// 官网示例代码
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useCounterStore()
    // `name` and `doubleCount` 都是响应式 refs
    // 这也将为由插件添加的属性创建 refs
    // 同时会跳过任何 action 或非响应式(非 ref/响应式)属性
    const { name, doubleCount } = storeToRefs(store)
    // 名为 increment 的 action 可以直接提取
    const { increment } = store

    return {
      name,
      doubleCount,
      increment,
    }
  },
})
```

### 多次使用依旧是相同的对象

```js
const store2 = useShopInfo();
const store3 = useShopInfo();
console.log(store2 === store3)
//输出true
```

## 创建方式(多种)

* 官方示例的会导致重复打包

```
使用store时要先把store的定义import进来，再执行定义函数使得实例化。但是，在项目逐渐庞大起来后，每个组件要使用时候都要实例化吗？在文中开头讲过，pinia的代码分割机制是把引用它的页面合并打包，那像下面的例子就会有问题，user被多个页面引用，最后user store被重复打包。
```

### 方法0:官方示例写法

* src/store/useShopInfo.ts

```js
export default deinfStore('shopInfo',{
    ...
})
```

* main.ts

```js
import { createApp } from 'vue'
import { createPinia } from "pinia";
import './style.css'
import App from './App.vue'
const app = createApp(App);
app.use(createPinia())
app.mount('#app')

```

* 使用

```js
import useShopInfo from "./store/useShopInfo.ts";

const store = useShopInfo();

 store.addCar({
    name:name.value,
    price:price.value
  })
```


### 先简单了解下app.use方法

* 我们先来了解下vue的`app.use`方法,`app.use`用来注册插件,插件可以是一个带 `install()` 方法的对象，亦或直接是一个将被用作 `install()` 方法的函数。插件选项 (`app.use()` 的第二个参数) 将会传递给插件的 `install()` 方法。
    * 若 `app.use()` **对同一个插件多次调用，该插件只会被安装一次**。

```js
import {createApp} from "vue";
const app = createApp();
import 插件带install方法 from "./test"
import 插件不带install方法 from "./test"

app.use(插件带install方法);//会自动调用install方法

//或者手动执行,以一个自定义函数作为install方法
app.use((app, options) => {
    // dosomething
})
```

* 基于`app.use()` **对同一个插件多次调用，该插件只会被安装一次**。我们其实可以看到很多组件库都会叫我们这样使用组件库
    * 以[TDesign](https://tdesign.tencent.com/)为例

```js
import TDesign from 'tdesign-vue-next';
import {createApp} from "vue";
import App from './app.vue';

const app = createApp(App);

//重点
app.use(TDesign);

```

* 我们看看我们引入的`TDesign`是什么

```js
import {App} from 'vue'
import {
    Button,
    Popup,
    Avatar,
    Icon,
    ...
} from 'tdesign-vue-next';
export default (app:App) => {
    app.use(Button)
    app.use(Popup)
    app.use(Avatar)
    app.use(Icon)
    app.use(....)
}
```

* 现在明白了吧,我们引入的`TDesign`就是一个主入口文件,他帮我们一个一个的使用了插件,从而达到了全局引入的效果,当然,你也可以自己去引入,然后按需使用插件

### 方法1:store统一实例化并暴露使用

* 我们可以使用此方法,我们在store文件夹下方的`index.ts`对其他store进行统一实例化然后暴露使用

```js
//未统一实例化
store
	a.ts
	b.ts
	//使用的时候(一般以useXXX命名,当然,也随你命名)
	import useA from "../store/a";
	const infoA = useA();
	console.log(infoA.name);//输出存储的名字信息

//统一实例化并暴露使用
store
	a.ts
	b.ts
	index.ts
	//使用的时候
	import appStore from "./store";
	console.log(appStore.infoA.name);//输出存储的名字信息
```

#### 创建总路口和其他仓库

* store/index.ts

```js
import shopInfo from "./useShopInfo"

export interface AppStore {
  shopInfo:ReturnType<typeof shopInfo>,
}

const appStore = {} as AppStore;

/* 注册store状态库 */
export const registerStore = () => {
  appStore.shopInfo = shopInfo();//由于没有传入pinia对象,会自动去寻找pinia对象
}

export default appStore;

```

* store/user.ts

```js
import {defineStore} from "pinia"
export default defineStore('shopInfo',{
	//...
	state:{
        money:''
    }
	//...
})
```

#### 全局注册

```js
import {createApp} from "vue";
import App from "./App.vue";
import {registerStore} from "./store";

const app = createApp(App);
app.use(createPinia);/* 使用pinia后就可以紧跟着注册了 */
// 注册pinia状态管理库
registerStore();

app.mount('#app')
```

#### 组件使用

* src/pages/A.vue

```js
import appStore from "../store";

<div> {{ appStore.shopInfo.money }} </div>
```

### 方法2:store统一实例化并暴露使用

* 这种方法不需要全局注册pinia,当然,你为了美观也可以全局注册下,但是必须要xxx.todo ##############
* 原理是因为`defineStore`返回值`useStore`函数,这个`useStore`函数第一个参数可以接收一个`pinia`对象,如果有传入则使用传入的`pinia`对象,如果没有传入`pinia`对象,那么会去全局寻找,否则就会报错,报错内容大概如下

```js
`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n` +
`\tconst pinia = createPinia()\n` +
`\tapp.use(pinia)\n` +
`This will fail in production.`
```

#### 创建总路口和其他仓库

* store/index.ts

```js
import {createPinia} from "pinia";
import UseInfo from "./user.ts";//引入其他仓库

import type { App } from 'vue';//或者import {App} from "vue";

//创建唯一的store
const store = createPinia();

//如果需要美观下,想要在main.js全局注册,可以添加下面方法
export default (app:App) => {
    app.use(store);
}


//注意大小写和传参
export const useInfo = UseInfo(store);
//如果有多个也是这样子调用,名字什么的你随意
	//export useList = UseList(store);

```

* store/user.ts

```js
import {defineStore} from "pinia"
export default defineStore('shopInfo',{
	//...
	state:{
        money:''
    }
	//...
})
```

#### 全局注册(方法2可以不全局注册)

* main.js

```js
import {createApp} from "vue";
import App from "./App.vue";
import pinia from "./store"

const bootstrap =  () => {
    const app = createApp(App)
    // ... 
    // 注册TDesignUI()组件库
    app.use(TDesignUI)
    // 加载pinia(可选)
    app.use((app) => {
        app.use(pinia)
    })
    // ...
}

void bootstrap()
```

#### 组件使用

* src/pages/A.vue

```js
import { useInfo } from "../store";

<div> {{ useInfo.money }} </div>
```

## 参考文章

* [Pinia进阶：优雅的setup（函数式）写法+封装到你的企业项目](https://juejin.cn/post/7057439040911441957)
* [pinia源码-defineStore源码解析](https://blog.csdn.net/web220507/article/details/125900040)
