import wxCompose from'../utils/wxCompose';
import {compareVersion}from'../utils/index';
import {getMiniProgramLifecycles}from'./miniLifecycles';
export function overwritePage(options){const miniLifeCycleInstance=this;const {pageLifecycles}=getMiniProgramLifecycles(miniLifeCycleInstance.env);if(!pageLifecycles){console.error(`小程序平台: ${miniLifeCycleInstance.env}, 没有配置Page的生命周期方法`);return;}Object.keys(pageLifecycles).forEach(pageLifeCycleKey=>{const currentLifecycleFunctionName=pageLifecycles[pageLifeCycleKey];const originLifeCycleFunction=options[currentLifecycleFunctionName];options[currentLifecycleFunctionName]=function(...args){const miniContext=this;if(miniLifeCycleInstance.interceptors&&Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors,currentLifecycleFunctionName)){const {useHandles,useAfterHandles}=miniLifeCycleInstance.interceptors[pageLifeCycleKey];const wrapperFn=(options1,next)=>{if(originLifeCycleFunction){originLifeCycleFunction.call(miniContext,options1);}next();};return wxCompose([...useHandles,wrapperFn,...useAfterHandles]).apply(miniContext,args);}else{if(originLifeCycleFunction){return originLifeCycleFunction.apply(miniContext,args);}}};});return miniLifeCycleInstance.originPage(options);}
export function overwriteComponent(options){const miniLifeCycleInstance=this;const {componentLifecycles}=getMiniProgramLifecycles(miniLifeCycleInstance.env);if(!componentLifecycles){console.error(`小程序平台: ${miniLifeCycleInstance.env}, 没有配置Component的生命周期方法`);return;}let needOverwriteLifetimes=false;let optionsOrLifeTimes;if(miniLifeCycleInstance.env==='weapp'){var ref,ref1;const currentVersion=(ref=wx)===null||ref=== void 0?void 0:(ref1=ref.version)===null||ref1=== void 0?void 0:ref1.version;if(compareVersion(currentVersion,'2.2.3')>=0){if(!options.lifetimes){options.lifetimes={};}needOverwriteLifetimes=true;optionsOrLifeTimes=options.lifetimes;}}else{optionsOrLifeTimes=options;}Object.keys(componentLifecycles).forEach(componentLifeCycleKey=>{const currentLifecycleFunctionName=componentLifecycles[componentLifeCycleKey];if(needOverwriteLifetimes){optionsOrLifeTimes[currentLifecycleFunctionName]=optionsOrLifeTimes[currentLifecycleFunctionName]||function(){};delete options[currentLifecycleFunctionName];}const originLifeCycleFunction=optionsOrLifeTimes[currentLifecycleFunctionName];optionsOrLifeTimes[currentLifecycleFunctionName]=function(...args){const miniContext=this;if(miniLifeCycleInstance.interceptors&&Object.hasOwnProperty.call(miniLifeCycleInstance.interceptors,componentLifeCycleKey)){const {useHandles,useAfterHandles}=miniLifeCycleInstance.interceptors[componentLifeCycleKey];const wrapperFn=(options1,next)=>{if(originLifeCycleFunction){originLifeCycleFunction.call(miniContext,options1);}next();};return wxCompose([...useHandles,wrapperFn,...useAfterHandles]).apply(miniContext,args);}else{if(originLifeCycleFunction){return originLifeCycleFunction.apply(miniContext,args);}}};});return miniLifeCycleInstance.originComponent(options);}
