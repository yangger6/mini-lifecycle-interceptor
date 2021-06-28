# mini-lifecycle-interceptor

[![zh-cn](https://img.shields.io/badge/zh--cn-%E4%B8%AD%E6%96%87-yellow)](https://github.com/yangger6/mini-lifecycle-interceptor/blob/main/README_CN.md)

Mini Program lifeCycle interceptor


## Features

- [x]  interceptor Page
- [x]  interceptor Component
- [x]  support Promise
- [ ]  support filter
- [ ]  support exclude

## App Env Support

- [x]  support Wechat Mini Program
- [x]  support Taro
- [ ]  support Alipay Mini Program

Different App Env Support Table.

| Prototype     | Type          | Wechat        | Alipay        |
| ------------- | ------------- | ------------- | ------------- |
| onLoad        | `Page`        | ✔️           	| ✔️            |
| onShow        | `Page`        | ✔️           	| ✔️            |
| onReady       | `Page`        | ✔️           	| ✔️            |
| onHide        | `Page`        | ✔️           	| ✔️            |
| onUnload      | `Page`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |
| created        | `Component`        | ✔️           	| ✔️            |


## Installing

Using npm:

```bash
$ npm install mini-lifecycle-interceptor --save
```

Using yarn:

```bash
$ yarn add mini-lifecycle-interceptor
```

## Example

Using Taro:

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

Using Wechat Mini Program

[Preview effects in wechatwebdevtools.app](https://developers.weixin.qq.com/s/OTFY2om97wrf)

## mini-lifecycle-interceptor API

create can be made by passing the relevant config to `mini-lifecycle-interceptor`.

miniLifeCycle.create(env, config)

```typescript
miniLifeCycle.create('weapp', {
    // TODO
})
```

## Interceptors method aliaes

For convenience aliases have been provided for all supported mini program lifeCycle methods.

### Page LifeCycle Method Interceptor

miniLifeCycle.interceptors.onLoad.use // or miniLifeCycle.interceptors.onLoad.useAfter

miniLifeCycle.interceptors.onShow.use // or miniLifeCycle.interceptors.onShow.useAfter

miniLifeCycle.interceptors.onHide.use // or miniLifeCycle.interceptors.onHide.useAfter

miniLifeCycle.interceptors.onReady.use // or miniLifeCycle.interceptors.onReady.useAfter

miniLifeCycle.interceptors.onUnload.use // or miniLifeCycle.interceptors.onUnload.useAfter

### Component LifeCycle Method Interceptor

miniLifeCycle.interceptors.created.use // or miniLifeCycle.interceptors.created.useAfter

miniLifeCycle.interceptors.attached.use // or miniLifeCycle.interceptors.attached.useAfter

miniLifeCycle.interceptors.ready.use // or miniLifeCycle.interceptors.ready.useAfter

miniLifeCycle.interceptors.detached.use // or miniLifeCycle.interceptors.detached.useAfter

miniLifeCycle.interceptors.moved.use // or miniLifeCycle.interceptors.moved.useAfter

miniLifeCycle.interceptors.error.use // or miniLifeCycle.interceptors.error.useAfter

## License

[MIT](LICENSE)
