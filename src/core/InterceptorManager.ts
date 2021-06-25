import { handleToList } from '../utils'
import { IHandle } from '../utils/wxCompose'

/**
 * 小程序页面的生命周期钩子集合
 */
export const miniPageLifeCycle = {
  onReady: 'onReady',
  onShow: 'onShow',
  onHide: 'onHide',
  onLoad: 'onLoad',
  onUnload: 'onUnload',
}

/**
 * 小程序页面的生命周期钩子集合
 * @description 官网 - https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html
 */
export const miniComponentLifeCycle = {
  created: 'created',
  attached: 'attached',
  ready: 'ready',
  detached: 'detached',
  moved: 'moved',
  error: 'error',
}

// 容器类型
export type IWrapperType = 'Page' | 'Component'
// 小程序内所有生命周期钩子
export type IMiniLifeCycleKey = keyof typeof miniPageLifeCycle | keyof typeof miniComponentLifeCycle

/**
 * 原型是否为小程序的生命周期的原型
 * @param prototype {string} - 传入的原型key
 */
export const isLifeCyclePrototype = (prototype: string): boolean => {
  if (Object.hasOwnProperty.call(miniPageLifeCycle, prototype)) {
    return true
  }
  if (Object.hasOwnProperty.call(miniComponentLifeCycle, prototype)) {
    return true
  }
  return false
}

export default class InterceptorManager {
  // 生命周期方法运行前的方法
  useHandles: Array<IHandle<any>> = []

  // 生命周期方法运行后的方法
  useAfterHandles: Array<IHandle<any>> = []

  // 当前容器的类型
  wrapperType: IWrapperType | null

  // 当前拦截的生命周期名
  lifeCycleType: IMiniLifeCycleKey | null

  // 是否被销毁
  isDestroy = false

  constructor(lifeCycleType: IMiniLifeCycleKey) {
    // 如果是Page
    if (Object.hasOwnProperty.call(miniPageLifeCycle, lifeCycleType)) {
      this.wrapperType = 'Page'
      this.lifeCycleType = lifeCycleType
      return
    }
    // 如果是组件
    if (Object.hasOwnProperty.call(miniComponentLifeCycle, lifeCycleType)) {
      this.wrapperType = 'Component'
      this.lifeCycleType = lifeCycleType
      return
    }
    this.wrapperType = null
    this.lifeCycleType = null
  }

  // 拦截器加入方法
  use<T>(handles: IHandle<T> | Array<IHandle<T>>) {
    if (!this.lifeCycleType) {
      return this.errorTip(0)
    }
    this.isDestroy = false
    this.useHandles = this.useHandles.concat(handleToList<T>(handles))
  }

  // 拦截器加入方法
  useAfter<T>(handles: IHandle<T> | Array<IHandle<T>>) {
    if (!this.lifeCycleType) {
      return this.errorTip(0)
    }
    this.isDestroy = false
    this.useAfterHandles = handleToList(handleToList<T>(handles))
  }

  // 销毁
  destroy() {
    this.useHandles = []
    this.useAfterHandles = []
    this.isDestroy = true
    console.log('已经卸载')
  }

  // 重置
  reset() {
    this.useHandles = []
    this.useAfterHandles = []
    this.isDestroy = false
    console.log('已经重置')
  }

  // 错误提示
  errorTip(errorType: number) {
    if (errorType === 0) {
      console.error('暂不支持小程序自带的生命周期之外的钩子')
    }
  }
}
