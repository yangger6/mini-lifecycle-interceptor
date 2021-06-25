import InterceptorManager, { IMiniLifeCycleKey } from './core/InterceptorManager';
export declare type APP_ENV = 'weapp' | 'alipay';
export interface IMiniLifeCycle {
    env: APP_ENV;
    originPage: any;
    originComponent: any;
    interceptors?: {
        [key in IMiniLifeCycleKey]: InterceptorManager;
    };
    create: (env: APP_ENV) => void;
    init: () => void;
    addInterceptors: () => void;
}
declare class MiniLifeCycle implements IMiniLifeCycle {
    env: APP_ENV;
    originPage: any;
    originComponent: any;
    interceptors?: {
        [key in IMiniLifeCycleKey]: InterceptorManager;
    };
    constructor();
    /**
     * TODO 区别平台做不同的适配
     * 创建 区分运行平台或者传入配置项
     * @param env
     */
    create(env: APP_ENV): void;
    /**
     * 初始化拦截器
     */
    init(): void;
    /**
     * 给小程序的Page、Component注入拦截器
     */
    addInterceptors(): void;
}
declare const _default: MiniLifeCycle;
export default _default;
