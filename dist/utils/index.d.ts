import { IHandle } from './wxCompose';
/**
 * 把拦截器方法变成数组
 * @param handles {IHandle | Array<IHandle>>} - 拦截器传入的方法或者数组
 * @returns handles {Array<Handle>} - 拦截器方法数组
 */
export declare const handleToList: <T>(handles: IHandle<T> | IHandle<T>[]) => IHandle<T>[];
export declare const compareVersion: (version1: string, version2: string) => 0 | 1 | -1;
