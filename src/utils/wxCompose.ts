export type INextHandle = () => Promise<any>
export type IHandle<T> = (options: T, next: INextHandle) => any
export type IComposeHandle<T> = (options: T, next?: INextHandle) => Promise<void>

/**
 * 仿照koa-compose，连接拦截器方法数组
 * @param handles {Array<IHandle>>} - 拦截器方法数组
 * @returns composeHandles {IComposeHandle} - 连接好小程序原生生命周期方法后的数组
 */
export default function wxCompose<T>(handles: Array<IHandle<T>>): IComposeHandle<T> {
  return function (this: any, options, next) {
    const wxThis = this
    // last called tn
    let index = -1
    function dispatch(i: number): Promise<void> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = handles[i]
      if (i === handles.length) {
        fn = next as IHandle<T>
      }
      if (!fn) return Promise.resolve()
      try {
        return fn.call(wxThis, options, dispatch.bind(null, i + 1))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}
