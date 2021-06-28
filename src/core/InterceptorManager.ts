import { APP_ENV } from '../index'
import { handleToList } from '../utils/index'
import { IHandle } from '../utils/wxCompose'
import {
  getMiniProgramLifecycles,
  IMiniProgramComponentLifecyclePublicKeys,
  IMiniProgramPageLifecyclePublicKeys,
  IWrapperType,
} from './miniLifecycles'

/**
 * 原型是否为小程序的生命周期的原型
 * @param env {string} - 小程序的运行环境
 * @param prototype {string} - 传入的原型key
 */
export const isLifeCyclePrototype = (env: APP_ENV, prototype: string): boolean => {
  const { pageLifecycles, componentLifecycles } = getMiniProgramLifecycles(env)
  if (pageLifecycles && Object.hasOwnProperty.call(pageLifecycles, prototype)) {
    return true
  }
  if (componentLifecycles && Object.hasOwnProperty.call(componentLifecycles, prototype)) {
    return true
  }
  return false
}

export default class InterceptorManager {
  // APP 平台
  env: APP_ENV

  // 生命周期方法运行前的方法
  useHandles: Array<IHandle<any>> = []

  // 生命周期方法运行后的方法
  useAfterHandles: Array<IHandle<any>> = []

  // 当前容器的类型
  wrapperType: IWrapperType | null

  // 当前拦截的生命周期名
  lifeCycleType: IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys | null

  // 是否被销毁
  isDestroy = false

  constructor(
    env: APP_ENV,
    lifeCycleType: IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys,
  ) {
    this.env = env
    const { pageLifecycles, componentLifecycles } = getMiniProgramLifecycles(env)
    if (!pageLifecycles && !componentLifecycles) {
      this.wrapperType = null
      this.lifeCycleType = null
      this.errorTip(1)
      return
    }
    // 如果是Page
    if (Object.hasOwnProperty.call(pageLifecycles, lifeCycleType)) {
      this.wrapperType = 'Page'
      this.lifeCycleType = lifeCycleType
      return
    }
    // 如果是组件
    if (Object.hasOwnProperty.call(componentLifecycles, lifeCycleType)) {
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
    this.useAfterHandles = this.useAfterHandles.concat(handleToList<T>(handles))
  }

  // 销毁
  destroy() {
    this.useHandles = []
    this.useAfterHandles = []
    this.isDestroy = true
  }

  // 重置
  reset() {
    this.useHandles = []
    this.useAfterHandles = []
    this.isDestroy = false
  }

  // 错误提示
  errorTip(errorType: number) {
    if (errorType === 0) {
      console.error('暂不支持小程序自带的生命周期之外的钩子')
    } else if (errorType === 1) {
      console.error(`小程序平台: ${this.env}, 没有配置Page、Component的生命周期方法`)
    }
  }
}
