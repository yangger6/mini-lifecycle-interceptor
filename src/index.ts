import InterceptorManager, { IMiniLifeCycleKey, isLifeCyclePrototype } from './core/InterceptorManager'
import { overwriteComponent, overwritePage } from './core/overwriteMiniLifeCycle'
export type APP_ENV = 'weapp' | 'alipay'

export interface IMiniLifeCycle {
  env: APP_ENV
  originPage: any
  originComponent: any
  interceptors?: {
    [key in IMiniLifeCycleKey]: InterceptorManager
  }
  create: (env: APP_ENV) => void
  init: () => void
  addInterceptors: () => void
}

class MiniLifeCycle implements IMiniLifeCycle {
  env: APP_ENV

  originPage: any

  originComponent: any

  interceptors?: {
    [key in IMiniLifeCycleKey]: InterceptorManager
  }

  constructor() {
    try {
      this.originPage = Page
      this.originComponent = Component
    } catch (e) {
      console.error('绑定小程序原生方法Page、Component异常:\t', e)
    }
    this.env = 'weapp'
    this.init()
    this.addInterceptors()
  }

  /**
   * TODO 区别平台做不同的适配
   * 创建 区分运行平台或者传入配置项
   * @param env
   */
  create(env: APP_ENV) {
    this.env = env
  }

  /**
   * 初始化拦截器
   */
  init() {
    this.interceptors = new Proxy(
      {},
      {
        get(target: any, prototypeText: IMiniLifeCycleKey): any {
          if (isLifeCyclePrototype(prototypeText) && !target[prototypeText]) {
            target[prototypeText] = new InterceptorManager(prototypeText)
          }
          return target[prototypeText]
        },
      },
    ) as {
      [key in IMiniLifeCycleKey]: InterceptorManager
    }
  }

  /**
   * 给小程序的Page、Component注入拦截器
   */
  addInterceptors() {
    Page = overwritePage.bind(this)
    Component = overwriteComponent.bind(this)
  }
}

export default new MiniLifeCycle()
