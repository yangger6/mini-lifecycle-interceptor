# mini-lifecycle-interceptor

[![zh-cn](https://img.shields.io/badge/zh--cn-%E4%B8%AD%E6%96%87-yellow)](https://github.com/yangger6/mini-lifecycle-interceptor/blob/main/README_CN.md)

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
- [ ]  支持支付宝小程序

## 安装

使用 npm:

```bash
$ npm install mini-lifecycle-interceptor
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
miniLifeCycle.create('weapp') // app env, default: weapp

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

```typescript
// TODO
```

## API

创建方法可以用来修改 `mini-lifecycle-interceptor`的配置.

miniLifeCycle.create(env, config)

```typescript
miniLifeCycle.create('weapp', {
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
