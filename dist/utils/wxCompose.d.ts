export declare type INextHandle = () => Promise<any>;
export declare type IHandle<T> = (options: T, next: INextHandle) => any;
export declare type IComposeHandle<T> = (options: T, next?: INextHandle) => Promise<void>;
/**
 * 仿照koa-compose，连接拦截器方法数组
 * @param handles {Array<IHandle>>} - 拦截器方法数组
 * @returns composeHandles {IComposeHandle} - 连接好小程序原生生命周期方法后的数组
 */
export default function wxCompose<T>(handles: Array<IHandle<T>>): IComposeHandle<T>;
