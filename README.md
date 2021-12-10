# mini-lifecycle-interceptor

[![en](https://img.shields.io/badge/en-English-blue)](https://github.com/yangger6/mini-lifecycle-interceptor/blob/main/README_EN.md)

小程序生命周期方法拦截器


## 特性

- [x]  拦截Page
- [x]  拦截Component
- [x]  支持Promise
- [ ]  支持过滤
- [ ]  支持排除

## 运行平台支持

- [x]  支持微信小程序
- [x]  支持Taro
- [x]  支持支付宝小程序

不同的小程序平台的拦截器方法的支持程度如下: 

| 方法名         | 容器类型        |描述                                                                         | 微信小程序        | 支付宝小程序    |
| ------------- | ------------- |---------------------------------------------------------------------------- | --------------- | ------------- |
| onLoad        | `Page`        | 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。 | ✔️           	| ✔️            |
| onShow        | `Page`        | 页面显示/切入前台时触发                                                         | ✔️           	| ✔️            |
| onReady       | `Page`        | 页面初次渲染完成时触发                                                          | ✔️           	| ✔️            |
| onHide        | `Page`        | 页面隐藏/切入后台时触发                                                         | ✔️           	| ✔️            |
| onUnload      | `Page`        | 页面卸载时触发                                                                 | ✔️           	| ✔️            |
| created       | `Component`   | 在组件实例进入页面节点树时执行                                                    | ✔️           	| ✔️            |
| attached      | `Component`   | 在组件实例进入页面节点树时执行                                                    | ✔️           	| ✔️            |
| ready         | `Component`   | 在组件在视图层布局完成后执行                                                     | ✔️           	| ✔️            |
| detached      | `Component`   | 在组件实例被从页面节点树移除时执行                                                | ✔️           	| ✔️            |
| moved         | `Component`   | 在组件实例被移动到节点树另一个位置时执行                                           | ✔️           	| ✘             |
| update        | `Component`   | 组件更新完毕时触发                                                             | ✘           	| ✔️            |
| error         | `Component`   | 每当组件方法抛出错误时执行                                                       | ✔️           	| ✔️            |

## 安装

使用 npm:

```bash
$ npm install mini-lifecycle-interceptor --save
```

使用 yarn:

```bash
$ yarn add mini-lifecycle-interceptor
```

## 示例

使用Taro:

```typescript

import { useEffect } from 'react'
import miniLifeCycle from 'mini-lifecycle-interceptor'
miniLifeCycle.create(process.env.TARO_ENV) // weapp | alipay, default: weapp

function App(props: any) {
    const delay = (t, prefix) =>
        new Promise((res) =>
            setTimeout(() => {
                console.log(`${prefix}: delay ${t}ms`)
                res()
            }, t)
        )
    useEffect(() => {
        miniLifeCycle.interceptors.onLoad.use(async function (options, next) {
            console.log('before onLoad', options)
            await delay(1000, 'step1')
            next()
        })
        miniLifeCycle.interceptors.onLoad.use([
            async function (options, next) {
                console.log('after onLoad', options)
                await delay(1000, 'step2')
                next()
            },
            async function (options, next) {
                console.log('after onLoad', options)
                await delay(1000, 'step3')
                next()
            }
        ])
        miniLifeCycle.interceptors.onLoad.useAfter([
            async function (options, next) {
                console.log('after onLoad', options)
                await delay(1000, 'step4')
                next()
            },
            async function (options, next) {
                console.log('after onLoad', options)
                await delay(1000, 'step5')
                next()
            }
        ])
    }, [])
}
// Console
// step1: delay 1000ms
// step2: delay 1000ms
// step3: delay 1000ms
// step origin fn onLoad
// step4: delay 1000ms
// step5: delay 1000ms
```

使用微信小程序:

[在开发者工具中预览效果](https://developers.weixin.qq.com/s/owOFbrmR79v1)

## API

创建方法可以用来修改 `mini-lifecycle-interceptor`的配置.

miniLifeCycle.create(env, config)

```typescript
// 微信 weapp 支付宝 alipay
miniLifeCycle.create('weapp', { // or alipay
    // TODO
})
```

## 拦截器方法

为方便起见，为所有支持的拦截器方法提供了别名

### 页面生命周期方法拦截器

miniLifeCycle.interceptors.onLoad.use // or miniLifeCycle.interceptors.onLoad.useAfter

miniLifeCycle.interceptors.onShow.use // or miniLifeCycle.interceptors.onShow.useAfter

miniLifeCycle.interceptors.onHide.use // or miniLifeCycle.interceptors.onHide.useAfter

miniLifeCycle.interceptors.onReady.use // or miniLifeCycle.interceptors.onReady.useAfter

miniLifeCycle.interceptors.onUnload.use // or miniLifeCycle.interceptors.onUnload.useAfter

### 自定义组件生命周期方法拦截器

miniLifeCycle.interceptors.created.use // or miniLifeCycle.interceptors.created.useAfter

miniLifeCycle.interceptors.attached.use // or miniLifeCycle.interceptors.attached.useAfter

miniLifeCycle.interceptors.ready.use // or miniLifeCycle.interceptors.ready.useAfter

miniLifeCycle.interceptors.detached.use // or miniLifeCycle.interceptors.detached.useAfter

miniLifeCycle.interceptors.moved.use // or miniLifeCycle.interceptors.moved.useAfter

miniLifeCycle.interceptors.error.use // or miniLifeCycle.interceptors.error.useAfter

## 许可证

[MIT](LICENSE)
