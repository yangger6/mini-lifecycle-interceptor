import { IHandle } from './wxCompose'

/**
 * 把拦截器方法变成数组
 * @param handles {IHandle | Array<IHandle>>} - 拦截器传入的方法或者数组
 * @returns handles {Array<Handle>} - 拦截器方法数组
 */
export const handleToList = <T>(handles: IHandle<T> | Array<IHandle<T>>): Array<IHandle<T>> => {
  if (handles instanceof Array) {
    return handles
  }
  return [handles]
}

export const compareVersion = (version1: string, version2: string) => {
  if (version1 === version2) {
    return 0
  }
  const a_components = version1.split('.')
  const b_components = version2.split('.')
  const len = Math.min(a_components.length, b_components.length)
  // loop while the components are equal
  for (let i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1
    }
    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1
    }
  }
  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1
  }
  if (a_components.length < b_components.length) {
    return -1
  }
  // Otherwise they are the same.
  return 0
}
