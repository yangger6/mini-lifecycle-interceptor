# mini-lifecycle-interceptor

[![zh-cn](https://img.shields.io/badge/zh--cn-%E4%B8%AD%E6%96%87-yellow)](https://github.com/yangger6/mini-lifecycle-interceptor/blob/main/README.md)

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
- [x]  support Alipay Mini Program

Different App Env Support Table.

| Prototype     | Wrapper Type  | Description                                                                                                                                                                 | Wechat        | Alipay        |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------- |
| onLoad        | `Page`        | Executed when the page instance is created.A page will only be called once. You can get the parameters in the path to open the current page from the parameters of onload.  | ✔️           	| ✔️            |
| onShow        | `Page`        | Executed when the page instance is displayed/cut into the foreground                                                                                                        | ✔️           	| ✔️            |
| onReady       | `Page`        | Executed when the page instance is completed render the first page.                                                                                                         | ✔️           	| ✔️            |
| onHide        | `Page`        | Executed when the page instance is displayed/cut into the background                                                                                                        | ✔️           	| ✔️            |
| onUnload      | `Page`        | Executed when the page instance is unloaded                                                                                                                                 | ✔️           	| ✔️            |
| created       | `Component`   | Executed when the component instance is created                                                                                                                             | ✔️           	| ✔️            |
| attached      | `Component`   | Executed when the component instance enters the page node tree                                                                                                              | ✔️           	| ✔️            |
| ready         | `Component`   | Executed when the component layout is completed in the view layer                                                                                                           | ✔️           	| ✔️            |
| detached      | `Component`   | Executed when the component instance is moved to another node tree                                                                                                          | ✔️           	| ✔️            |
| moved         | `Component`   | Executed when the component instance is removed from the page node tree                                                                                                     | ✔️           	| ✘             |
| update        | `Component`   | Executed when the the component is updated                                                                                                                                  | ✘           	| ✔️            |
| error         | `Component`   | Executed each time the component method throws an exception                                                                                                                 | ✔️           	| ✔️            |


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
