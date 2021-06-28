import { APP_ENV } from '../index';
import { IHandle } from '../utils/wxCompose';
import { IMiniProgramComponentLifecyclePublicKeys, IMiniProgramPageLifecyclePublicKeys, IWrapperType } from './miniLifecycles';
/**
 * 原型是否为小程序的生命周期的原型
 * @param env {string} - 小程序的运行环境
 * @param prototype {string} - 传入的原型key
 */
export declare const isLifeCyclePrototype: (env: APP_ENV, prototype: string) => boolean;
export default class InterceptorManager {
    env: APP_ENV;
    useHandles: Array<IHandle<any>>;
    useAfterHandles: Array<IHandle<any>>;
    wrapperType: IWrapperType | null;
    lifeCycleType: IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys | null;
    isDestroy: boolean;
    constructor(env: APP_ENV, lifeCycleType: IMiniProgramComponentLifecyclePublicKeys | IMiniProgramPageLifecyclePublicKeys);
    use<T>(handles: IHandle<T> | Array<IHandle<T>>): void;
    useAfter<T>(handles: IHandle<T> | Array<IHandle<T>>): void;
    destroy(): void;
    reset(): void;
    errorTip(errorType: number): void;
}
