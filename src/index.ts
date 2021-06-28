import InterceptorManager, { isLifeCyclePrototype } from './core/InterceptorManager'
import { overwriteComponent, overwritePage } from './core/overwriteMiniLifeCycle'
import {
  getMiniProgramLifecycles,
  IMiniProgramComponentLifecyclePublicKeys,
  IMiniProgramPageLifecyclePublicKeys,
} from './core/miniLifecycles'
export type APP_ENV = 'weapp' | 'alipay'

export interface IMiniLifeCycle {
  env: APP_ENV
  originPage: any
  originComponent: any
  isInitSuccess: boolean
  interceptors?: {
    [key in IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys]: InterceptorManager
  }
  create: (env: APP_ENV) => void
  init: () => void
  addInterceptors: () => void
}

class MiniLifeCycle implements IMiniLifeCycle {
  env: APP_ENV

  originPage: any

  originComponent: any

  isInitSuccess: boolean

  interceptors?: {
    [key in IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys]: InterceptorManager
  }

  constructor() {
    try {
      this.originPage = Page
      this.originComponent = Component
    } catch (e) {
      console.error('绑定小程序原生方法Page、Component异常:\t', e)
    }
    this.env = 'weapp'
    this.isInitSuccess = false
  }

  /**
   * TODO 区别平台做不同的适配
   * TODO options
   * 创建 区分运行平台或者传入配置项
   * @param env
   */
  create(env: APP_ENV) {
    this.env = env
    this.init()
    this.addInterceptors()
  }

  /**
   * 初始化拦截器
   */
  init() {
    const env = this.env
    const { pageLifecycles, componentLifecycles } = getMiniProgramLifecycles(env)
    if (!pageLifecycles && !componentLifecycles) {
      console.error(`小程序平台: ${this.env}, 没有配置Page、Component的生命周期方法`)
      this.isInitSuccess = false
      return
    }
    this.interceptors = new Proxy(
      {},
      {
        get(target: any, prototypeText: IMiniProgramComponentLifecyclePublicKeys): any {
          if (isLifeCyclePrototype(env, prototypeText) && !target[prototypeText]) {
            target[prototypeText] = new InterceptorManager(env, prototypeText)
          }
          if (!target[prototypeText]) {
            console.error(`当前小程序运行平台没有此生命周期方法 -> ${prototypeText}`)
            return {}
          }
          return target[prototypeText]
        },
      },
    ) as {
      [key in IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys]: InterceptorManager
    }
    this.isInitSuccess = true
  }

  /**
   * 给小程序的Page、Component注入拦截器
   */
  addInterceptors() {
    // eslint-disable-next-line
    // @ts-ignore
    if (Page && Component && this.isInitSuccess) {
      Page = overwritePage.bind(this)
      Component = overwriteComponent.bind(this)
    }
  }
}

export default new MiniLifeCycle()
