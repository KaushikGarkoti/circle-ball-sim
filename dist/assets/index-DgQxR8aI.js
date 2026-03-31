(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class ${constructor(t,e,i,n,r="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(n),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),$.nextNameID=$.nextNameID||0,this.$name.id=`lil-gui-name-${++$.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class ht extends ${constructor(t,e,i){super(t,e,i,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function j(o){let t,e;return(t=o.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=o.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=o.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const dt={isPrimitive:!0,match:o=>typeof o=="string",fromHexString:j,toHexString:j},V={isPrimitive:!0,match:o=>typeof o=="number",fromHexString:o=>parseInt(o.substring(1),16),toHexString:o=>"#"+o.toString(16).padStart(6,0)},ut={isPrimitive:!1,match:o=>Array.isArray(o)||ArrayBuffer.isView(o),fromHexString(o,t,e=1){const i=V.fromHexString(o);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([o,t,e],i=1){i=255/i;const n=o*i<<16^t*i<<8^e*i<<0;return V.toHexString(n)}},pt={isPrimitive:!1,match:o=>Object(o)===o,fromHexString(o,t,e=1){const i=V.fromHexString(o);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:o,g:t,b:e},i=1){i=255/i;const n=o*i<<16^t*i<<8^e*i<<0;return V.toHexString(n)}},gt=[dt,V,ut,pt];function mt(o){return gt.find(t=>t.match(o))}class yt extends ${constructor(t,e,i,n){super(t,e,i,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=mt(this.initialValue),this._rgbScale=n,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=j(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Y extends ${constructor(t,e,i){super(t,e,i,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",n=>{n.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class ft extends ${constructor(t,e,i,n,r,s){super(t,e,i,"lil-number"),this._initInput(),this.min(n),this.max(r);const l=s!==void 0;this.step(l?s:this._getImplicitStep(),l),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let u=parseFloat(this.$input.value);isNaN(u)||(this._stepExplicit&&(u=this._snap(u)),this.setValue(this._clamp(u)))},i=u=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+u),this.$input.value=this.getValue())},n=u=>{u.key==="Enter"&&this.$input.blur(),u.code==="ArrowUp"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u))),u.code==="ArrowDown"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u)*-1))},r=u=>{this._inputFocused&&(u.preventDefault(),i(this._step*this._normalizeMouseWheel(u)))};let s=!1,l,a,c,d,h;const p=5,y=u=>{l=u.clientX,a=c=u.clientY,s=!0,d=this.getValue(),h=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",f)},m=u=>{if(s){const x=u.clientX-l,P=u.clientY-a;Math.abs(P)>p?(u.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>p&&f()}if(!s){const x=u.clientY-c;h-=x*this._step*this._arrowKeyMultiplier(u),d+h>this._max?h=this._max-d:d+h<this._min&&(h=this._min-d),this._snapClampSetValue(d+h)}c=u.clientY},f=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",f)},S=()=>{this._inputFocused=!0},g=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",n),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",y),this.$input.addEventListener("focus",S),this.$input.addEventListener("blur",g)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(g,u,x,P,z)=>(g-u)/(x-u)*(z-P)+P,e=g=>{const u=this.$slider.getBoundingClientRect();let x=t(g,u.left,u.right,this._min,this._max);this._snapClampSetValue(x)},i=g=>{this._setDraggingStyle(!0),e(g.clientX),window.addEventListener("mousemove",n),window.addEventListener("mouseup",r)},n=g=>{e(g.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",n),window.removeEventListener("mouseup",r)};let s=!1,l,a;const c=g=>{g.preventDefault(),this._setDraggingStyle(!0),e(g.touches[0].clientX),s=!1},d=g=>{g.touches.length>1||(this._hasScrollBar?(l=g.touches[0].clientX,a=g.touches[0].clientY,s=!0):c(g),window.addEventListener("touchmove",h,{passive:!1}),window.addEventListener("touchend",p))},h=g=>{if(s){const u=g.touches[0].clientX-l,x=g.touches[0].clientY-a;Math.abs(u)>Math.abs(x)?c(g):(window.removeEventListener("touchmove",h),window.removeEventListener("touchend",p))}else g.preventDefault(),e(g.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",h),window.removeEventListener("touchend",p)},y=this._callOnFinishChange.bind(this),m=400;let f;const S=g=>{if(Math.abs(g.deltaX)<Math.abs(g.deltaY)&&this._hasScrollBar)return;g.preventDefault();const x=this._normalizeMouseWheel(g)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(f),f=setTimeout(y,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",S,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class xt extends ${constructor(t,e,i,n){super(t,e,i,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(n)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class _t extends ${constructor(t,e,i){super(t,e,i,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",n=>{n.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var vt=`.lil-gui {
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
}`;function bt(o){const t=document.createElement("style");t.innerHTML=o;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let J=!1;class X{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:n,title:r="Controls",closeFolders:s=!1,injectStyles:l=!0,touchStyles:a=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),a&&this.domElement.classList.add("lil-allow-touch-styles"),!J&&l&&(bt(vt),J=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),n&&this.domElement.style.setProperty("--width",n+"px"),this._closeFolders=s}add(t,e,i,n,r){if(Object(i)===i)return new xt(this,t,e,i);const s=t[e];switch(typeof s){case"number":return new ft(this,t,e,i,n,r);case"boolean":return new ht(this,t,e);case"string":return new _t(this,t,e);case"function":return new Y(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,s)}addColor(t,e,i=1){return new yt(this,t,e,i)}addFolder(t){const e=new X({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Y||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Y)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const i=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const n=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=n+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}let wt=0;const b=()=>`e${++wt}`,tt=(o,t)=>({x:o,y:t}),At=(o,t)=>({x:o.x-t.x,y:o.y-t.y}),D=o=>o.x*o.x+o.y*o.y,Et=o=>Math.sqrt(D(o)),Ct=(o,t)=>Et(At(t,o)),St=o=>o.length?o.reduce((t,e)=>t+e,0)/o.length:0,G=(o,t)=>.5*o*D(t),et=o=>{let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},it=(o,t,e)=>{const i=Math.PI*2,n=((o-e)%i+i)%i,r=(t.startAngle%i+i)%i,s=(t.endAngle%i+i)%i;return r<=s?n>=r&&n<=s:n>=r||n<=s},$t=o=>{let t=null,e=-1/0;for(const[i,n]of Object.entries(o))n>e&&(e=n,t=i);return t};class Mt{constructor(t){this.cfg=t}integrate(t,e){const{gravity:i,drag:n}=this.cfg;for(const r of t){r.velocity.y+=i*e;const s=Math.max(0,1-n*e);r.velocity.x*=s,r.velocity.y*=s,r.position.x+=r.velocity.x*e,r.position.y+=r.velocity.y*e}}detectAndEmit(t,e,i,n,r,s=null){this._ballBall(t,i,n,r,s),this._ballCircle(t,e,i,n,r),this._rotateCircles(e)}_ballBall(t,e,i,n,r){const s=new Map;let l=0;for(let a=0;a<t.length;a++)s.set(t[a].id,a),l=Math.max(l,t[a].radius);for(let a=0;a<t.length;a++){const c=t[a],d=r?r.queryNearbyBalls(c.position,c.radius+l):t;for(const h of d){if(h.id===c.id||s.get(h.id)<=a)continue;const y=h.position.x-c.position.x,m=h.position.y-c.position.y,f=Math.sqrt(y*y+m*m),S=c.radius+h.radius;if(f>=S||f===0)continue;const g=y/f,u=m/f,x=(S-f)*.52;c.position.x-=g*x,c.position.y-=u*x,h.position.x+=g*x,h.position.y+=u*x;const P=h.velocity.x-c.velocity.x,z=h.velocity.y-c.velocity.y,Z=P*g+z*u;if(Z>0)continue;const R=-(1+Math.min(c.restitution,h.restitution))*Z/(1/c.mass+1/h.mass);c.velocity.x-=R/c.mass*g,c.velocity.y-=R/c.mass*u,h.velocity.x+=R/h.mass*g,h.velocity.y+=R/h.mass*u;const ct=G(c.mass,c.velocity)+G(h.mass,h.velocity);e.enqueue({id:b(),type:"BALL_BALL_COLLISION",tick:i,time:n,depth:0,originId:`col-${c.id}-${h.id}`,context:{entities:[c,h],ballA:c,ballB:h,energy:ct,impulse:tt(g*R,u*R),position:{x:(c.position.x+h.position.x)/2,y:(c.position.y+h.position.y)/2}}})}}}_ballCircle(t,e,i,n,r){for(const s of t)for(const l of e){const a=s.position.x-l.center.x,c=s.position.y-l.center.y,d=Math.sqrt(a*a+c*c),h=l.radius-s.radius;if(d<h*.99)continue;const p=Math.atan2(c,a);if(l.gaps.some(m=>it(p,m,l.rotation)))d>l.radius-s.radius*.5&&i.enqueue({id:b(),type:"BALL_ESCAPE_CIRCLE",tick:n,time:r,depth:0,originId:`escape-${s.id}`,context:{entities:[s,l],ball:s,circle:l,gap:l.gaps.find(m=>it(p,m,l.rotation)),position:{...s.position},speed:Math.sqrt(D(s.velocity))}});else{const m=a/d,f=c/d,S=s.velocity.x*m+s.velocity.y*f;S>0&&(s.velocity.x-=2*S*m*s.restitution,s.velocity.y-=2*S*f*s.restitution),s.position.x=l.center.x+m*h*.98,s.position.y=l.center.y+f*h*.98,i.enqueue({id:b(),type:"BALL_WALL_COLLISION",tick:n,time:r,depth:0,originId:`wall-${s.id}`,context:{entities:[s,l],ball:s,circle:l,energy:G(s.mass,s.velocity),position:{x:l.center.x+m*l.radius,y:l.center.y+f*l.radius},normal:tt(m,f)}})}}}_rotateCircles(t){for(const e of t)e.rotation=(e.rotation+e.rotationSpeed)%(Math.PI*2)}}class kt{constructor(){this._listeners=new Map,this._queue=[],this.MAX_DEPTH=8,this.MAX_PER_TICK=2e3}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>{var i;return(i=this._listeners.get(t))==null?void 0:i.delete(e)}}enqueue(t){this._queue.push(t)}flush(t){var n,r;const e=this._queue.splice(0);let i=0;for(const s of e){if(++i>this.MAX_PER_TICK){this.enqueue(this._sysEvent(s,"CHAIN_DEPTH_EXCEEDED",{reason:"per-tick limit"}));break}if(s.depth>this.MAX_DEPTH){this.enqueue(this._sysEvent(s,"CHAIN_DEPTH_EXCEEDED",{blockedType:s.type,depth:s.depth}));continue}t(s),(n=this._listeners.get(s.type))==null||n.forEach(l=>l(s)),(r=this._listeners.get("*"))==null||r.forEach(l=>l(s))}}_sysEvent(t,e,i={}){return{id:`sys-${e}-${Date.now()}`,type:e,tick:t.tick,time:t.time,depth:0,originId:t.originId??t.id,context:{entities:[],...i}}}reset(){this._listeners.clear(),this._queue=[]}}class Lt{constructor(){this._rules=new Map,this._fireCounts=new Map,this._lastFired=new Map}register(...t){for(const e of t)this._rules.set(e.id,e)}remove(t){this._rules.delete(t)}enable(t){const e=this._rules.get(t);e&&(e.enabled=!0)}disable(t){const e=this._rules.get(t);e&&(e.enabled=!1)}handle(t,e,i){const n=[...this._rules.values()].filter(r=>r.enabled&&r.triggers.includes(t.type)&&this._cooldownOk(r,e.time)&&this._maxFiresOk(r)&&(!r.condition||r.condition(t,e))).sort((r,s)=>(s.priority??0)-(r.priority??0));for(const r of n){try{r.action(t,e,i)}catch(l){console.warn(`[Rule:${r.id}]`,l)}const s=(this._fireCounts.get(r.id)??0)+1;this._fireCounts.set(r.id,s),this._lastFired.set(r.id,e.time),r.maxFires&&s>=r.maxFires&&(r.enabled=!1)}}getFireCount(t){return this._fireCounts.get(t)??0}reset(){this._fireCounts.clear(),this._lastFired.clear();for(const t of this._rules.values())t.enabled=t._initialEnabled??!0}_cooldownOk(t,e){if(!t.cooldownMs)return!0;const i=this._lastFired.get(t.id)??-1/0;return(e-i)*1e3>=t.cooldownMs}_maxFiresOk(t){return t.maxFires?(this._fireCounts.get(t.id)??0)<t.maxFires:!0}}class It{constructor(){this._balls=new Map,this._circles=new Map}getBalls(){return this._balls}getCircles(){return this._circles}getBall(t){return this._balls.get(t)}getCircle(t){return this._circles.get(t)}apply(t,e,i,n){for(const r of t)switch(r.type){case"SPAWN_BALL":{const s=this._makeBall(r.spec);this._balls.set(s.id,s),e.enqueue({id:b(),type:"BALL_SPAWN",tick:i,time:n,depth:0,originId:s.id,context:{entities:[s],ball:s}});break}case"REMOVE_BALL":{const s=this._balls.get(r.id);if(!s)break;this._balls.delete(r.id),e.enqueue({id:b(),type:"BALL_REMOVE",tick:i,time:n,depth:0,originId:r.id,context:{entities:[s],ball:s}});break}case"MODIFY_BALL":{const s=this._balls.get(r.id);if(!s)break;this._applyPatch(s,r.patch,r.mode??"override"),r.patch.state&&r.patch.state!==s._prevState&&(e.enqueue({id:b(),type:"ENTITY_STATE_CHANGE",tick:i,time:n,depth:0,originId:r.id,context:{entities:[s],ball:s,fromState:s._prevState??"normal",toState:r.patch.state}}),s._prevState=r.patch.state);break}case"SPAWN_CIRCLE":{const s=this._makeCircle(r.spec);this._circles.set(s.id,s),e.enqueue({id:b(),type:"CIRCLE_SPAWN",tick:i,time:n,depth:0,originId:s.id,context:{entities:[s],circle:s}});break}case"REMOVE_CIRCLE":{const s=this._circles.get(r.id);if(!s)break;this._circles.delete(r.id),e.enqueue({id:b(),type:"CIRCLE_REMOVE",tick:i,time:n,depth:0,originId:r.id,context:{entities:[s],circle:s}});break}case"MODIFY_CIRCLE":{const s=this._circles.get(r.id);s&&this._applyPatch(s,r.patch,r.mode??"override");break}}}_applyPatch(t,e,i){for(const n of Object.keys(e)){const r=t[n],s=e[n];i==="merge-add"?typeof r=="object"&&r!==null&&"x"in r?t[n]={x:r.x+s.x,y:r.y+s.y}:typeof r=="number"?t[n]=r+s:t[n]=s:i==="merge-min"&&typeof r=="number"?t[n]=Math.min(r,s):i==="merge-max"&&typeof r=="number"?t[n]=Math.max(r,s):t[n]=s}}_makeBall(t){return{id:b(),type:"BALL",tags:t.tags??new Set,state:t.state??"normal",_prevState:t.state??"normal",position:{x:t.position.x,y:t.position.y},velocity:{x:t.velocity.x,y:t.velocity.y},radius:t.radius,mass:t.mass,restitution:t.restitution??.95,charge:t.charge??0}}_makeCircle(t){return{id:b(),type:"CIRCLE",tags:t.tags??new Set,center:{x:t.center.x,y:t.center.y},radius:t.radius,rotation:t.rotation??0,rotationSpeed:t.rotationSpeed??0,gaps:t.gaps??[],thickness:t.thickness??4}}ballArray(){return[...this._balls.values()]}circleArray(){return[...this._circles.values()]}reset(){this._balls.clear(),this._circles.clear()}}class Ft{constructor(){this._queue=[],this._modifyBatch=new Map}push(t){if(t.type==="MODIFY_BALL"||t.type==="MODIFY_CIRCLE"){const e=`${t.type}::${t.id}`;this._modifyBatch.has(e)||this._modifyBatch.set(e,[]),this._modifyBatch.get(e).push(t);return}this._queue.push(t)}drain(t={}){const e=[];for(const[,n]of this._modifyBatch){const r=n[0],s=this._resolve(n,t);e.push({type:r.type,id:r.id,patch:s,mode:"override",priority:0})}return this._modifyBatch.clear(),[...this._queue.splice(0),...e]}makeChildEvent(t,e){return{...t,id:`${e.id}-c-${Math.random().toString(36).slice(2,7)}`,depth:e.depth+1,originId:e.originId??e.id,parentId:e.id}}_resolve(t,e){const i=new Set(t.flatMap(r=>Object.keys(r.patch))),n={};for(const r of i){const s=e[r]??t[0].mode??"override",l=t.filter(a=>r in a.patch).sort((a,c)=>(a.priority??0)-(c.priority??0)).map(a=>a.patch[r]);n[r]=Ot(l,s)}return n}}function Ot(o,t){if(o.length===1)return o[0];switch(t){case"override":return o.at(-1);case"merge-add":{const e=o[0];return typeof e=="object"&&e!==null&&"x"in e?o.reduce((i,n)=>({x:i.x+n.x,y:i.y+n.y}),{x:0,y:0}):o.reduce((i,n)=>i+n,0)}case"merge-min":return Math.min(...o);case"merge-max":return Math.max(...o);case"merge-avg":return o.reduce((e,i)=>e+i,0)/o.length;default:return o.at(-1)}}class Bt{constructor(t=60){this._cell=t,this._grid=new Map,this._balls=[],this._circles=[]}rebuild(t,e){this._grid.clear(),this._balls=t,this._circles=e;for(const i of t)this._insert(i,i.position);for(const i of e)this._insert(i,i.center)}queryNearby(t,e){const i=new Set,n=this._cellsInRadius(t,e);for(const r of n)for(const s of this._grid.get(r)??[]){const l=s.position??s.center;Ct(l,t)<=e&&i.add(s)}return[...i]}queryNearbyBalls(t,e){const i=e*e,n=new Set,r=this._cellsInRadius(t,e);for(const s of r)for(const l of this._grid.get(s)??[]){if(l.type!=="BALL")continue;const a=l.position.x-t.x,c=l.position.y-t.y;a*a+c*c<=i&&n.add(l)}return[...n]}queryInsideCircle(t){return this.queryNearby(t.center,t.radius).filter(e=>e.type==="BALL")}queryByTag(t,e=null){return(e?this.queryNearby(e.position,e.radius):[...this._balls,...this._circles]).filter(n=>{var r;return(r=n.tags)==null?void 0:r.has(t)})}queryByState(t){return this._balls.filter(e=>e.state===t)}_insert(t,e){const i=this._key(e);this._grid.has(i)||this._grid.set(i,[]),this._grid.get(i).push(t)}_key({x:t,y:e}){return`${Math.floor(t/this._cell)},${Math.floor(e/this._cell)}`}_cellsInRadius(t,e){const i=[],n=Math.ceil(e/this._cell),r=Math.floor(t.x/this._cell),s=Math.floor(t.y/this._cell);for(let l=-n;l<=n;l++)for(let a=-n;a<=n;a++)i.push(`${r+l},${s+a}`);return i}}class Dt{constructor(){this._monitors=new Map,this._prevMetrics=null}register(t){this._monitors.set(t.id,t)}remove(t){this._monitors.delete(t)}reset(){this._monitors.clear(),this._prevMetrics=null}computeAndEmit(t,e,i,n){const r=this._compute(t,i,n),s=this._prevMetrics??{...r};for(const l of this._monitors.values()){let a;try{a=l.check(r,s)}catch(c){console.warn(`[Monitor:${l.id}]`,c);continue}for(const c of a??[])e.enqueue({tick:i,time:n,depth:0,originId:`monitor-${l.id}`,...c})}this._prevMetrics=r}getLastMetrics(){return this._prevMetrics}_compute(t,e,i){const n=t.ballArray(),r=n.map(l=>Math.sqrt(D(l.velocity))),s={};for(const l of n)s[l.state]=(s[l.state]??0)+1;return{ballCount:n.length,totalKineticEnergy:n.reduce((l,a)=>l+.5*a.mass*D(a.velocity),0),avgSpeed:St(r),maxSpeed:n.length?Math.max(...r):0,ballsPerState:s,dominantState:$t(s)??"normal",totalMass:n.reduce((l,a)=>l+a.mass,0),tick:e,time:i}}}const w=(o=80)=>{const t={id:"overload",cfg:{maxBalls:o},guiSchema:[{key:"maxBalls",label:"Ball Limit",min:10,max:300,step:5}],check(e,i){return e.ballCount>t.cfg.maxBalls&&i.ballCount<=t.cfg.maxBalls?[{id:b(),type:"SYSTEM_OVERLOAD",context:{entities:[],ballCount:e.ballCount}}]:[]}};return t},A=(o=8e3,t=200)=>{const e={id:"energy",cfg:{highThreshold:o,lowThreshold:t},guiSchema:[{key:"highThreshold",label:"High Energy",min:500,max:2e4,step:500},{key:"lowThreshold",label:"Low Energy",min:0,max:1e3,step:10}],check(i,n){const r=[];return i.totalKineticEnergy>e.cfg.highThreshold&&n.totalKineticEnergy<=e.cfg.highThreshold&&r.push({id:b(),type:"HIGH_ENERGY_STATE",context:{entities:[],energy:i.totalKineticEnergy}}),i.totalKineticEnergy<e.cfg.lowThreshold&&n.totalKineticEnergy>=e.cfg.lowThreshold&&r.push({id:b(),type:"LOW_ENERGY_STATE",context:{entities:[],energy:i.totalKineticEnergy}}),r}};return e},M=()=>({id:"phase-transition",cfg:{},guiSchema:[],check(t,e){return t.dominantState!==e.dominantState?[{id:b(),type:"PHASE_TRANSITION",context:{entities:[],fromState:e.dominantState,toState:t.dominantState}}]:[]}});class Pt{constructor(t){this.config=t,this.tick=0,this.time=0,this.running=!1,this._frameId=null,this._rng=et(t.seed??42),this.physics=new Mt(t.physics),this.bus=new kt,this.rules=new Lt,this.entities=new It,this.commands=new Ft,this.spatial=new Bt(t.spatialCellSize??60),this.monitors=new Dt,this.renderer=null,this.lastMetrics=null}loadPreset(t){this.stop(),this.entities.reset(),this.rules.reset(),this.bus.reset(),this.monitors.reset(),this.tick=0,this.time=0,this._rng=et(t.seed??42),t.physics&&(this.physics.cfg={...this.physics.cfg,...t.physics}),this.entities.apply(t.entities.circles.map(e=>({type:"SPAWN_CIRCLE",spec:e})),this.bus,0,0),this.entities.apply(t.entities.balls.map(e=>({type:"SPAWN_BALL",spec:e})),this.bus,0,0),this.bus.flush(()=>{}),this.rules.register(...t.rules);for(const e of t.monitors??[])this.monitors.register(e)}start(){this.running||(this.running=!0,this._step())}stop(){this.running=!1,this._frameId&&cancelAnimationFrame(this._frameId),this._frameId=null}stepOnce(){this._tick()}_step(){this.running&&(this._tick(),this._frameId=requestAnimationFrame(()=>this._step()))}_tick(){var l;const t=this.physics.cfg,e=t.timeStep*(t.timeScale??1),i=this.entities.ballArray(),n=this.entities.circleArray();this.physics.integrate(i,e),this.spatial.rebuild(i,n),this.physics.detectAndEmit(i,n,this.bus,this.tick,this.time,this.spatial),this.monitors.computeAndEmit(this.entities,this.bus,this.tick,this.time),this.lastMetrics=this.monitors.getLastMetrics(),this.bus.enqueue({id:`tick-${this.tick}`,type:"TIME_TICK",tick:this.tick,time:this.time,depth:0,originId:`tick-${this.tick}`,context:{entities:[]}});const r=this._buildAPI(),s=this.commands;this.bus.flush(a=>this.rules.handle(a,r,s)),this.entities.apply(s.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),this.bus.flush(a=>this.rules.handle(a,r,s)),this.entities.apply(s.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),(l=this.renderer)==null||l.render(this.entities,this.time,this.lastMetrics),this.tick++,this.time+=e}_buildAPI(){const t=this;return{get tick(){return t.tick},get time(){return t.time},get rng(){return t._rng},get entities(){return t.entities},get metrics(){return t.lastMetrics},queryNearby:(e,i)=>t.spatial.queryNearby(e,i),queryInsideCircle:e=>t.spatial.queryInsideCircle(e),queryByTag:(e,i)=>t.spatial.queryByTag(e,i),queryByState:e=>t.spatial.queryByState(e),getBall:e=>t.entities.getBall(e),getCircle:e=>t.entities.getCircle(e),config:t.config}}}class Rt{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this._trails=new Map,this.showTrails=!0,this.showMetrics=!0,this.trailLength=18,this.autoQuality=!0,this.trailDisableThreshold=450,this.simpleBallThreshold=700,this.circleDetailThreshold=600}render(t,e,i){const{ctx:n,canvas:r}=this,s=r.width,l=r.height,a=t.getBalls(),c=a.size,d=this.showTrails&&(!this.autoQuality||c<=this.trailDisableThreshold),h=this.autoQuality&&c>this.simpleBallThreshold,p=this.autoQuality&&c>this.circleDetailThreshold;n.fillStyle="rgba(10, 10, 20, 0.92)",n.fillRect(0,0,s,l),n.save(),n.translate(s/2,l/2),this._drawCircles(t.getCircles(),p),d?this._drawTrails(a):this._trails.size&&this._trails.clear(),this._drawBalls(a,h),n.restore(),this.showMetrics&&i&&this._drawHUD(i,t,e)}_drawCircles(t,e=!1){const{ctx:i}=this;for(const n of t.values())this._drawCircleBoundary(n,e)}_drawCircleBoundary(t,e=!1){const{ctx:i}=this,n=Math.PI*2,r=e?.02:.008;i.lineWidth=t.thickness,i.lineCap="round";const s=t.gaps.map(d=>{const h=(d.startAngle%n+n)%n,p=(d.endAngle%n+n)%n;return{s:h,e:p}}),l=d=>{const h=(d%n+n)%n;return s.some(({s:p,e:y})=>p<=y?h>=p&&h<=y:h>=p||h<=y)};let a=!1,c=0;for(let d=0;d<=n+r;d+=r){const h=((d-t.rotation)%n+n)%n,p=l(h);if(!p&&!a&&(c=d,a=!0),(p||d>=n)&&a){const y=i.createLinearGradient(Math.cos(c)*t.radius,Math.sin(c)*t.radius,Math.cos(d)*t.radius,Math.sin(d)*t.radius);y.addColorStop(0,"rgba(148, 163, 184, 0.9)"),y.addColorStop(.5,"rgba(226, 232, 240, 1)"),y.addColorStop(1,"rgba(148, 163, 184, 0.9)"),i.beginPath(),i.arc(t.center.x,t.center.y,t.radius,c,d),i.strokeStyle=y,i.stroke(),a=!1}}for(const d of t.gaps)for(const h of[d.startAngle+t.rotation,d.endAngle+t.rotation]){const p=t.center.x+Math.cos(h)*t.radius,y=t.center.y+Math.sin(h)*t.radius,m=i.createRadialGradient(p,y,0,p,y,12);m.addColorStop(0,"rgba(99, 179, 237, 0.6)"),m.addColorStop(1,"rgba(99, 179, 237, 0)"),i.beginPath(),i.arc(p,y,12,0,Math.PI*2),i.fillStyle=m,i.fill()}}_drawTrails(t){const{ctx:e}=this;for(const i of t.values()){this._trails.has(i.id)||this._trails.set(i.id,[]);const n=this._trails.get(i.id);n.push({x:i.position.x,y:i.position.y}),n.length>this.trailLength&&n.shift()}for(const[i]of this._trails)t.has(i)||this._trails.delete(i);for(const[i,n]of this._trails){if(n.length<2)continue;const r=t.get(i),s=r?this._stateColor(r.state,!0):"100,150,255";for(let l=1;l<n.length;l++){const a=l/n.length*.35;e.beginPath(),e.moveTo(n[l-1].x,n[l-1].y),e.lineTo(n[l].x,n[l].y),e.strokeStyle=`rgba(${s}, ${a})`,e.lineWidth=((r==null?void 0:r.radius)??8)*(l/n.length)*.5,e.stroke()}}}_drawBalls(t,e=!1){const{ctx:i}=this;for(const n of t.values()){const[r,s,l]=this._stateColorRGB(n.state);if(e){i.beginPath(),i.arc(n.position.x,n.position.y,n.radius,0,Math.PI*2),i.fillStyle=`rgb(${r},${s},${l})`,i.fill();continue}const a=i.createRadialGradient(n.position.x,n.position.y,0,n.position.x,n.position.y,n.radius*2.5);a.addColorStop(0,`rgba(${r},${s},${l},0.25)`),a.addColorStop(1,`rgba(${r},${s},${l},0)`),i.beginPath(),i.arc(n.position.x,n.position.y,n.radius*2.5,0,Math.PI*2),i.fillStyle=a,i.fill();const c=i.createRadialGradient(n.position.x-n.radius*.3,n.position.y-n.radius*.3,n.radius*.1,n.position.x,n.position.y,n.radius);c.addColorStop(0,`rgba(${Math.min(255,r+60)},${Math.min(255,s+60)},${Math.min(255,l+60)},1)`),c.addColorStop(.6,`rgba(${r},${s},${l},1)`),c.addColorStop(1,`rgba(${Math.max(0,r-40)},${Math.max(0,s-40)},${Math.max(0,l-40)},1)`),i.beginPath(),i.arc(n.position.x,n.position.y,n.radius,0,Math.PI*2),i.fillStyle=c,i.fill(),i.strokeStyle="rgba(255,255,255,0.15)",i.lineWidth=1,i.stroke()}}_stateColorRGB(t){switch(t){case"charged":return[251,191,36];case"decaying":return[239,68,68];case"heavy":return[167,139,250];default:return[96,165,250]}}_stateColor(t,e=!1){const[i,n,r]=this._stateColorRGB(t);return e?`${i},${n},${r}`:`rgb(${i},${n},${r})`}_drawHUD(t,e,i){const{ctx:n,canvas:r}=this,s=[`balls    ${t.ballCount}`,`energy   ${t.totalKineticEnergy.toFixed(0)}`,`t        ${i.toFixed(1)}s`],l=Object.entries(t.ballsPerState);for(const[a,c]of l)c>0&&s.push(`${a.padEnd(8)} ${c}`);n.save(),n.font='11px "Courier New", monospace',n.fillStyle="rgba(148,163,184,0.8)",n.textAlign="left";for(let a=0;a<s.length;a++)n.fillText(s[a],14,20+a*16);n.restore()}resize(t,e){this.canvas.width=t,this.canvas.height=e}}const k=(o=2,t=.7,e=60)=>{const i={id:"spawn-on-escape",cfg:{count:o,radiusScale:t,maxBalls:e},guiSchema:[{key:"count",label:"Spawn Count",min:1,max:6,step:1},{key:"radiusScale",label:"Radius Scale",min:.3,max:1,step:.01},{key:"maxBalls",label:"Max Balls",min:5,max:5e3,step:5}],triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(n,r,s){const{count:l,radiusScale:a,maxBalls:c}=i.cfg,{ball:d,circle:h}=n.context;if(!d||!h)return;if(r.entities.getBalls().size>=c){s.push({type:"REMOVE_BALL",id:d.id});return}s.push({type:"REMOVE_BALL",id:d.id});const p=Math.sqrt(D(d.velocity));for(let y=0;y<l;y++){const m=r.rng()*Math.PI*2,f=p*(.6+r.rng()*.6);s.push({type:"SPAWN_BALL",spec:{position:{x:h.center.x+(r.rng()-.5)*h.radius*.5,y:h.center.y+(r.rng()-.5)*h.radius*.5},velocity:{x:Math.cos(m)*f,y:Math.sin(m)*f},radius:Math.max(5,d.radius*a),mass:d.mass*a**2,restitution:d.restitution,tags:new Set(d.tags),state:"normal"}})}}};return i},O=(o=300,t=6)=>{const e={id:"split-on-collision",cfg:{energyThreshold:o,minRadius:t},guiSchema:[{key:"energyThreshold",label:"Energy Threshold",min:10,max:1e3,step:10},{key:"minRadius",label:"Min Radius",min:2,max:25,step:1}],triggers:["BALL_BALL_COLLISION"],enabled:!0,condition(i){return(i.context.energy??0)>e.cfg.energyThreshold},action(i,n,r){const{minRadius:s}=e.cfg,{ballA:l,ballB:a}=i.context;for(const c of[l,a])if(!(!c||c.radius<s)){r.push({type:"REMOVE_BALL",id:c.id});for(let d=0;d<2;d++){const h=n.rng()*Math.PI*2,p=Math.sqrt(D(c.velocity))*.75;r.push({type:"SPAWN_BALL",spec:{position:{x:c.position.x+Math.cos(h)*c.radius*.6,y:c.position.y+Math.sin(h)*c.radius*.6},velocity:{x:Math.cos(h)*p,y:Math.sin(h)*p},radius:c.radius*.65,mass:c.mass*.5,restitution:c.restitution,tags:new Set(c.tags),state:"normal"}})}}}};return e},L=(o=150)=>{const t={id:"charge-on-collision",cfg:{energyThreshold:o},guiSchema:[{key:"energyThreshold",label:"Energy Threshold",min:10,max:500,step:10}],triggers:["BALL_BALL_COLLISION"],enabled:!0,condition(e){return(e.context.energy??0)>t.cfg.energyThreshold},action(e,i,n){for(const r of[e.context.ballA,e.context.ballB])r&&n.push({type:"MODIFY_BALL",id:r.id,patch:{state:"charged"},mode:"override",priority:0})}};return t},I=(o=120)=>{const t={id:"charged-emit-energy",cfg:{emitRadius:o},guiSchema:[{key:"emitRadius",label:"Emit Radius",min:20,max:300,step:5}],triggers:["BALL_WALL_COLLISION"],enabled:!0,condition(e){var i;return((i=e.context.ball)==null?void 0:i.state)==="charged"},action(e,i,n){const{emitRadius:r}=t.cfg,{ball:s}=e.context;if(!s)return;const l=i.queryNearby(s.position,r).filter(a=>a.type==="BALL"&&a.id!==s.id);for(const a of l){const c=a.position.x-s.position.x,d=a.position.y-s.position.y,h=Math.sqrt(c*c+d*d)||1,p=.8*(1-h/r);n.push({type:"MODIFY_BALL",id:a.id,patch:{velocity:{x:c/h*p,y:d/h*p}},mode:"merge-add",priority:0})}n.push({type:"MODIFY_BALL",id:s.id,patch:{state:"decaying"},mode:"override",priority:0})}};return t},C=(o=120)=>{const t={id:"decay-to-normal",cfg:{ticksDecaying:o},guiSchema:[{key:"ticksDecaying",label:"Decay Ticks",min:10,max:600,step:10}],triggers:["TIME_TICK"],enabled:!0,action(e,i,n){const{ticksDecaying:r}=t.cfg;for(const s of i.entities.getBalls().values())s.state==="decaying"&&(s._decayTick||(s._decayTick=e.tick),e.tick-s._decayTick>r&&(delete s._decayTick,n.push({type:"MODIFY_BALL",id:s.id,patch:{state:"normal"},mode:"override",priority:0})))}};return t},B=(o=.04,t=1.2)=>{const e={id:"grow-gap-on-escape",cfg:{deltaRad:o,maxGapRad:t},guiSchema:[{key:"deltaRad",label:"Growth/Escape (rad)",min:.005,max:.2,step:.005},{key:"maxGapRad",label:"Max Gap (rad)",min:.1,max:3.14,step:.05}],triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(i,n,r){const{deltaRad:s,maxGapRad:l}=e.cfg,{circle:a,gap:c}=i.context;if(!a||!c)return;const d=a.gaps.map(h=>h===c?{startAngle:h.startAngle-Math.min(s,(l-(h.endAngle-h.startAngle))/2),endAngle:h.endAngle+Math.min(s,(l-(h.endAngle-h.startAngle))/2)}:h);r.push({type:"MODIFY_CIRCLE",id:a.id,patch:{gaps:d},mode:"override",priority:0})}};return e},F=(o=8,t=80)=>{const e={id:"shrink-on-overload",cfg:{shrinkAmount:o,minRadius:t},guiSchema:[{key:"shrinkAmount",label:"Shrink Amount",min:1,max:50,step:1},{key:"minRadius",label:"Min Radius (px)",min:30,max:200,step:5}],triggers:["SYSTEM_OVERLOAD"],enabled:!0,action(i,n,r){const{shrinkAmount:s,minRadius:l}=e.cfg;for(const[a,c]of n.entities.getCircles())c.radius<=l||r.push({type:"MODIFY_CIRCLE",id:a,patch:{radius:Math.max(l,c.radius-s)},mode:"override",priority:0})}};return e},U=(o=3e3)=>({id:"remove-on-low-energy",cfg:{cooldownMs:o},guiSchema:[],triggers:["LOW_ENERGY_STATE"],enabled:!0,get cooldownMs(){return this.cfg.cooldownMs},action(e,i,n){for(const[s]of i.entities.getBalls())n.push({type:"REMOVE_BALL",id:s});const r=i.entities.circleArray()[0];r&&n.push({type:"SPAWN_BALL",spec:{position:{x:0,y:-r.radius*.4},velocity:{x:4+i.rng()*3,y:2+i.rng()*2},radius:18,mass:1.5,restitution:.95}})}}),Tt={name:"The Escapist",description:"Balls multiply on escape. Gap grows. Arena shrinks on overload.",seed:42,physics:{gravity:0,drag:8e-4,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:260,rotationSpeed:.007,gaps:[{startAngle:-.12,endAngle:.12}],thickness:5}],balls:[{position:{x:0,y:-90},velocity:{x:4.5,y:2},radius:16,mass:1,restitution:.97}]},rules:[k(2,.72,60),B(.035,1),F(10,100)],monitors:[w(55),A(6e3,100)]},Vt={name:"Chaos Engine",description:"Balls split on high-energy collisions. Charged balls emit pulses.",seed:7,physics:{gravity:0,drag:.001,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.003,gaps:[],thickness:5}],balls:[{position:{x:-60,y:0},velocity:{x:5,y:3},radius:22,mass:2,restitution:.92},{position:{x:60,y:0},velocity:{x:-4,y:-3},radius:20,mass:2,restitution:.92},{position:{x:0,y:-80},velocity:{x:2,y:6},radius:18,mass:1.5,restitution:.92}]},rules:[O(250,6),L(150),I(130),C(100)],monitors:[w(80),A(9e3,150),M()]},Ht={name:"Gravity Well",description:"Gravity + two nested circles. Inner escapees populate the outer.",seed:13,physics:{gravity:180,drag:.002,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:150,rotationSpeed:.012,gaps:[{startAngle:Math.PI/2-.15,endAngle:Math.PI/2+.15}],thickness:4},{center:{x:0,y:0},radius:290,rotationSpeed:-.005,gaps:[],thickness:5}],balls:[{position:{x:0,y:-60},velocity:{x:6,y:0},radius:14,mass:1,restitution:.9}]},rules:[k(1,.9,50),U()],monitors:[w(45),A(5e3,80)]},qt={name:"Explosive Chaos",description:"High-growth chain reactions with stronger split and escape spawning.",seed:99,physics:{gravity:0,drag:5e-4,timeStep:1/60,timeScale:1.15},entities:{circles:[{center:{x:0,y:0},radius:280,rotationSpeed:.005,gaps:[{startAngle:-.18,endAngle:.18}],thickness:5}],balls:[{position:{x:-80,y:-20},velocity:{x:7.2,y:3.8},radius:20,mass:1.6,restitution:.96},{position:{x:85,y:15},velocity:{x:-6.8,y:-4.2},radius:19,mass:1.5,restitution:.96},{position:{x:0,y:-95},velocity:{x:2.5,y:7.4},radius:18,mass:1.3,restitution:.96}]},rules:[k(3,.78,140),O(170,5),L(120),I(170),C(150),B(.06,1.8),F(6,90)],monitors:[w(120),A(14e3,120),M()]},Nt={name:"Particle Bloom",description:"Swarm bloom with escalating escape-driven multiplication.",seed:111,physics:{gravity:0,drag:6e-4,timeStep:1/60,timeScale:1.1},entities:{circles:[{center:{x:0,y:0},radius:285,rotationSpeed:.008,gaps:[{startAngle:-.14,endAngle:.14}],thickness:5}],balls:[{position:{x:-25,y:-90},velocity:{x:6.8,y:3.2},radius:16,mass:1,restitution:.97}]},rules:[k(4,.74,170),B(.07,2.1),F(7,95)],monitors:[w(145),A(11e3,110)]},zt={name:"Fission Reactor",description:"Collision fission chains with high-energy charged pulses.",seed:222,physics:{gravity:0,drag:4e-4,timeStep:1/60,timeScale:1.2},entities:{circles:[{center:{x:0,y:0},radius:275,rotationSpeed:.004,gaps:[],thickness:5}],balls:[{position:{x:-95,y:0},velocity:{x:8.4,y:1.2},radius:21,mass:1.9,restitution:.95},{position:{x:95,y:0},velocity:{x:-8.1,y:-1.4},radius:21,mass:1.9,restitution:.95},{position:{x:0,y:-70},velocity:{x:.7,y:8.2},radius:18,mass:1.4,restitution:.95}]},rules:[O(130,4),L(90),I(190),C(180),F(6,90)],monitors:[w(150),A(17e3,120),M()]},Yt={name:"Pulse Breather",description:"Expands in bursts, then self-corrects through overload pressure.",seed:333,physics:{gravity:10,drag:.0012,timeStep:1/60,timeScale:1.05},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.006,gaps:[{startAngle:Math.PI-.12,endAngle:Math.PI+.12}],thickness:5}],balls:[{position:{x:-40,y:-95},velocity:{x:6.5,y:4},radius:17,mass:1.1,restitution:.95},{position:{x:45,y:-85},velocity:{x:-6.2,y:3.7},radius:17,mass:1.1,restitution:.95}]},rules:[k(3,.76,150),O(160,5),B(.05,1.7),F(12,105),C(140)],monitors:[w(120),A(9e3,160),M()]},Gt={name:"Singularity Ring",description:"Strong gravity ring with rare escapes and violent rebounds.",seed:444,physics:{gravity:260,drag:.0018,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:250,rotationSpeed:.013,gaps:[{startAngle:-.08,endAngle:.08}],thickness:6}],balls:[{position:{x:-20,y:-70},velocity:{x:9.2,y:.3},radius:15,mass:1,restitution:.97},{position:{x:30,y:-60},velocity:{x:-8.8,y:.9},radius:15,mass:1,restitution:.97}]},rules:[k(2,.82,120),L(110),I(160),C(120),B(.03,1.1),F(8,92)],monitors:[w(95),A(13e3,90),M()]},jt={name:"Entropy Sink",description:"Fast chaotic start that damps into low-energy churn.",seed:555,physics:{gravity:0,drag:.0045,timeStep:1/60,timeScale:1.05},entities:{circles:[{center:{x:0,y:0},radius:280,rotationSpeed:.003,gaps:[{startAngle:Math.PI/2-.1,endAngle:Math.PI/2+.1}],thickness:5}],balls:[{position:{x:-70,y:-20},velocity:{x:7,y:4.2},radius:19,mass:1.5,restitution:.9},{position:{x:70,y:20},velocity:{x:-6.8,y:-4.1},radius:19,mass:1.5,restitution:.9},{position:{x:0,y:-110},velocity:{x:.6,y:7.8},radius:17,mass:1.2,restitution:.9}]},rules:[O(150,5),L(100),I(120),C(70),U(2200)],monitors:[w(120),A(7e3,220),M()]},Xt={name:"Escape Conveyor",description:"Fast rotating gap creates directional escape conveyor streams.",seed:666,physics:{gravity:0,drag:8e-4,timeStep:1/60,timeScale:1.15},entities:{circles:[{center:{x:0,y:0},radius:275,rotationSpeed:.02,gaps:[{startAngle:-.11,endAngle:.11}],thickness:5}],balls:[{position:{x:-35,y:-90},velocity:{x:7.8,y:2.4},radius:16,mass:1,restitution:.96},{position:{x:25,y:-70},velocity:{x:6.9,y:3.4},radius:16,mass:1,restitution:.96}]},rules:[k(3,.75,160),B(.045,1.5),L(105),I(145),C(110),F(8,95)],monitors:[w(130),A(12500,120)]},Ut={name:"Critical Mass",description:"Hovers near overload threshold with unstable population swings.",seed:777,physics:{gravity:0,drag:.001,timeStep:1/60,timeScale:1.1},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.005,gaps:[{startAngle:-.13,endAngle:.13}],thickness:5}],balls:[{position:{x:-80,y:-10},velocity:{x:7.2,y:2.8},radius:18,mass:1.3,restitution:.95},{position:{x:80,y:12},velocity:{x:-7.1,y:-2.6},radius:18,mass:1.3,restitution:.95}]},rules:[k(3,.79,180),O(170,5),L(115),I(150),C(130),F(11,100)],monitors:[w(135),A(12e3,110),M()]},Wt={name:"Aftershock Mode",description:"Collision aftershocks cascade through charged pulse propagation.",seed:888,physics:{gravity:0,drag:7e-4,timeStep:1/60,timeScale:1.2},entities:{circles:[{center:{x:0,y:0},radius:285,rotationSpeed:.004,gaps:[],thickness:5}],balls:[{position:{x:-100,y:0},velocity:{x:8.9,y:0},radius:21,mass:1.8,restitution:.96},{position:{x:100,y:0},velocity:{x:-8.9,y:0},radius:21,mass:1.8,restitution:.96},{position:{x:0,y:-95},velocity:{x:.4,y:8.6},radius:17,mass:1.2,restitution:.96}]},rules:[O(120,4),L(80),I(220),C(170),F(6,92)],monitors:[w(160),A(18e3,120),M()]},Kt={name:"Metastable Twin-Ring",description:"Nested rings transfer escaping balls into congested outer flow.",seed:999,physics:{gravity:120,drag:.0016,timeStep:1/60,timeScale:1.05},entities:{circles:[{center:{x:0,y:0},radius:155,rotationSpeed:.014,gaps:[{startAngle:-.12,endAngle:.12}],thickness:4},{center:{x:0,y:0},radius:300,rotationSpeed:-.006,gaps:[{startAngle:Math.PI-.16,endAngle:Math.PI+.16}],thickness:5}],balls:[{position:{x:0,y:-55},velocity:{x:7.5,y:.9},radius:14,mass:1,restitution:.93},{position:{x:-25,y:-40},velocity:{x:6.3,y:2.4},radius:14,mass:1,restitution:.93}]},rules:[k(2,.86,145),O(180,5),L(120),I(150),C(140),B(.035,1.25),F(9,100)],monitors:[w(125),A(13e3,130),M()]},Qt={name:"Auto-Reset Arena",description:"Cycles from explosive growth into wipe-and-reseed resets.",seed:1234,physics:{gravity:0,drag:.0015,timeStep:1/60,timeScale:1.1},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.007,gaps:[{startAngle:Math.PI/3-.14,endAngle:Math.PI/3+.14}],thickness:5}],balls:[{position:{x:-20,y:-85},velocity:{x:7.3,y:2.8},radius:17,mass:1.2,restitution:.95}]},rules:[k(4,.73,165),O(150,5),L(95),I(170),C(110),B(.05,1.6),U(1800)],monitors:[w(140),A(15e3,260),M()]},H=[Tt,Vt,Ht,qt,Nt,zt,Yt,Gt,jt,Xt,Ut,Wt,Kt,Qt],N=document.createElement("canvas");document.body.appendChild(N);const nt=()=>{N.width=window.innerWidth,N.height=window.innerHeight};nt();window.addEventListener("resize",nt);const _=new Pt({seed:42,physics:{gravity:0,drag:0,timeStep:1/60,timeScale:1}}),W=new Rt(N);_.renderer=W;const E=new X({title:"Simulation"});E.domElement.style.cssText="position:fixed;top:8px;right:8px;z-index:100;";const v={preset:H[0].name,timeScale:1,gravity:0,drag:.001,trails:!0,hud:!0,paused:!1,stepOnce(){v.paused&&_.stepOnce()},reload(){const o=H.find(t=>t.name===v.preset);o&&Q(o)}},Zt=H.map(o=>o.name);E.add(v,"preset",Zt).name("Preset").onChange(o=>{const t=H.find(e=>e.name===o);t&&Q(t)});E.add(v,"reload").name("Reload Preset");const K=E.addFolder("Physics");K.add(v,"timeScale",.1,4,.1).name("Time Scale").onChange(o=>{_.physics.cfg.timeScale=o});K.add(v,"gravity",-500,500,10).name("Gravity").onChange(o=>{_.physics.cfg.gravity=o});K.add(v,"drag",0,.02,.001).name("Drag").onChange(o=>{_.physics.cfg.drag=o});const rt=E.addFolder("Rendering");rt.add(v,"trails").name("Trails").onChange(o=>{W.showTrails=o});rt.add(v,"hud").name("HUD").onChange(o=>{W.showMetrics=o});const ot=E.addFolder("Playback");ot.add(v,"paused").name("Paused").onChange(o=>{o?_.stop():_.start()});ot.add(v,"stepOnce").name("Step Once");const q=180/Math.PI,st=Math.PI/180;let T=[];function lt(o){var t,e;typeof o._speed!="number"&&(o._speed=Math.sqrt((((t=o.velocity)==null?void 0:t.x)??0)**2+(((e=o.velocity)==null?void 0:e.y)??0)**2))}function at(o){var n,r;lt(o);const t=((n=o.velocity)==null?void 0:n.x)??0,e=((r=o.velocity)==null?void 0:r.y)??0,i=Math.sqrt(t*t+e*e);if(i>1e-6){const s=o._speed/i;o.velocity.x=t*s,o.velocity.y=e*s}else o.velocity={x:o._speed,y:0}}function Jt(o){var t;for(const e of((t=o.entities)==null?void 0:t.balls)??[])at(e)}function te(o){var r;T.forEach(s=>s.destroy()),T=[];const t=E.addFolder("Circles");T.push(t),_.entities.circleArray().forEach((s,l)=>{const a=t.addFolder(`Circle ${l+1}`);if(a.add(s,"radius",30,800,1).name("Radius").onChange(c=>{s.radius=c}),a.add(s,"rotationSpeed",-.08,.08,5e-4).name("Rotation Speed").onChange(c=>{s.rotationSpeed=c}),a.add(s,"thickness",1,50,1).name("Thickness").onChange(c=>{s.thickness=c}),Array.isArray(s.gaps)&&s.gaps.length>0){const c=a.addFolder("Gap"),d=s.gaps[0],h={sizeDeg:(d.endAngle-d.startAngle)*q},p={centerDeg:(d.startAngle+d.endAngle)/2*q};c.add(h,"sizeDeg",1,360,1).name("Gap Size °").onChange(y=>{const m=(d.startAngle+d.endAngle)/2,f=y*st/2;d.startAngle=m-f,d.endAngle=m+f,p.centerDeg=(d.startAngle+d.endAngle)/2*q}),c.add(p,"centerDeg",-360,360,1).name("Gap Center °").onChange(y=>{const m=d.endAngle-d.startAngle,f=y*st;d.startAngle=f-m/2,d.endAngle=f+m/2,h.sizeDeg=(d.endAngle-d.startAngle)*q})}});const e=E.addFolder("Ball Templates");T.push(e),(((r=o.entities)==null?void 0:r.balls)??[]).forEach((s,l)=>{lt(s);const a=e.addFolder(`Ball ${l+1}`);a.add(s,"radius",2,80,1).name("Radius"),a.add(s,"mass",.1,20,.1).name("Mass"),a.add(s,"restitution",0,1,.01).name("Restitution"),a.add(s,"_speed",0,40,.1).name("Speed"),a.add({applyToLive:()=>{at(s);const c=_.entities.ballArray().map(d=>({type:"MODIFY_BALL",id:d.id,patch:{radius:s.radius,mass:s.mass,restitution:s.restitution},mode:"override",priority:0}));c.length>0&&_.entities.apply(c,_.bus,_.tick,_.time)}},"applyToLive").name("Apply to Live")});const i=E.addFolder("Rules");T.push(i),(o.rules??[]).filter(s=>Array.isArray(s.guiSchema)&&s.guiSchema.length>0).forEach(s=>{const l=i.addFolder(s.id);l.add(s,"enabled").name("Enabled");for(const a of s.guiSchema)l.add(s.cfg,a.key,a.min,a.max,a.step).name(a.label)});const n=(o.monitors??[]).filter(s=>Array.isArray(s.guiSchema)&&s.guiSchema.length>0);if(n.length>0){const s=E.addFolder("Monitors");T.push(s),n.forEach(l=>{const a=s.addFolder(l.id);for(const c of l.guiSchema)a.add(l.cfg,c.key,c.min,c.max,c.step).name(c.label)})}}function Q(o){var t,e,i;Jt(o),_.loadPreset(o),v.gravity=((t=o.physics)==null?void 0:t.gravity)??0,v.drag=((e=o.physics)==null?void 0:e.drag)??.001,v.timeScale=((i=o.physics)==null?void 0:i.timeScale)??1,_.physics.cfg.timeScale=v.timeScale,E.controllersRecursive().forEach(n=>n.updateDisplay()),te(o),_.start()}Q(H[0]);
