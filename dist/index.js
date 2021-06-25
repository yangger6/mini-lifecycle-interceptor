const handleToList = (handles)=>{
    if (handles instanceof Array) return handles;
    return [
        handles
    ];
};
const compareVersion = (version1, version2)=>{
    if (version1 === version2) return 0;
    const a_components = version1.split('.');
    const b_components = version2.split('.');
    const len = Math.min(a_components.length, b_components.length);
    // loop while the components are equal
    for(let i = 0; i < len; i++){
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) return 1;
        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) return -1;
    }
    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) return 1;
    if (a_components.length < b_components.length) return -1;
    // Otherwise they are the same.
    return 0;
};
const miniPageLifeCycle = {
    onReady: 'onReady',
    onShow: 'onShow',
    onHide: 'onHide',
    onLoad: 'onLoad',
    onUnload: 'onUnload'
};
const miniComponentLifeCycle = {
    created: 'created',
    attached: 'attached',
    ready: 'ready',
    detached: 'detached',
    moved: 'moved',
    error: 'error'
};
const isLifeCyclePrototype = (prototype)=>{
    if (Object.hasOwnProperty.call(miniPageLifeCycle, prototype)) return true;
    if (Object.hasOwnProperty.call(miniComponentLifeCycle, prototype)) return true;
    return false;
};
class InterceptorManager {
    // 拦截器加入方法
    use(handles) {
        if (!this.lifeCycleType) return this.errorTip(0);
        this.isDestroy = false;
        this.useHandles = this.useHandles.concat(handleToList(handles));
    }
    // 拦截器加入方法
    useAfter(handles) {
        if (!this.lifeCycleType) return this.errorTip(0);
        this.isDestroy = false;
        this.useAfterHandles = this.useAfterHandles.concat(handleToList(handles));
    }
    // 销毁
    destroy() {
        this.useHandles = [];
        this.useAfterHandles = [];
        this.isDestroy = true;
        console.log('已经卸载');
    }
    // 重置
    reset() {
        this.useHandles = [];
        this.useAfterHandles = [];
        this.isDestroy = false;
        console.log('已经重置');
    }
    // 错误提示
    errorTip(errorType) {
        if (errorType === 0) console.error('暂不支持小程序自带的生命周期之外的钩子');
    }
    constructor(lifeCycleType){
        // 生命周期方法运行前的方法
        this.useHandles = [];
        // 生命周期方法运行后的方法
        this.useAfterHandles = [];
        // 是否被销毁
        this.isDestroy = false;
        // 如果是Page
        if (Object.hasOwnProperty.call(miniPageLifeCycle, lifeCycleType)) {
            this.wrapperType = 'Page';
            this.lifeCycleType = lifeCycleType;
            return;
        }
        // 如果是组件
        if (Object.hasOwnProperty.call(miniComponentLifeCycle, lifeCycleType)) {
            this.wrapperType = 'Component';
            this.lifeCycleType = lifeCycleType;
            return;
        }
        this.wrapperType = null;
        this.lifeCycleType = null;
    }
}
function wxCompose(handles) {
    return function(options, next) {
        const wxThis = this;
        // last called handle #
        let index = -1;
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = handles[i];
            if (i === handles.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                return fn.call(wxThis, options, dispatch.bind(null, i + 1));
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    };
}
function overwritePage(options) {
    const miniLifeCycleInstance = this;
    Object.keys(miniPageLifeCycle).forEach((pageLifeCycleKey)=>{
        // 小程序生命周期原来的方法
        const originLifeCycleFunction = options[pageLifeCycleKey];
        // 包装
        options[pageLifeCycleKey] = function(...args) {
            // 小程序生命周期内的上下文
            const miniContext = this;
            // 如果写了拦截器
            if (miniLifeCycleInstance.interceptors && Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, pageLifeCycleKey)) {
                const { useHandles , useAfterHandles  } = miniLifeCycleInstance.interceptors[pageLifeCycleKey];
                // 包装页面的生命周期函数
                const wrapperFn = (options1, next)=>{
                    originLifeCycleFunction.call(miniContext, options1);
                    next();
                };
                return wxCompose([
                    ...useHandles,
                    wrapperFn,
                    ...useAfterHandles
                ]).apply(miniContext, args);
            } else // 返回本身
            return originLifeCycleFunction.apply(miniContext, args);
        };
    });
    return miniLifeCycleInstance.originPage(options);
}
function overwriteComponent(options) {
    const miniLifeCycleInstance = this;
    Object.keys(miniComponentLifeCycle).forEach((componentLifeCycleKey)=>{
        let optionsOrLifeTimes;
        // 微信小程序特殊处理
        if (miniLifeCycleInstance.env === 'weapp') {
            var ref, ref1;
            // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明（这是推荐的方式，其优先级最高）
            const currentVersion = (ref = wx) === null || ref === void 0 ? void 0 : (ref1 = ref.version) === null || ref1 === void 0 ? void 0 : ref1.version;
            if (compareVersion(currentVersion, '2.2.3') >= 0) {
                // 所以这里要对 lifetimes 做适配
                if (!options.lifetimes) options.lifetimes = {
                };
                // 写入原生方法
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                options.lifetimes[componentLifeCycleKey] = options[componentLifeCycleKey] || function() {
                };
                // 防止重复调用
                // delete options[componentLifeCycleKey]
                optionsOrLifeTimes = options.lifetimes;
            }
        } else optionsOrLifeTimes = options;
        // 原来的生命周期的方法
        const originLifeCycleFunction = options[componentLifeCycleKey];
        // 设置新的生命周期方法
        optionsOrLifeTimes[componentLifeCycleKey] = function(...args) {
            // 小程序生命周期内的上下文
            const miniContext = this;
            // 如果有拦截器
            if (miniLifeCycleInstance.interceptors && Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors, componentLifeCycleKey)) {
                const { useHandles , useAfterHandles  } = miniLifeCycleInstance.interceptors[componentLifeCycleKey];
                // 包装页面的生命周期函数
                const wrapperFn = (options1, next)=>{
                    originLifeCycleFunction.call(miniContext, options1);
                    next();
                };
                return wxCompose([
                    ...useHandles,
                    wrapperFn,
                    ...useAfterHandles
                ]).apply(miniContext, args);
            } else // 返回本身
            return originLifeCycleFunction.apply(miniContext, args);
        };
    });
    return miniLifeCycleInstance.originPage(options);
}
class MiniLifeCycle {
    /**
   * TODO 区别平台做不同的适配
   * 创建 区分运行平台或者传入配置项
   * @param env
   */ create(env) {
        this.env = env;
    }
    /**
   * 初始化拦截器
   */ init() {
        this.interceptors = new Proxy({
        }, {
            get (target, prototypeText) {
                if (isLifeCyclePrototype(prototypeText) && !target[prototypeText]) target[prototypeText] = new InterceptorManager(prototypeText);
                return target[prototypeText];
            }
        });
    }
    /**
   * 给小程序的Page、Component注入拦截器
   */ addInterceptors() {
        Page = overwritePage.bind(this);
        Component = overwriteComponent.bind(this);
    }
    constructor(){
        try {
            this.originPage = Page;
            this.originComponent = Component;
        } catch (e) {
            console.error('绑定小程序原生方法Page、Component异常:\t', e);
        }
        this.env = 'weapp';
        this.init();
        this.addInterceptors();
    }
}
const __default = new MiniLifeCycle();
export { __default as default };
