import InterceptorManager from './InterceptorManager'
import wxCompose, { INextHandle } from '../utils/wxCompose'
import { IMiniLifeCycle } from '../index'
import { compareVersion } from '../utils/index'
import {
  getMiniProgramLifecycles,
  IMiniProgramComponentLifecyclePublicKeys,
  IMiniProgramPageLifecyclePublicKeys,
} from './miniLifecycles'

/**
 * 覆盖写入小程序Page方法
 * @param options - 小程序传入的参数
 */
export function overwritePage(this: IMiniLifeCycle, options: any) {
  const miniLifeCycleInstance = this
  const { pageLifecycles } = getMiniProgramLifecycles(miniLifeCycleInstance.env)
  if (!pageLifecycles) {
    console.error(`小程序平台: ${miniLifeCycleInstance.env}, 没有配置Page的生命周期方法`)
    return
  }
  Object.keys(pageLifecycles).forEach((pageLifeCycleKey) => {
    // 当前小程序生命周期方法名
    const currentLifecycleFunctionName = pageLifecycles[pageLifeCycleKey as IMiniProgramPageLifecyclePublicKeys]
    // 小程序生命周期原来的方法
    const originLifeCycleFunction = options[currentLifecycleFunctionName]
    // 包装
    options[currentLifecycleFunctionName] = function (...args: any) {
      // 小程序生命周期内的上下文
      const miniContext = this
      // 如果写了拦截器
      if (
        miniLifeCycleInstance.interceptors &&
        Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, currentLifecycleFunctionName)
      ) {
        const { useHandles, useAfterHandles }: InterceptorManager =
          miniLifeCycleInstance.interceptors[pageLifeCycleKey as IMiniProgramPageLifecyclePublicKeys]
        // 包装页面的生命周期函数
        const wrapperFn = <T>(options: T, next: INextHandle): void => {
          if (originLifeCycleFunction) {
            originLifeCycleFunction.call(miniContext, options)
          }
          next()
        }
        return wxCompose([...useHandles, wrapperFn, ...useAfterHandles]).apply(miniContext, args)
      } else {
        // 返回本身
        if (originLifeCycleFunction) {
          return originLifeCycleFunction.apply(miniContext, args)
        }
      }
    }
  })
  return miniLifeCycleInstance.originPage(options)
}

export function overwriteComponent(this: IMiniLifeCycle, options: any) {
  const miniLifeCycleInstance = this
  const { componentLifecycles } = getMiniProgramLifecycles(miniLifeCycleInstance.env)
  if (!componentLifecycles) {
    console.error(`小程序平台: ${miniLifeCycleInstance.env}, 没有配置Component的生命周期方法`)
    return
  }
  // ========== 微信小程序特殊处理开始 ==========
  let needOverwriteLifetimes = false // 是否要覆盖写入lifetimes字段
  let optionsOrLifeTimes: any
  if (miniLifeCycleInstance.env === 'weapp') {
    // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明（这是推荐的方式，其优先级最高）
    const currentVersion = (wx as any)?.version?.version
    if (compareVersion(currentVersion, '2.2.3') >= 0) {
      // 所以这里要对 lifetimes 做适配
      if (!options.lifetimes) {
        options.lifetimes = {}
      }
      needOverwriteLifetimes = true
      optionsOrLifeTimes = options.lifetimes
    }
  } else {
    optionsOrLifeTimes = options
  }
  // ========== 微信小程序特殊处理结束 ==========
  Object.keys(componentLifecycles).forEach((componentLifeCycleKey) => {
    // 当前小程序生命周期方法名
    const currentLifecycleFunctionName =
      componentLifecycles[componentLifeCycleKey as IMiniProgramComponentLifecyclePublicKeys]
    if (needOverwriteLifetimes) {
      // 把原本的生命周期方法写入 lifetimes
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      optionsOrLifeTimes[currentLifecycleFunctionName] =
        optionsOrLifeTimes[currentLifecycleFunctionName] || function () {}
      // 防止重复调用 删除原来的
      delete options[currentLifecycleFunctionName]
    }
    // 原来的生命周期的方法
    const originLifeCycleFunction = optionsOrLifeTimes[currentLifecycleFunctionName]
    // 设置新的生命周期方法
    optionsOrLifeTimes[currentLifecycleFunctionName] = function (...args: any) {
      // 小程序生命周期内的上下文
      const miniContext = this
      // 如果有拦截器
      if (
        miniLifeCycleInstance.interceptors &&
        Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, componentLifeCycleKey)
      ) {
        const { useHandles, useAfterHandles }: InterceptorManager =
          miniLifeCycleInstance.interceptors[componentLifeCycleKey as IMiniProgramComponentLifecyclePublicKeys]
        // 包装页面的生命周期函数
        const wrapperFn = <T>(options: T, next: INextHandle): void => {
          if (originLifeCycleFunction) {
            originLifeCycleFunction.call(miniContext, options)
          }
          next()
        }
        return wxCompose([...useHandles, wrapperFn, ...useAfterHandles]).apply(miniContext, args)
      } else {
        if (originLifeCycleFunction) {
          // 返回本身
          return originLifeCycleFunction.apply(miniContext, args)
        }
      }
    }
  })
  return miniLifeCycleInstance.originComponent(options)
}
