import { IHandle } from '../utils/wxCompose';
/**
 * 小程序页面的生命周期钩子集合
 */
export declare const miniPageLifeCycle: {
    onReady: string;
    onShow: string;
    onHide: string;
    onLoad: string;
    onUnload: string;
};
/**
 * 小程序页面的生命周期钩子集合
 * @description 官网 - https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html
 */
export declare const miniComponentLifeCycle: {
    created: string;
    attached: string;
    ready: string;
    detached: string;
    moved: string;
    error: string;
};
export declare type IWrapperType = 'Page' | 'Component';
export declare type IMiniLifeCycleKey = keyof typeof miniPageLifeCycle | keyof typeof miniComponentLifeCycle;
/**
 * 原型是否为小程序的生命周期的原型
 * @param prototype {string} - 传入的原型key
 */
export declare const isLifeCyclePrototype: (prototype: string) => boolean;
export default class InterceptorManager {
    useHandles: Array<IHandle<any>>;
    useAfterHandles: Array<IHandle<any>>;
    wrapperType: IWrapperType | null;
    lifeCycleType: IMiniLifeCycleKey | null;
    isDestroy: boolean;
    constructor(lifeCycleType: IMiniLifeCycleKey);
    use<T>(handles: IHandle<T> | Array<IHandle<T>>): void;
    useAfter<T>(handles: IHandle<T> | Array<IHandle<T>>): void;
    destroy(): void;
    reset(): void;
    errorTip(errorType: number): void;
}
