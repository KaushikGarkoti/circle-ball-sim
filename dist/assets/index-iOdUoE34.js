(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class w{constructor(t,e,i,s,r="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),w.nextNameID=w.nextNameID||0,this.$name.id=`lil-gui-name-${++w.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",n=>n.stopPropagation()),this.domElement.addEventListener("keyup",n=>n.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class W extends w{constructor(t,e,i){super(t,e,i,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function F(l){let t,e;return(t=l.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=l.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=l.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const U={isPrimitive:!0,match:l=>typeof l=="string",fromHexString:F,toHexString:F},L={isPrimitive:!0,match:l=>typeof l=="number",fromHexString:l=>parseInt(l.substring(1),16),toHexString:l=>"#"+l.toString(16).padStart(6,0)},K={isPrimitive:!1,match:l=>Array.isArray(l)||ArrayBuffer.isView(l),fromHexString(l,t,e=1){const i=L.fromHexString(l);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([l,t,e],i=1){i=255/i;const s=l*i<<16^t*i<<8^e*i<<0;return L.toHexString(s)}},Z={isPrimitive:!1,match:l=>Object(l)===l,fromHexString(l,t,e=1){const i=L.fromHexString(l);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:l,g:t,b:e},i=1){i=255/i;const s=l*i<<16^t*i<<8^e*i<<0;return L.toHexString(s)}},J=[U,L,K,Z];function Q(l){return J.find(t=>t.match(l))}class tt extends w{constructor(t,e,i,s){super(t,e,i,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Q(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=F(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class I extends w{constructor(t,e,i){super(t,e,i,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class et extends w{constructor(t,e,i,s,r,n){super(t,e,i,"lil-number"),this._initInput(),this.min(s),this.max(r);const o=n!==void 0;this.step(o?n:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let c=parseFloat(this.$input.value);isNaN(c)||(this._stepExplicit&&(c=this._snap(c)),this.setValue(this._clamp(c)))},i=c=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+c),this.$input.value=this.getValue())},s=c=>{c.key==="Enter"&&this.$input.blur(),c.code==="ArrowUp"&&(c.preventDefault(),i(this._step*this._arrowKeyMultiplier(c))),c.code==="ArrowDown"&&(c.preventDefault(),i(this._step*this._arrowKeyMultiplier(c)*-1))},r=c=>{this._inputFocused&&(c.preventDefault(),i(this._step*this._normalizeMouseWheel(c)))};let n=!1,o,a,h,d,u;const g=5,_=c=>{o=c.clientX,a=h=c.clientY,n=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",f),window.addEventListener("mouseup",m)},f=c=>{if(n){const v=c.clientX-o,x=c.clientY-a;Math.abs(x)>g?(c.preventDefault(),this.$input.blur(),n=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>g&&m()}if(!n){const v=c.clientY-h;u-=v*this._step*this._arrowKeyMultiplier(c),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}h=c.clientY},m=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",m)},C=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",_),this.$input.addEventListener("focus",C),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,c,v,x,k)=>(p-c)/(v-c)*(k-x)+x,e=p=>{const c=this.$slider.getBoundingClientRect();let v=t(p,c.left,c.right,this._min,this._max);this._snapClampSetValue(v)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=p=>{e(p.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let n=!1,o,a;const h=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),n=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,a=p.touches[0].clientY,n=!0):h(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",g))},u=p=>{if(n){const c=p.touches[0].clientX-o,v=p.touches[0].clientY-a;Math.abs(c)>Math.abs(v)?h(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",g))}else p.preventDefault(),e(p.touches[0].clientX)},g=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",g)},_=this._callOnFinishChange.bind(this),f=400;let m;const C=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(m),m=setTimeout(_,f)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",C,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class it extends w{constructor(t,e,i,s){super(t,e,i,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class st extends w{constructor(t,e,i){super(t,e,i,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var nt=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function rt(l){const t=document.createElement("style");t.innerHTML=l;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let H=!1;class B{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:r="Controls",closeFolders:n=!1,injectStyles:o=!0,touchStyles:a=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),a&&this.domElement.classList.add("lil-allow-touch-styles"),!H&&o&&(rt(nt),H=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=n}add(t,e,i,s,r){if(Object(i)===i)return new it(this,t,e,i);const n=t[e];switch(typeof n){case"number":return new et(this,t,e,i,s,r);case"boolean":return new W(this,t,e);case"string":return new st(this,t,e);case"function":return new I(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,n)}addColor(t,e,i=1){return new tt(this,t,e,i)}addFolder(t){const e=new B({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof I||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof I)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const i=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}let lt=0;const b=()=>`e${++lt}`,q=(l,t)=>({x:l,y:t}),ot=(l,t)=>({x:l.x-t.x,y:l.y-t.y}),A=l=>l.x*l.x+l.y*l.y,at=l=>Math.sqrt(A(l)),ht=(l,t)=>at(ot(t,l)),ct=l=>l.length?l.reduce((t,e)=>t+e,0)/l.length:0,O=(l,t)=>.5*l*A(t),N=l=>{let t=l>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Y=(l,t,e)=>{const i=Math.PI*2,s=((l-e)%i+i)%i,r=(t.startAngle%i+i)%i,n=(t.endAngle%i+i)%i;return r<=n?s>=r&&s<=n:s>=r||s<=n},dt=l=>{let t=null,e=-1/0;for(const[i,s]of Object.entries(l))s>e&&(e=s,t=i);return t};class ut{constructor(t){this.cfg=t}integrate(t,e){const{gravity:i,drag:s}=this.cfg;for(const r of t){r.velocity.y+=i*e;const n=Math.max(0,1-s*e);r.velocity.x*=n,r.velocity.y*=n,r.position.x+=r.velocity.x*e,r.position.y+=r.velocity.y*e}}detectAndEmit(t,e,i,s,r){this._ballBall(t,i,s,r),this._ballCircle(t,e,i,s,r),this._rotateCircles(e)}_ballBall(t,e,i,s){for(let r=0;r<t.length;r++)for(let n=r+1;n<t.length;n++){const o=t[r],a=t[n],h=a.position.x-o.position.x,d=a.position.y-o.position.y,u=Math.sqrt(h*h+d*d),g=o.radius+a.radius;if(u>=g||u===0)continue;const _=h/u,f=d/u,m=(g-u)*.52;o.position.x-=_*m,o.position.y-=f*m,a.position.x+=_*m,a.position.y+=f*m;const C=a.velocity.x-o.velocity.x,p=a.velocity.y-o.velocity.y,c=C*_+p*f;if(c>0)continue;const x=-(1+Math.min(o.restitution,a.restitution))*c/(1/o.mass+1/a.mass);o.velocity.x-=x/o.mass*_,o.velocity.y-=x/o.mass*f,a.velocity.x+=x/a.mass*_,a.velocity.y+=x/a.mass*f;const k=O(o.mass,o.velocity)+O(a.mass,a.velocity);e.enqueue({id:b(),type:"BALL_BALL_COLLISION",tick:i,time:s,depth:0,originId:`col-${o.id}-${a.id}`,context:{entities:[o,a],ballA:o,ballB:a,energy:k,impulse:q(_*x,f*x),position:{x:(o.position.x+a.position.x)/2,y:(o.position.y+a.position.y)/2}}})}}_ballCircle(t,e,i,s,r){for(const n of t)for(const o of e){const a=n.position.x-o.center.x,h=n.position.y-o.center.y,d=Math.sqrt(a*a+h*h),u=o.radius-n.radius;if(d<u*.99)continue;const g=Math.atan2(h,a);if(o.gaps.some(f=>Y(g,f,o.rotation)))d>o.radius-n.radius*.5&&i.enqueue({id:b(),type:"BALL_ESCAPE_CIRCLE",tick:s,time:r,depth:0,originId:`escape-${n.id}`,context:{entities:[n,o],ball:n,circle:o,gap:o.gaps.find(f=>Y(g,f,o.rotation)),position:{...n.position},speed:Math.sqrt(A(n.velocity))}});else{const f=a/d,m=h/d,C=n.velocity.x*f+n.velocity.y*m;C>0&&(n.velocity.x-=2*C*f*n.restitution,n.velocity.y-=2*C*m*n.restitution),n.position.x=o.center.x+f*u*.98,n.position.y=o.center.y+m*u*.98,i.enqueue({id:b(),type:"BALL_WALL_COLLISION",tick:s,time:r,depth:0,originId:`wall-${n.id}`,context:{entities:[n,o],ball:n,circle:o,energy:O(n.mass,n.velocity),position:{x:o.center.x+f*o.radius,y:o.center.y+m*o.radius},normal:q(f,m)}})}}}_rotateCircles(t){for(const e of t)e.rotation=(e.rotation+e.rotationSpeed)%(Math.PI*2)}}class pt{constructor(){this._listeners=new Map,this._queue=[],this.MAX_DEPTH=8,this.MAX_PER_TICK=2e3}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>{var i;return(i=this._listeners.get(t))==null?void 0:i.delete(e)}}enqueue(t){this._queue.push(t)}flush(t){var s,r;const e=this._queue.splice(0);let i=0;for(const n of e){if(++i>this.MAX_PER_TICK){this.enqueue(this._sysEvent(n,"CHAIN_DEPTH_EXCEEDED",{reason:"per-tick limit"}));break}if(n.depth>this.MAX_DEPTH){this.enqueue(this._sysEvent(n,"CHAIN_DEPTH_EXCEEDED",{blockedType:n.type,depth:n.depth}));continue}t(n),(s=this._listeners.get(n.type))==null||s.forEach(o=>o(n)),(r=this._listeners.get("*"))==null||r.forEach(o=>o(n))}}_sysEvent(t,e,i={}){return{id:`sys-${e}-${Date.now()}`,type:e,tick:t.tick,time:t.time,depth:0,originId:t.originId??t.id,context:{entities:[],...i}}}reset(){this._listeners.clear(),this._queue=[]}}class gt{constructor(){this._rules=new Map,this._fireCounts=new Map,this._lastFired=new Map}register(...t){for(const e of t)this._rules.set(e.id,e)}remove(t){this._rules.delete(t)}enable(t){const e=this._rules.get(t);e&&(e.enabled=!0)}disable(t){const e=this._rules.get(t);e&&(e.enabled=!1)}handle(t,e,i){const s=[...this._rules.values()].filter(r=>r.enabled&&r.triggers.includes(t.type)&&this._cooldownOk(r,e.time)&&this._maxFiresOk(r)&&(!r.condition||r.condition(t,e))).sort((r,n)=>(n.priority??0)-(r.priority??0));for(const r of s){try{r.action(t,e,i)}catch(o){console.warn(`[Rule:${r.id}]`,o)}const n=(this._fireCounts.get(r.id)??0)+1;this._fireCounts.set(r.id,n),this._lastFired.set(r.id,e.time),r.maxFires&&n>=r.maxFires&&(r.enabled=!1)}}getFireCount(t){return this._fireCounts.get(t)??0}reset(){this._fireCounts.clear(),this._lastFired.clear();for(const t of this._rules.values())t.enabled=t._initialEnabled??!0}_cooldownOk(t,e){if(!t.cooldownMs)return!0;const i=this._lastFired.get(t.id)??-1/0;return(e-i)*1e3>=t.cooldownMs}_maxFiresOk(t){return t.maxFires?(this._fireCounts.get(t.id)??0)<t.maxFires:!0}}class ft{constructor(){this._balls=new Map,this._circles=new Map}getBalls(){return this._balls}getCircles(){return this._circles}getBall(t){return this._balls.get(t)}getCircle(t){return this._circles.get(t)}apply(t,e,i,s){for(const r of t)switch(r.type){case"SPAWN_BALL":{const n=this._makeBall(r.spec);this._balls.set(n.id,n),e.enqueue({id:b(),type:"BALL_SPAWN",tick:i,time:s,depth:0,originId:n.id,context:{entities:[n],ball:n}});break}case"REMOVE_BALL":{const n=this._balls.get(r.id);if(!n)break;this._balls.delete(r.id),e.enqueue({id:b(),type:"BALL_REMOVE",tick:i,time:s,depth:0,originId:r.id,context:{entities:[n],ball:n}});break}case"MODIFY_BALL":{const n=this._balls.get(r.id);if(!n)break;this._applyPatch(n,r.patch,r.mode??"override"),r.patch.state&&r.patch.state!==n._prevState&&(e.enqueue({id:b(),type:"ENTITY_STATE_CHANGE",tick:i,time:s,depth:0,originId:r.id,context:{entities:[n],ball:n,fromState:n._prevState??"normal",toState:r.patch.state}}),n._prevState=r.patch.state);break}case"SPAWN_CIRCLE":{const n=this._makeCircle(r.spec);this._circles.set(n.id,n),e.enqueue({id:b(),type:"CIRCLE_SPAWN",tick:i,time:s,depth:0,originId:n.id,context:{entities:[n],circle:n}});break}case"REMOVE_CIRCLE":{const n=this._circles.get(r.id);if(!n)break;this._circles.delete(r.id),e.enqueue({id:b(),type:"CIRCLE_REMOVE",tick:i,time:s,depth:0,originId:r.id,context:{entities:[n],circle:n}});break}case"MODIFY_CIRCLE":{const n=this._circles.get(r.id);n&&this._applyPatch(n,r.patch,r.mode??"override");break}}}_applyPatch(t,e,i){for(const s of Object.keys(e)){const r=t[s],n=e[s];i==="merge-add"?typeof r=="object"&&r!==null&&"x"in r?t[s]={x:r.x+n.x,y:r.y+n.y}:typeof r=="number"?t[s]=r+n:t[s]=n:i==="merge-min"&&typeof r=="number"?t[s]=Math.min(r,n):i==="merge-max"&&typeof r=="number"?t[s]=Math.max(r,n):t[s]=n}}_makeBall(t){return{id:b(),type:"BALL",tags:t.tags??new Set,state:t.state??"normal",_prevState:t.state??"normal",position:{x:t.position.x,y:t.position.y},velocity:{x:t.velocity.x,y:t.velocity.y},radius:t.radius,mass:t.mass,restitution:t.restitution??.95,charge:t.charge??0}}_makeCircle(t){return{id:b(),type:"CIRCLE",tags:t.tags??new Set,center:{x:t.center.x,y:t.center.y},radius:t.radius,rotation:t.rotation??0,rotationSpeed:t.rotationSpeed??0,gaps:t.gaps??[],thickness:t.thickness??4}}ballArray(){return[...this._balls.values()]}circleArray(){return[...this._circles.values()]}reset(){this._balls.clear(),this._circles.clear()}}class mt{constructor(){this._queue=[],this._modifyBatch=new Map}push(t){if(t.type==="MODIFY_BALL"||t.type==="MODIFY_CIRCLE"){const e=`${t.type}::${t.id}`;this._modifyBatch.has(e)||this._modifyBatch.set(e,[]),this._modifyBatch.get(e).push(t);return}this._queue.push(t)}drain(t={}){const e=[];for(const[,s]of this._modifyBatch){const r=s[0],n=this._resolve(s,t);e.push({type:r.type,id:r.id,patch:n,mode:"override",priority:0})}return this._modifyBatch.clear(),[...this._queue.splice(0),...e]}makeChildEvent(t,e){return{...t,id:`${e.id}-c-${Math.random().toString(36).slice(2,7)}`,depth:e.depth+1,originId:e.originId??e.id,parentId:e.id}}_resolve(t,e){const i=new Set(t.flatMap(r=>Object.keys(r.patch))),s={};for(const r of i){const n=e[r]??t[0].mode??"override",o=t.filter(a=>r in a.patch).sort((a,h)=>(a.priority??0)-(h.priority??0)).map(a=>a.patch[r]);s[r]=yt(o,n)}return s}}function yt(l,t){if(l.length===1)return l[0];switch(t){case"override":return l.at(-1);case"merge-add":{const e=l[0];return typeof e=="object"&&e!==null&&"x"in e?l.reduce((i,s)=>({x:i.x+s.x,y:i.y+s.y}),{x:0,y:0}):l.reduce((i,s)=>i+s,0)}case"merge-min":return Math.min(...l);case"merge-max":return Math.max(...l);case"merge-avg":return l.reduce((e,i)=>e+i,0)/l.length;default:return l.at(-1)}}class _t{constructor(t=60){this._cell=t,this._grid=new Map,this._balls=[],this._circles=[]}rebuild(t,e){this._grid.clear(),this._balls=t,this._circles=e;for(const i of t)this._insert(i,i.position);for(const i of e)this._insert(i,i.center)}queryNearby(t,e){const i=new Set,s=this._cellsInRadius(t,e);for(const r of s)for(const n of this._grid.get(r)??[]){const o=n.position??n.center;ht(o,t)<=e&&i.add(n)}return[...i]}queryInsideCircle(t){return this.queryNearby(t.center,t.radius).filter(e=>e.type==="BALL")}queryByTag(t,e=null){return(e?this.queryNearby(e.position,e.radius):[...this._balls,...this._circles]).filter(s=>{var r;return(r=s.tags)==null?void 0:r.has(t)})}queryByState(t){return this._balls.filter(e=>e.state===t)}_insert(t,e){const i=this._key(e);this._grid.has(i)||this._grid.set(i,[]),this._grid.get(i).push(t)}_key({x:t,y:e}){return`${Math.floor(t/this._cell)},${Math.floor(e/this._cell)}`}_cellsInRadius(t,e){const i=[],s=Math.ceil(e/this._cell),r=Math.floor(t.x/this._cell),n=Math.floor(t.y/this._cell);for(let o=-s;o<=s;o++)for(let a=-s;a<=s;a++)i.push(`${r+o},${n+a}`);return i}}class vt{constructor(){this._monitors=new Map,this._prevMetrics=null}register(t){this._monitors.set(t.id,t)}remove(t){this._monitors.delete(t)}reset(){this._monitors.clear(),this._prevMetrics=null}computeAndEmit(t,e,i,s){const r=this._compute(t,i,s),n=this._prevMetrics??{...r};for(const o of this._monitors.values()){let a;try{a=o.check(r,n)}catch(h){console.warn(`[Monitor:${o.id}]`,h);continue}for(const h of a??[])e.enqueue({tick:i,time:s,depth:0,originId:`monitor-${o.id}`,...h})}this._prevMetrics=r}getLastMetrics(){return this._prevMetrics}_compute(t,e,i){const s=t.ballArray(),r=s.map(o=>Math.sqrt(A(o.velocity))),n={};for(const o of s)n[o.state]=(n[o.state]??0)+1;return{ballCount:s.length,totalKineticEnergy:s.reduce((o,a)=>o+.5*a.mass*A(a.velocity),0),avgSpeed:ct(r),maxSpeed:s.length?Math.max(...r):0,ballsPerState:n,dominantState:dt(n)??"normal",totalMass:s.reduce((o,a)=>o+a.mass,0),tick:e,time:i}}}const D=(l=80)=>({id:"overload",check(t,e){return t.ballCount>l&&e.ballCount<=l?[{id:b(),type:"SYSTEM_OVERLOAD",context:{entities:[],ballCount:t.ballCount}}]:[]}}),P=(l=8e3,t=200)=>({id:"energy",check(e,i){const s=[];return e.totalKineticEnergy>l&&i.totalKineticEnergy<=l&&s.push({id:b(),type:"HIGH_ENERGY_STATE",context:{entities:[],energy:e.totalKineticEnergy}}),e.totalKineticEnergy<t&&i.totalKineticEnergy>=t&&s.push({id:b(),type:"LOW_ENERGY_STATE",context:{entities:[],energy:e.totalKineticEnergy}}),s}}),bt=()=>({id:"phase-transition",check(l,t){return l.dominantState!==t.dominantState?[{id:b(),type:"PHASE_TRANSITION",context:{entities:[],fromState:t.dominantState,toState:l.dominantState}}]:[]}});class xt{constructor(t){this.config=t,this.tick=0,this.time=0,this.running=!1,this._frameId=null,this._rng=N(t.seed??42),this.physics=new ut(t.physics),this.bus=new pt,this.rules=new gt,this.entities=new ft,this.commands=new mt,this.spatial=new _t(t.spatialCellSize??60),this.monitors=new vt,this.renderer=null,this.lastMetrics=null}loadPreset(t){this.stop(),this.entities.reset(),this.rules.reset(),this.bus.reset(),this.monitors.reset(),this.tick=0,this.time=0,this._rng=N(t.seed??42),t.physics&&(this.physics.cfg={...this.physics.cfg,...t.physics}),this.entities.apply(t.entities.circles.map(e=>({type:"SPAWN_CIRCLE",spec:e})),this.bus,0,0),this.entities.apply(t.entities.balls.map(e=>({type:"SPAWN_BALL",spec:e})),this.bus,0,0),this.bus.flush(()=>{}),this.rules.register(...t.rules);for(const e of t.monitors??[])this.monitors.register(e)}start(){this.running||(this.running=!0,this._step())}stop(){this.running=!1,this._frameId&&cancelAnimationFrame(this._frameId),this._frameId=null}stepOnce(){this._tick()}_step(){this.running&&(this._tick(),this._frameId=requestAnimationFrame(()=>this._step()))}_tick(){var o;const t=this.physics.cfg,e=t.timeStep*(t.timeScale??1),i=this.entities.ballArray(),s=this.entities.circleArray();this.physics.integrate(i,e),this.spatial.rebuild(i,s),this.physics.detectAndEmit(i,s,this.bus,this.tick,this.time),this.monitors.computeAndEmit(this.entities,this.bus,this.tick,this.time),this.lastMetrics=this.monitors.getLastMetrics(),this.bus.enqueue({id:`tick-${this.tick}`,type:"TIME_TICK",tick:this.tick,time:this.time,depth:0,originId:`tick-${this.tick}`,context:{entities:[]}});const r=this._buildAPI(),n=this.commands;this.bus.flush(a=>this.rules.handle(a,r,n)),this.entities.apply(n.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),this.bus.flush(a=>this.rules.handle(a,r,n)),this.entities.apply(n.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),(o=this.renderer)==null||o.render(this.entities,this.time,this.lastMetrics),this.tick++,this.time+=e}_buildAPI(){const t=this;return{get tick(){return t.tick},get time(){return t.time},get rng(){return t._rng},get entities(){return t.entities},get metrics(){return t.lastMetrics},queryNearby:(e,i)=>t.spatial.queryNearby(e,i),queryInsideCircle:e=>t.spatial.queryInsideCircle(e),queryByTag:(e,i)=>t.spatial.queryByTag(e,i),queryByState:e=>t.spatial.queryByState(e),getBall:e=>t.entities.getBall(e),getCircle:e=>t.entities.getCircle(e),config:t.config}}}class wt{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this._trails=new Map,this.showTrails=!0,this.showMetrics=!0,this.trailLength=18}render(t,e,i){const{ctx:s,canvas:r}=this,n=r.width,o=r.height;s.fillStyle="rgba(10, 10, 20, 0.92)",s.fillRect(0,0,n,o),s.save(),s.translate(n/2,o/2),this._drawCircles(t.getCircles()),this.showTrails&&this._drawTrails(t.getBalls()),this._drawBalls(t.getBalls()),s.restore(),this.showMetrics&&i&&this._drawHUD(i,t,e)}_drawCircles(t){const{ctx:e}=this;for(const i of t.values())this._drawCircleBoundary(i)}_drawCircleBoundary(t){const{ctx:e}=this,i=Math.PI*2,s=.008;e.lineWidth=t.thickness,e.lineCap="round";const r=t.gaps.map(h=>{const d=(h.startAngle%i+i)%i,u=(h.endAngle%i+i)%i;return{s:d,e:u}}),n=h=>{const d=(h%i+i)%i;return r.some(({s:u,e:g})=>u<=g?d>=u&&d<=g:d>=u||d<=g)};let o=!1,a=0;for(let h=0;h<=i+s;h+=s){const d=((h-t.rotation)%i+i)%i,u=n(d);if(!u&&!o&&(a=h,o=!0),(u||h>=i)&&o){const g=e.createLinearGradient(Math.cos(a)*t.radius,Math.sin(a)*t.radius,Math.cos(h)*t.radius,Math.sin(h)*t.radius);g.addColorStop(0,"rgba(148, 163, 184, 0.9)"),g.addColorStop(.5,"rgba(226, 232, 240, 1)"),g.addColorStop(1,"rgba(148, 163, 184, 0.9)"),e.beginPath(),e.arc(t.center.x,t.center.y,t.radius,a,h),e.strokeStyle=g,e.stroke(),o=!1}}for(const h of t.gaps)for(const d of[h.startAngle+t.rotation,h.endAngle+t.rotation]){const u=t.center.x+Math.cos(d)*t.radius,g=t.center.y+Math.sin(d)*t.radius,_=e.createRadialGradient(u,g,0,u,g,12);_.addColorStop(0,"rgba(99, 179, 237, 0.6)"),_.addColorStop(1,"rgba(99, 179, 237, 0)"),e.beginPath(),e.arc(u,g,12,0,Math.PI*2),e.fillStyle=_,e.fill()}}_drawTrails(t){const{ctx:e}=this;for(const i of t.values()){this._trails.has(i.id)||this._trails.set(i.id,[]);const s=this._trails.get(i.id);s.push({x:i.position.x,y:i.position.y}),s.length>this.trailLength&&s.shift()}for(const[i]of this._trails)t.has(i)||this._trails.delete(i);for(const[i,s]of this._trails){if(s.length<2)continue;const r=t.get(i),n=r?this._stateColor(r.state,!0):"100,150,255";for(let o=1;o<s.length;o++){const a=o/s.length*.35;e.beginPath(),e.moveTo(s[o-1].x,s[o-1].y),e.lineTo(s[o].x,s[o].y),e.strokeStyle=`rgba(${n}, ${a})`,e.lineWidth=((r==null?void 0:r.radius)??8)*(o/s.length)*.5,e.stroke()}}}_drawBalls(t){const{ctx:e}=this;for(const i of t.values()){const[s,r,n]=this._stateColorRGB(i.state),o=e.createRadialGradient(i.position.x,i.position.y,0,i.position.x,i.position.y,i.radius*2.5);o.addColorStop(0,`rgba(${s},${r},${n},0.25)`),o.addColorStop(1,`rgba(${s},${r},${n},0)`),e.beginPath(),e.arc(i.position.x,i.position.y,i.radius*2.5,0,Math.PI*2),e.fillStyle=o,e.fill();const a=e.createRadialGradient(i.position.x-i.radius*.3,i.position.y-i.radius*.3,i.radius*.1,i.position.x,i.position.y,i.radius);a.addColorStop(0,`rgba(${Math.min(255,s+60)},${Math.min(255,r+60)},${Math.min(255,n+60)},1)`),a.addColorStop(.6,`rgba(${s},${r},${n},1)`),a.addColorStop(1,`rgba(${Math.max(0,s-40)},${Math.max(0,r-40)},${Math.max(0,n-40)},1)`),e.beginPath(),e.arc(i.position.x,i.position.y,i.radius,0,Math.PI*2),e.fillStyle=a,e.fill(),e.strokeStyle="rgba(255,255,255,0.15)",e.lineWidth=1,e.stroke()}}_stateColorRGB(t){switch(t){case"charged":return[251,191,36];case"decaying":return[239,68,68];case"heavy":return[167,139,250];default:return[96,165,250]}}_stateColor(t,e=!1){const[i,s,r]=this._stateColorRGB(t);return e?`${i},${s},${r}`:`rgb(${i},${s},${r})`}_drawHUD(t,e,i){const{ctx:s,canvas:r}=this,n=[`balls    ${t.ballCount}`,`energy   ${t.totalKineticEnergy.toFixed(0)}`,`t        ${i.toFixed(1)}s`],o=Object.entries(t.ballsPerState);for(const[a,h]of o)h>0&&n.push(`${a.padEnd(8)} ${h}`);s.save(),s.font='11px "Courier New", monospace',s.fillStyle="rgba(148,163,184,0.8)",s.textAlign="left";for(let a=0;a<n.length;a++)s.fillText(n[a],14,20+a*16);s.restore()}resize(t,e){this.canvas.width=t,this.canvas.height=e}}const z=(l=2,t=.7,e=60)=>({id:"spawn-on-escape",triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(i,s,r){const{ball:n,circle:o}=i.context;if(!n||!o)return;if(s.entities.getBalls().size>=e){r.push({type:"REMOVE_BALL",id:n.id});return}r.push({type:"REMOVE_BALL",id:n.id});const a=Math.sqrt(A(n.velocity));for(let h=0;h<l;h++){const d=s.rng()*Math.PI*2,u=a*(.6+s.rng()*.6);r.push({type:"SPAWN_BALL",spec:{position:{x:o.center.x+(s.rng()-.5)*o.radius*.5,y:o.center.y+(s.rng()-.5)*o.radius*.5},velocity:{x:Math.cos(d)*u,y:Math.sin(d)*u},radius:Math.max(5,n.radius*t),mass:n.mass*t**2,restitution:n.restitution,tags:new Set(n.tags),state:"normal"}})}}}),Et=(l=300,t=6)=>({id:"split-on-collision",triggers:["BALL_BALL_COLLISION"],enabled:!0,condition:e=>(e.context.energy??0)>l,action(e,i,s){const{ballA:r,ballB:n}=e.context;for(const o of[r,n])if(!(!o||o.radius<t)){s.push({type:"REMOVE_BALL",id:o.id});for(let a=0;a<2;a++){const h=i.rng()*Math.PI*2,d=Math.sqrt(A(o.velocity))*.75;s.push({type:"SPAWN_BALL",spec:{position:{x:o.position.x+Math.cos(h)*o.radius*.6,y:o.position.y+Math.sin(h)*o.radius*.6},velocity:{x:Math.cos(h)*d,y:Math.sin(h)*d},radius:o.radius*.65,mass:o.mass*.5,restitution:o.restitution,tags:new Set(o.tags),state:"normal"}})}}}}),Ct=(l=150)=>({id:"charge-on-collision",triggers:["BALL_BALL_COLLISION"],enabled:!0,condition:t=>(t.context.energy??0)>l,action(t,e,i){for(const s of[t.context.ballA,t.context.ballB])s&&i.push({type:"MODIFY_BALL",id:s.id,patch:{state:"charged"},mode:"override",priority:0})}}),At=(l=120)=>({id:"charged-emit-energy",triggers:["BALL_WALL_COLLISION"],enabled:!0,condition:t=>{var e;return((e=t.context.ball)==null?void 0:e.state)==="charged"},action(t,e,i){const{ball:s}=t.context;if(!s)return;const r=e.queryNearby(s.position,l).filter(n=>n.type==="BALL"&&n.id!==s.id);for(const n of r){const o=n.position.x-s.position.x,a=n.position.y-s.position.y,h=Math.sqrt(o*o+a*a)||1,d=.8*(1-h/l);i.push({type:"MODIFY_BALL",id:n.id,patch:{velocity:{x:o/h*d,y:a/h*d}},mode:"merge-add",priority:0})}i.push({type:"MODIFY_BALL",id:s.id,patch:{state:"decaying"},mode:"override",priority:0})}}),$t=(l=120)=>({id:"decay-to-normal",triggers:["TIME_TICK"],enabled:!0,action(t,e,i){for(const s of e.entities.getBalls().values())s.state==="decaying"&&(s._decayTick||(s._decayTick=t.tick),t.tick-s._decayTick>l&&(delete s._decayTick,i.push({type:"MODIFY_BALL",id:s.id,patch:{state:"normal"},mode:"override",priority:0})))}}),Lt=(l=.04,t=1.2)=>({id:"grow-gap-on-escape",triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(e,i,s){const{circle:r,gap:n}=e.context;if(!r||!n)return;const o=r.gaps.map(a=>a===n?{startAngle:a.startAngle-Math.min(l,(t-(a.endAngle-a.startAngle))/2),endAngle:a.endAngle+Math.min(l,(t-(a.endAngle-a.startAngle))/2)}:a);s.push({type:"MODIFY_CIRCLE",id:r.id,patch:{gaps:o},mode:"override",priority:0})}}),Mt=(l=8,t=80)=>({id:"shrink-on-overload",triggers:["SYSTEM_OVERLOAD"],enabled:!0,action(e,i,s){for(const[r,n]of i.entities.getCircles())n.radius<=t||s.push({type:"MODIFY_CIRCLE",id:r,patch:{radius:Math.max(t,n.radius-l)},mode:"override",priority:0})}}),St=()=>({id:"remove-on-low-energy",triggers:["LOW_ENERGY_STATE"],enabled:!0,cooldownMs:3e3,action(l,t,e){for(const[s]of t.entities.getBalls())e.push({type:"REMOVE_BALL",id:s});const i=t.entities.circleArray()[0];i&&e.push({type:"SPAWN_BALL",spec:{position:{x:0,y:-i.radius*.4},velocity:{x:4+t.rng()*3,y:2+t.rng()*2},radius:18,mass:1.5,restitution:.95}})}}),kt={name:"The Escapist",description:"Balls multiply on escape. Gap grows. Arena shrinks on overload.",seed:42,physics:{gravity:0,drag:8e-4,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:260,rotationSpeed:.007,gaps:[{startAngle:-.12,endAngle:.12}],thickness:5}],balls:[{position:{x:0,y:-90},velocity:{x:4.5,y:2},radius:16,mass:1,restitution:.97}]},rules:[z(2,.72,60),Lt(.035,1),Mt(10,100)],monitors:[D(55),P(6e3,100)]},It={name:"Chaos Engine",description:"Balls split on high-energy collisions. Charged balls emit pulses.",seed:7,physics:{gravity:0,drag:.001,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.003,gaps:[],thickness:5}],balls:[{position:{x:-60,y:0},velocity:{x:5,y:3},radius:22,mass:2,restitution:.92},{position:{x:60,y:0},velocity:{x:-4,y:-3},radius:20,mass:2,restitution:.92},{position:{x:0,y:-80},velocity:{x:2,y:6},radius:18,mass:1.5,restitution:.92}]},rules:[Et(250,6),Ct(150),At(130),$t(100)],monitors:[D(80),P(9e3,150),bt()]},Ot={name:"Gravity Well",description:"Gravity + two nested circles. Inner escapees populate the outer.",seed:13,physics:{gravity:180,drag:.002,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:150,rotationSpeed:.012,gaps:[{startAngle:Math.PI/2-.15,endAngle:Math.PI/2+.15}],thickness:4},{center:{x:0,y:0},radius:290,rotationSpeed:-.005,gaps:[],thickness:5}],balls:[{position:{x:0,y:-60},velocity:{x:6,y:0},radius:14,mass:1,restitution:.9}]},rules:[z(1,.9,50),St()],monitors:[D(45),P(5e3,80)]},M=[kt,It,Ot],S=document.createElement("canvas");document.body.appendChild(S);const G=()=>{S.width=window.innerWidth,S.height=window.innerHeight};G();window.addEventListener("resize",G);const E=new xt({seed:42,physics:{gravity:0,drag:0,timeStep:1/60,timeScale:1}}),V=new wt(S);E.renderer=V;const $=new B({title:"Simulation"});$.domElement.style.cssText="position:fixed;top:8px;right:8px;z-index:100;";const y={preset:M[0].name,timeScale:1,gravity:0,drag:.001,trails:!0,hud:!0,paused:!1,stepOnce(){y.paused&&E.stepOnce()}},Ft=M.map(l=>l.name);$.add(y,"preset",Ft).name("Preset").onChange(l=>{const t=M.find(e=>e.name===l);t&&T(t)});const R=$.addFolder("Physics");R.add(y,"timeScale",.1,4,.1).name("Time Scale").onChange(l=>{E.physics.cfg.timeScale=l});R.add(y,"gravity",-500,500,10).name("Gravity").onChange(l=>{E.physics.cfg.gravity=l});R.add(y,"drag",0,.02,.001).name("Drag").onChange(l=>{E.physics.cfg.drag=l});const X=$.addFolder("Rendering");X.add(y,"trails").name("Trails").onChange(l=>{V.showTrails=l});X.add(y,"hud").name("HUD").onChange(l=>{V.showMetrics=l});const j=$.addFolder("Playback");j.add(y,"paused").name("Paused").onChange(l=>{l?E.stop():E.start()});j.add(y,"stepOnce").name("Step Once");$.add({reload:()=>T(M.find(l=>l.name===y.preset))},"reload").name("Reload Preset");function T(l){var t,e,i;E.loadPreset(l),y.gravity=((t=l.physics)==null?void 0:t.gravity)??y.gravity,y.drag=((e=l.physics)==null?void 0:e.drag)??y.drag,y.timeScale=((i=l.physics)==null?void 0:i.timeScale)??y.timeScale,E.physics.cfg.timeScale=y.timeScale,$.controllersRecursive().forEach(s=>s.updateDisplay()),E.start()}T(M[0]);
