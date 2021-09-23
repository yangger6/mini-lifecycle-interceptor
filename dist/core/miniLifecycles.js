export const miniPageLifecycles={onLaunch:'onLaunch',onReady:'onReady',onShow:'onShow',onHide:'onHide',onLoad:'onLoad',onUnload:'onUnload'};
export const weappMiniProgramComponentLifecycles={created:'created',attached:'attached',ready:'ready',detached:'detached',moved:'moved',update:'',error:'error'};
export const alipayMiniProgramComponentLifecycles={created:'onInit',attached:'deriveDataFromProps',ready:'didMount',detached:'didUnmount',moved:'',update:'didUpdate',error:'onError'};
export const getMiniProgramLifecycles=env=>{if(env==='weapp'){return {pageLifecycles:miniPageLifecycles,componentLifecycles:weappMiniProgramComponentLifecycles};}else if(env==='alipay'){return {pageLifecycles:miniPageLifecycles,componentLifecycles:alipayMiniProgramComponentLifecycles};}return {pageLifecycles:null,componentLifecycles:null};};
