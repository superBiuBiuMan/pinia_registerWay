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
