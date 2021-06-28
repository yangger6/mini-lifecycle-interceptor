import { APP_ENV } from '../index'

/**
 * 小程序页面的生命周期钩子集合
 * @description 微信小程序文档 - https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html
 * @description 支付宝小程序文档 - https://opendocs.alipay.com/mini/framework/page-detail#%E9%A1%B5%E9%9D%A2%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
 */
export const miniPageLifecycles = {
  onLaunch: 'onLaunch',
  onReady: 'onReady',
  onShow: 'onShow',
  onHide: 'onHide',
  onLoad: 'onLoad',
  onUnload: 'onUnload',
}

/**
 * 微信自定义组件的生命周期钩子集合
 * @description 微信小程序文档 - https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html
 */
export const weappMiniProgramComponentLifecycles = {
  created: 'created', // 在组件实例刚刚被创建时执行
  attached: 'attached', // 在组件实例进入页面节点树时执行
  ready: 'ready', // 在组件在视图层布局完成后执行
  detached: 'detached', // 在组件实例被从页面节点树移除时执行
  moved: 'moved', // 在组件实例被移动到节点树另一个位置时执行 只有微信有
  update: '', // 暂无
  error: 'error', // 每当组件方法抛出错误时执行
}

/**
 * 支付宝自定义组件的生命周期钩子集合
 * @description 支付宝小程序文档 - https://opendocs.alipay.com/mini/framework/component-lifecycle
 */
export const alipayMiniProgramComponentLifecycles = {
  created: 'onInit', // 组件创建时触发
  attached: 'deriveDataFromProps', // 组件创建时和更新前触发
  ready: 'didMount', // 组件创建完毕时触发
  detached: 'didUnmount', // 组件删除时触发
  moved: '', // 暂无
  update: 'didUpdate', // 组件更新完毕时触发
  error: 'onError', // 组件 js 代码抛出错误时触发
}

// 容器类型
export type IWrapperType = 'Page' | 'Component'

// 小程序平台组件生命周期公共Key
export type IMiniProgramComponentLifecyclePublicKeys =
  | 'created'
  | 'attached'
  | 'ready'
  | 'detached'
  | 'moved'
  | 'update'
  | 'error'

// 小程序平台页面生命周期公共Key
export type IMiniProgramPageLifecyclePublicKeys = 'onReady' | 'onShow' | 'onHide' | 'onLoad' | 'onUnload'

// 不同小程序平台中的小程序生命周期钩子
export interface IWeappMiniLifecycles {
  pageLifecycles: typeof miniPageLifecycles
  componentLifecycles: typeof weappMiniProgramComponentLifecycles
}
export interface IAlipayMiniLifecycles {
  pageLifecycles: typeof miniPageLifecycles
  componentLifecycles: typeof alipayMiniProgramComponentLifecycles
}
export interface INullMiniLifecycles {
  pageLifecycles: null
  componentLifecycles: null
}

export const getMiniProgramLifecycles = (
  env: APP_ENV,
): IWeappMiniLifecycles | IAlipayMiniLifecycles | INullMiniLifecycles => {
  if (env === 'weapp') {
    return {
      pageLifecycles: miniPageLifecycles,
      componentLifecycles: weappMiniProgramComponentLifecycles,
    }
  } else if (env === 'alipay') {
    return {
      pageLifecycles: miniPageLifecycles,
      componentLifecycles: alipayMiniProgramComponentLifecycles,
    }
  }
  return {
    pageLifecycles: null,
    componentLifecycles: null,
  }
}
