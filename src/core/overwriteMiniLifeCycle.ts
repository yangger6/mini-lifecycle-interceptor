import InterceptorManager, { IMiniLifeCycleKey, miniComponentLifeCycle, miniPageLifeCycle } from './InterceptorManager'
import wxCompose, { INextHandle } from '../utils/wxCompose'
import { IMiniLifeCycle } from '..'
import { compareVersion } from '../utils'

/**
 * 覆盖写入小程序Page方法
 * @param options - 小程序传入的参数
 */
export function overwritePage(this: IMiniLifeCycle, options: any) {
  const miniLifeCycleInstance = this
  Object.keys(miniPageLifeCycle).forEach((pageLifeCycleKey) => {
    // 小程序生命周期原来的方法
    const originLifeCycleFunction = options[pageLifeCycleKey]
    // 包装
    options[pageLifeCycleKey] = function (...args: any) {
      // 小程序生命周期内的上下文
      const miniContext = this
      // 如果写了拦截器
      if (
        miniLifeCycleInstance.interceptors &&
        Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, pageLifeCycleKey)
      ) {
        const { useHandles, useAfterHandles }: InterceptorManager =
          miniLifeCycleInstance.interceptors[pageLifeCycleKey as IMiniLifeCycleKey]
        // 包装页面的生命周期函数
        const wrapperFn = <T>(options: T, next: INextHandle): void => {
          originLifeCycleFunction.call(miniContext, options)
          next()
        }
        return wxCompose([...useHandles, wrapperFn, ...useAfterHandles]).apply(miniContext, args)
      } else {
        // 返回本身
        return originLifeCycleFunction.apply(miniContext, args)
      }
    }
  })
  return miniLifeCycleInstance.originPage(options)
}

export function overwriteComponent(this: IMiniLifeCycle, options: any) {
  const miniLifeCycleInstance = this
  Object.keys(miniComponentLifeCycle).forEach((componentLifeCycleKey) => {
    let optionsOrLifeTimes: any
    // 微信小程序特殊处理
    if (miniLifeCycleInstance.env === 'weapp') {
      // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明（这是推荐的方式，其优先级最高）
      const currentVersion = (wx as any)?.version?.version
      if (compareVersion(currentVersion, '2.2.3') >= 0) {
        // 所以这里要对 lifetimes 做适配
        if (!options.lifetimes) {
          options.lifetimes = {}
        }
        // 写入原生方法
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        options.lifetimes[componentLifeCycleKey] = options[componentLifeCycleKey] || function () {}
        // 防止重复调用
        // delete options[componentLifeCycleKey]
        optionsOrLifeTimes = options.lifetimes
      }
    } else {
      optionsOrLifeTimes = options
    }
    // 原来的生命周期的方法
    const originLifeCycleFunction = options[componentLifeCycleKey]
    // 设置新的生命周期方法
    optionsOrLifeTimes[componentLifeCycleKey] = function (...args: any) {
      // 小程序生命周期内的上下文
      const miniContext = this
      // 如果有拦截器
      if (
        miniLifeCycleInstance.interceptors &&
        Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, componentLifeCycleKey)
      ) {
        const { useHandles, useAfterHandles }: InterceptorManager =
          miniLifeCycleInstance.interceptors[componentLifeCycleKey as IMiniLifeCycleKey]
        // 包装页面的生命周期函数
        const wrapperFn = <T>(options: T, next: INextHandle): void => {
          originLifeCycleFunction.call(miniContext, options)
          next()
        }
        return wxCompose([...useHandles, wrapperFn, ...useAfterHandles]).apply(miniContext, args)
      } else {
        // 返回本身
        return originLifeCycleFunction.apply(miniContext, args)
      }
    }
  })
  return miniLifeCycleInstance.originPage(options)
}
