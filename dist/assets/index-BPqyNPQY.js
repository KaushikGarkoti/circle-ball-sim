(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class A{constructor(t,e,i,r,n="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(n),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(r),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),A.nextNameID=A.nextNameID||0,this.$name.id=`lil-gui-name-${++A.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class lt extends A{constructor(t,e,i){super(t,e,i,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function T(l){let t,e;return(t=l.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=l.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=l.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const ot={isPrimitive:!0,match:l=>typeof l=="string",fromHexString:T,toHexString:T},M={isPrimitive:!0,match:l=>typeof l=="number",fromHexString:l=>parseInt(l.substring(1),16),toHexString:l=>"#"+l.toString(16).padStart(6,0)},at={isPrimitive:!1,match:l=>Array.isArray(l)||ArrayBuffer.isView(l),fromHexString(l,t,e=1){const i=M.fromHexString(l);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([l,t,e],i=1){i=255/i;const r=l*i<<16^t*i<<8^e*i<<0;return M.toHexString(r)}},ht={isPrimitive:!1,match:l=>Object(l)===l,fromHexString(l,t,e=1){const i=M.fromHexString(l);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:l,g:t,b:e},i=1){i=255/i;const r=l*i<<16^t*i<<8^e*i<<0;return M.toHexString(r)}},ct=[ot,M,at,ht];function dt(l){return ct.find(t=>t.match(l))}class ut extends A{constructor(t,e,i,r){super(t,e,i,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=dt(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const n=T(this.$text.value);n&&this._setValueFromHexString(n)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class D extends A{constructor(t,e,i){super(t,e,i,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",r=>{r.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class pt extends A{constructor(t,e,i,r,n,s){super(t,e,i,"lil-number"),this._initInput(),this.min(r),this.max(n);const o=s!==void 0;this.step(o?s:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let u=parseFloat(this.$input.value);isNaN(u)||(this._stepExplicit&&(u=this._snap(u)),this.setValue(this._clamp(u)))},i=u=>{const b=parseFloat(this.$input.value);isNaN(b)||(this._snapClampSetValue(b+u),this.$input.value=this.getValue())},r=u=>{u.key==="Enter"&&this.$input.blur(),u.code==="ArrowUp"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u))),u.code==="ArrowDown"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u)*-1))},n=u=>{this._inputFocused&&(u.preventDefault(),i(this._step*this._normalizeMouseWheel(u)))};let s=!1,o,a,h,c,d;const p=5,y=u=>{o=u.clientX,a=h=u.clientY,s=!0,c=this.getValue(),d=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",f)},g=u=>{if(s){const b=u.clientX-o,w=u.clientY-a;Math.abs(w)>p?(u.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(b)>p&&f()}if(!s){const b=u.clientY-h;d-=b*this._step*this._arrowKeyMultiplier(u),c+d>this._max?d=this._max-c:c+d<this._min&&(d=this._min-c),this._snapClampSetValue(c+d)}h=u.clientY},f=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",f)},C=()=>{this._inputFocused=!0},m=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",r),this.$input.addEventListener("wheel",n,{passive:!1}),this.$input.addEventListener("mousedown",y),this.$input.addEventListener("focus",C),this.$input.addEventListener("blur",m)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(m,u,b,w,B)=>(m-u)/(b-u)*(B-w)+w,e=m=>{const u=this.$slider.getBoundingClientRect();let b=t(m,u.left,u.right,this._min,this._max);this._snapClampSetValue(b)},i=m=>{this._setDraggingStyle(!0),e(m.clientX),window.addEventListener("mousemove",r),window.addEventListener("mouseup",n)},r=m=>{e(m.clientX)},n=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",n)};let s=!1,o,a;const h=m=>{m.preventDefault(),this._setDraggingStyle(!0),e(m.touches[0].clientX),s=!1},c=m=>{m.touches.length>1||(this._hasScrollBar?(o=m.touches[0].clientX,a=m.touches[0].clientY,s=!0):h(m),window.addEventListener("touchmove",d,{passive:!1}),window.addEventListener("touchend",p))},d=m=>{if(s){const u=m.touches[0].clientX-o,b=m.touches[0].clientY-a;Math.abs(u)>Math.abs(b)?h(m):(window.removeEventListener("touchmove",d),window.removeEventListener("touchend",p))}else m.preventDefault(),e(m.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",d),window.removeEventListener("touchend",p)},y=this._callOnFinishChange.bind(this),g=400;let f;const C=m=>{if(Math.abs(m.deltaX)<Math.abs(m.deltaY)&&this._hasScrollBar)return;m.preventDefault();const b=this._normalizeMouseWheel(m)*this._step;this._snapClampSetValue(this.getValue()+b),this.$input.value=this.getValue(),clearTimeout(f),f=setTimeout(y,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",c,{passive:!1}),this.$slider.addEventListener("wheel",C,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class gt extends A{constructor(t,e,i,r){super(t,e,i,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class mt extends A{constructor(t,e,i){super(t,e,i,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",r=>{r.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var ft=`.lil-gui {
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
}`;function yt(l){const t=document.createElement("style");t.innerHTML=l;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Y=!1;class P{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:r,title:n="Controls",closeFolders:s=!1,injectStyles:o=!0,touchStyles:a=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(n),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),a&&this.domElement.classList.add("lil-allow-touch-styles"),!Y&&o&&(yt(ft),Y=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty("--width",r+"px"),this._closeFolders=s}add(t,e,i,r,n){if(Object(i)===i)return new gt(this,t,e,i);const s=t[e];switch(typeof s){case"number":return new pt(this,t,e,i,r,n);case"boolean":return new lt(this,t,e);case"string":return new mt(this,t,e);case"function":return new D(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,s)}addColor(t,e,i=1){return new ut(this,t,e,i)}addFolder(t){const e=new P({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof D||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof D)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const i=n=>{n.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const r=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=r+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}let _t=0;const x=()=>`e${++_t}`,z=(l,t)=>({x:l,y:t}),bt=(l,t)=>({x:l.x-t.x,y:l.y-t.y}),$=l=>l.x*l.x+l.y*l.y,vt=l=>Math.sqrt($(l)),xt=(l,t)=>vt(bt(t,l)),wt=l=>l.length?l.reduce((t,e)=>t+e,0)/l.length:0,R=(l,t)=>.5*l*$(t),G=l=>{let t=l>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},X=(l,t,e)=>{const i=Math.PI*2,r=((l-e)%i+i)%i,n=(t.startAngle%i+i)%i,s=(t.endAngle%i+i)%i;return n<=s?r>=n&&r<=s:r>=n||r<=s},Et=l=>{let t=null,e=-1/0;for(const[i,r]of Object.entries(l))r>e&&(e=r,t=i);return t};class At{constructor(t){this.cfg=t}integrate(t,e){const{gravity:i,drag:r}=this.cfg;for(const n of t){n.velocity.y+=i*e;const s=Math.max(0,1-r*e);n.velocity.x*=s,n.velocity.y*=s,n.position.x+=n.velocity.x*e,n.position.y+=n.velocity.y*e}}detectAndEmit(t,e,i,r,n){this._ballBall(t,i,r,n),this._ballCircle(t,e,i,r,n),this._rotateCircles(e)}_ballBall(t,e,i,r){for(let n=0;n<t.length;n++)for(let s=n+1;s<t.length;s++){const o=t[n],a=t[s],h=a.position.x-o.position.x,c=a.position.y-o.position.y,d=Math.sqrt(h*h+c*c),p=o.radius+a.radius;if(d>=p||d===0)continue;const y=h/d,g=c/d,f=(p-d)*.52;o.position.x-=y*f,o.position.y-=g*f,a.position.x+=y*f,a.position.y+=g*f;const C=a.velocity.x-o.velocity.x,m=a.velocity.y-o.velocity.y,u=C*y+m*g;if(u>0)continue;const w=-(1+Math.min(o.restitution,a.restitution))*u/(1/o.mass+1/a.mass);o.velocity.x-=w/o.mass*y,o.velocity.y-=w/o.mass*g,a.velocity.x+=w/a.mass*y,a.velocity.y+=w/a.mass*g;const B=R(o.mass,o.velocity)+R(a.mass,a.velocity);e.enqueue({id:x(),type:"BALL_BALL_COLLISION",tick:i,time:r,depth:0,originId:`col-${o.id}-${a.id}`,context:{entities:[o,a],ballA:o,ballB:a,energy:B,impulse:z(y*w,g*w),position:{x:(o.position.x+a.position.x)/2,y:(o.position.y+a.position.y)/2}}})}}_ballCircle(t,e,i,r,n){for(const s of t)for(const o of e){const a=s.position.x-o.center.x,h=s.position.y-o.center.y,c=Math.sqrt(a*a+h*h),d=o.radius-s.radius;if(c<d*.99)continue;const p=Math.atan2(h,a);if(o.gaps.some(g=>X(p,g,o.rotation)))c>o.radius-s.radius*.5&&i.enqueue({id:x(),type:"BALL_ESCAPE_CIRCLE",tick:r,time:n,depth:0,originId:`escape-${s.id}`,context:{entities:[s,o],ball:s,circle:o,gap:o.gaps.find(g=>X(p,g,o.rotation)),position:{...s.position},speed:Math.sqrt($(s.velocity))}});else{const g=a/c,f=h/c,C=s.velocity.x*g+s.velocity.y*f;C>0&&(s.velocity.x-=2*C*g*s.restitution,s.velocity.y-=2*C*f*s.restitution),s.position.x=o.center.x+g*d*.98,s.position.y=o.center.y+f*d*.98,i.enqueue({id:x(),type:"BALL_WALL_COLLISION",tick:r,time:n,depth:0,originId:`wall-${s.id}`,context:{entities:[s,o],ball:s,circle:o,energy:R(s.mass,s.velocity),position:{x:o.center.x+g*o.radius,y:o.center.y+f*o.radius},normal:z(g,f)}})}}}_rotateCircles(t){for(const e of t)e.rotation=(e.rotation+e.rotationSpeed)%(Math.PI*2)}}class Ct{constructor(){this._listeners=new Map,this._queue=[],this.MAX_DEPTH=8,this.MAX_PER_TICK=2e3}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>{var i;return(i=this._listeners.get(t))==null?void 0:i.delete(e)}}enqueue(t){this._queue.push(t)}flush(t){var r,n;const e=this._queue.splice(0);let i=0;for(const s of e){if(++i>this.MAX_PER_TICK){this.enqueue(this._sysEvent(s,"CHAIN_DEPTH_EXCEEDED",{reason:"per-tick limit"}));break}if(s.depth>this.MAX_DEPTH){this.enqueue(this._sysEvent(s,"CHAIN_DEPTH_EXCEEDED",{blockedType:s.type,depth:s.depth}));continue}t(s),(r=this._listeners.get(s.type))==null||r.forEach(o=>o(s)),(n=this._listeners.get("*"))==null||n.forEach(o=>o(s))}}_sysEvent(t,e,i={}){return{id:`sys-${e}-${Date.now()}`,type:e,tick:t.tick,time:t.time,depth:0,originId:t.originId??t.id,context:{entities:[],...i}}}reset(){this._listeners.clear(),this._queue=[]}}class $t{constructor(){this._rules=new Map,this._fireCounts=new Map,this._lastFired=new Map}register(...t){for(const e of t)this._rules.set(e.id,e)}remove(t){this._rules.delete(t)}enable(t){const e=this._rules.get(t);e&&(e.enabled=!0)}disable(t){const e=this._rules.get(t);e&&(e.enabled=!1)}handle(t,e,i){const r=[...this._rules.values()].filter(n=>n.enabled&&n.triggers.includes(t.type)&&this._cooldownOk(n,e.time)&&this._maxFiresOk(n)&&(!n.condition||n.condition(t,e))).sort((n,s)=>(s.priority??0)-(n.priority??0));for(const n of r){try{n.action(t,e,i)}catch(o){console.warn(`[Rule:${n.id}]`,o)}const s=(this._fireCounts.get(n.id)??0)+1;this._fireCounts.set(n.id,s),this._lastFired.set(n.id,e.time),n.maxFires&&s>=n.maxFires&&(n.enabled=!1)}}getFireCount(t){return this._fireCounts.get(t)??0}reset(){this._fireCounts.clear(),this._lastFired.clear();for(const t of this._rules.values())t.enabled=t._initialEnabled??!0}_cooldownOk(t,e){if(!t.cooldownMs)return!0;const i=this._lastFired.get(t.id)??-1/0;return(e-i)*1e3>=t.cooldownMs}_maxFiresOk(t){return t.maxFires?(this._fireCounts.get(t.id)??0)<t.maxFires:!0}}class St{constructor(){this._balls=new Map,this._circles=new Map}getBalls(){return this._balls}getCircles(){return this._circles}getBall(t){return this._balls.get(t)}getCircle(t){return this._circles.get(t)}apply(t,e,i,r){for(const n of t)switch(n.type){case"SPAWN_BALL":{const s=this._makeBall(n.spec);this._balls.set(s.id,s),e.enqueue({id:x(),type:"BALL_SPAWN",tick:i,time:r,depth:0,originId:s.id,context:{entities:[s],ball:s}});break}case"REMOVE_BALL":{const s=this._balls.get(n.id);if(!s)break;this._balls.delete(n.id),e.enqueue({id:x(),type:"BALL_REMOVE",tick:i,time:r,depth:0,originId:n.id,context:{entities:[s],ball:s}});break}case"MODIFY_BALL":{const s=this._balls.get(n.id);if(!s)break;this._applyPatch(s,n.patch,n.mode??"override"),n.patch.state&&n.patch.state!==s._prevState&&(e.enqueue({id:x(),type:"ENTITY_STATE_CHANGE",tick:i,time:r,depth:0,originId:n.id,context:{entities:[s],ball:s,fromState:s._prevState??"normal",toState:n.patch.state}}),s._prevState=n.patch.state);break}case"SPAWN_CIRCLE":{const s=this._makeCircle(n.spec);this._circles.set(s.id,s),e.enqueue({id:x(),type:"CIRCLE_SPAWN",tick:i,time:r,depth:0,originId:s.id,context:{entities:[s],circle:s}});break}case"REMOVE_CIRCLE":{const s=this._circles.get(n.id);if(!s)break;this._circles.delete(n.id),e.enqueue({id:x(),type:"CIRCLE_REMOVE",tick:i,time:r,depth:0,originId:n.id,context:{entities:[s],circle:s}});break}case"MODIFY_CIRCLE":{const s=this._circles.get(n.id);s&&this._applyPatch(s,n.patch,n.mode??"override");break}}}_applyPatch(t,e,i){for(const r of Object.keys(e)){const n=t[r],s=e[r];i==="merge-add"?typeof n=="object"&&n!==null&&"x"in n?t[r]={x:n.x+s.x,y:n.y+s.y}:typeof n=="number"?t[r]=n+s:t[r]=s:i==="merge-min"&&typeof n=="number"?t[r]=Math.min(n,s):i==="merge-max"&&typeof n=="number"?t[r]=Math.max(n,s):t[r]=s}}_makeBall(t){return{id:x(),type:"BALL",tags:t.tags??new Set,state:t.state??"normal",_prevState:t.state??"normal",position:{x:t.position.x,y:t.position.y},velocity:{x:t.velocity.x,y:t.velocity.y},radius:t.radius,mass:t.mass,restitution:t.restitution??.95,charge:t.charge??0}}_makeCircle(t){return{id:x(),type:"CIRCLE",tags:t.tags??new Set,center:{x:t.center.x,y:t.center.y},radius:t.radius,rotation:t.rotation??0,rotationSpeed:t.rotationSpeed??0,gaps:t.gaps??[],thickness:t.thickness??4}}ballArray(){return[...this._balls.values()]}circleArray(){return[...this._circles.values()]}reset(){this._balls.clear(),this._circles.clear()}}class Mt{constructor(){this._queue=[],this._modifyBatch=new Map}push(t){if(t.type==="MODIFY_BALL"||t.type==="MODIFY_CIRCLE"){const e=`${t.type}::${t.id}`;this._modifyBatch.has(e)||this._modifyBatch.set(e,[]),this._modifyBatch.get(e).push(t);return}this._queue.push(t)}drain(t={}){const e=[];for(const[,r]of this._modifyBatch){const n=r[0],s=this._resolve(r,t);e.push({type:n.type,id:n.id,patch:s,mode:"override",priority:0})}return this._modifyBatch.clear(),[...this._queue.splice(0),...e]}makeChildEvent(t,e){return{...t,id:`${e.id}-c-${Math.random().toString(36).slice(2,7)}`,depth:e.depth+1,originId:e.originId??e.id,parentId:e.id}}_resolve(t,e){const i=new Set(t.flatMap(n=>Object.keys(n.patch))),r={};for(const n of i){const s=e[n]??t[0].mode??"override",o=t.filter(a=>n in a.patch).sort((a,h)=>(a.priority??0)-(h.priority??0)).map(a=>a.patch[n]);r[n]=Lt(o,s)}return r}}function Lt(l,t){if(l.length===1)return l[0];switch(t){case"override":return l.at(-1);case"merge-add":{const e=l[0];return typeof e=="object"&&e!==null&&"x"in e?l.reduce((i,r)=>({x:i.x+r.x,y:i.y+r.y}),{x:0,y:0}):l.reduce((i,r)=>i+r,0)}case"merge-min":return Math.min(...l);case"merge-max":return Math.max(...l);case"merge-avg":return l.reduce((e,i)=>e+i,0)/l.length;default:return l.at(-1)}}class kt{constructor(t=60){this._cell=t,this._grid=new Map,this._balls=[],this._circles=[]}rebuild(t,e){this._grid.clear(),this._balls=t,this._circles=e;for(const i of t)this._insert(i,i.position);for(const i of e)this._insert(i,i.center)}queryNearby(t,e){const i=new Set,r=this._cellsInRadius(t,e);for(const n of r)for(const s of this._grid.get(n)??[]){const o=s.position??s.center;xt(o,t)<=e&&i.add(s)}return[...i]}queryInsideCircle(t){return this.queryNearby(t.center,t.radius).filter(e=>e.type==="BALL")}queryByTag(t,e=null){return(e?this.queryNearby(e.position,e.radius):[...this._balls,...this._circles]).filter(r=>{var n;return(n=r.tags)==null?void 0:n.has(t)})}queryByState(t){return this._balls.filter(e=>e.state===t)}_insert(t,e){const i=this._key(e);this._grid.has(i)||this._grid.set(i,[]),this._grid.get(i).push(t)}_key({x:t,y:e}){return`${Math.floor(t/this._cell)},${Math.floor(e/this._cell)}`}_cellsInRadius(t,e){const i=[],r=Math.ceil(e/this._cell),n=Math.floor(t.x/this._cell),s=Math.floor(t.y/this._cell);for(let o=-r;o<=r;o++)for(let a=-r;a<=r;a++)i.push(`${n+o},${s+a}`);return i}}class Ft{constructor(){this._monitors=new Map,this._prevMetrics=null}register(t){this._monitors.set(t.id,t)}remove(t){this._monitors.delete(t)}reset(){this._monitors.clear(),this._prevMetrics=null}computeAndEmit(t,e,i,r){const n=this._compute(t,i,r),s=this._prevMetrics??{...n};for(const o of this._monitors.values()){let a;try{a=o.check(n,s)}catch(h){console.warn(`[Monitor:${o.id}]`,h);continue}for(const h of a??[])e.enqueue({tick:i,time:r,depth:0,originId:`monitor-${o.id}`,...h})}this._prevMetrics=n}getLastMetrics(){return this._prevMetrics}_compute(t,e,i){const r=t.ballArray(),n=r.map(o=>Math.sqrt($(o.velocity))),s={};for(const o of r)s[o.state]=(s[o.state]??0)+1;return{ballCount:r.length,totalKineticEnergy:r.reduce((o,a)=>o+.5*a.mass*$(a.velocity),0),avgSpeed:wt(n),maxSpeed:r.length?Math.max(...n):0,ballsPerState:s,dominantState:Et(s)??"normal",totalMass:r.reduce((o,a)=>o+a.mass,0),tick:e,time:i}}}const I=(l=80)=>{const t={id:"overload",cfg:{maxBalls:l},guiSchema:[{key:"maxBalls",label:"Ball Limit",min:10,max:300,step:5}],check(e,i){return e.ballCount>t.cfg.maxBalls&&i.ballCount<=t.cfg.maxBalls?[{id:x(),type:"SYSTEM_OVERLOAD",context:{entities:[],ballCount:e.ballCount}}]:[]}};return t},O=(l=8e3,t=200)=>{const e={id:"energy",cfg:{highThreshold:l,lowThreshold:t},guiSchema:[{key:"highThreshold",label:"High Energy",min:500,max:2e4,step:500},{key:"lowThreshold",label:"Low Energy",min:0,max:1e3,step:10}],check(i,r){const n=[];return i.totalKineticEnergy>e.cfg.highThreshold&&r.totalKineticEnergy<=e.cfg.highThreshold&&n.push({id:x(),type:"HIGH_ENERGY_STATE",context:{entities:[],energy:i.totalKineticEnergy}}),i.totalKineticEnergy<e.cfg.lowThreshold&&r.totalKineticEnergy>=e.cfg.lowThreshold&&n.push({id:x(),type:"LOW_ENERGY_STATE",context:{entities:[],energy:i.totalKineticEnergy}}),n}};return e},U=()=>({id:"phase-transition",cfg:{},guiSchema:[],check(t,e){return t.dominantState!==e.dominantState?[{id:x(),type:"PHASE_TRANSITION",context:{entities:[],fromState:e.dominantState,toState:t.dominantState}}]:[]}});class It{constructor(t){this.config=t,this.tick=0,this.time=0,this.running=!1,this._frameId=null,this._rng=G(t.seed??42),this.physics=new At(t.physics),this.bus=new Ct,this.rules=new $t,this.entities=new St,this.commands=new Mt,this.spatial=new kt(t.spatialCellSize??60),this.monitors=new Ft,this.renderer=null,this.lastMetrics=null}loadPreset(t){this.stop(),this.entities.reset(),this.rules.reset(),this.bus.reset(),this.monitors.reset(),this.tick=0,this.time=0,this._rng=G(t.seed??42),t.physics&&(this.physics.cfg={...this.physics.cfg,...t.physics}),this.entities.apply(t.entities.circles.map(e=>({type:"SPAWN_CIRCLE",spec:e})),this.bus,0,0),this.entities.apply(t.entities.balls.map(e=>({type:"SPAWN_BALL",spec:e})),this.bus,0,0),this.bus.flush(()=>{}),this.rules.register(...t.rules);for(const e of t.monitors??[])this.monitors.register(e)}start(){this.running||(this.running=!0,this._step())}stop(){this.running=!1,this._frameId&&cancelAnimationFrame(this._frameId),this._frameId=null}stepOnce(){this._tick()}_step(){this.running&&(this._tick(),this._frameId=requestAnimationFrame(()=>this._step()))}_tick(){var o;const t=this.physics.cfg,e=t.timeStep*(t.timeScale??1),i=this.entities.ballArray(),r=this.entities.circleArray();this.physics.integrate(i,e),this.spatial.rebuild(i,r),this.physics.detectAndEmit(i,r,this.bus,this.tick,this.time),this.monitors.computeAndEmit(this.entities,this.bus,this.tick,this.time),this.lastMetrics=this.monitors.getLastMetrics(),this.bus.enqueue({id:`tick-${this.tick}`,type:"TIME_TICK",tick:this.tick,time:this.time,depth:0,originId:`tick-${this.tick}`,context:{entities:[]}});const n=this._buildAPI(),s=this.commands;this.bus.flush(a=>this.rules.handle(a,n,s)),this.entities.apply(s.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),this.bus.flush(a=>this.rules.handle(a,n,s)),this.entities.apply(s.drain(this.config.fieldResolution??{}),this.bus,this.tick,this.time),(o=this.renderer)==null||o.render(this.entities,this.time,this.lastMetrics),this.tick++,this.time+=e}_buildAPI(){const t=this;return{get tick(){return t.tick},get time(){return t.time},get rng(){return t._rng},get entities(){return t.entities},get metrics(){return t.lastMetrics},queryNearby:(e,i)=>t.spatial.queryNearby(e,i),queryInsideCircle:e=>t.spatial.queryInsideCircle(e),queryByTag:(e,i)=>t.spatial.queryByTag(e,i),queryByState:e=>t.spatial.queryByState(e),getBall:e=>t.entities.getBall(e),getCircle:e=>t.entities.getCircle(e),config:t.config}}}class Ot{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this._trails=new Map,this.showTrails=!0,this.showMetrics=!0,this.trailLength=18}render(t,e,i){const{ctx:r,canvas:n}=this,s=n.width,o=n.height;r.fillStyle="rgba(10, 10, 20, 0.92)",r.fillRect(0,0,s,o),r.save(),r.translate(s/2,o/2),this._drawCircles(t.getCircles()),this.showTrails&&this._drawTrails(t.getBalls()),this._drawBalls(t.getBalls()),r.restore(),this.showMetrics&&i&&this._drawHUD(i,t,e)}_drawCircles(t){const{ctx:e}=this;for(const i of t.values())this._drawCircleBoundary(i)}_drawCircleBoundary(t){const{ctx:e}=this,i=Math.PI*2,r=.008;e.lineWidth=t.thickness,e.lineCap="round";const n=t.gaps.map(h=>{const c=(h.startAngle%i+i)%i,d=(h.endAngle%i+i)%i;return{s:c,e:d}}),s=h=>{const c=(h%i+i)%i;return n.some(({s:d,e:p})=>d<=p?c>=d&&c<=p:c>=d||c<=p)};let o=!1,a=0;for(let h=0;h<=i+r;h+=r){const c=((h-t.rotation)%i+i)%i,d=s(c);if(!d&&!o&&(a=h,o=!0),(d||h>=i)&&o){const p=e.createLinearGradient(Math.cos(a)*t.radius,Math.sin(a)*t.radius,Math.cos(h)*t.radius,Math.sin(h)*t.radius);p.addColorStop(0,"rgba(148, 163, 184, 0.9)"),p.addColorStop(.5,"rgba(226, 232, 240, 1)"),p.addColorStop(1,"rgba(148, 163, 184, 0.9)"),e.beginPath(),e.arc(t.center.x,t.center.y,t.radius,a,h),e.strokeStyle=p,e.stroke(),o=!1}}for(const h of t.gaps)for(const c of[h.startAngle+t.rotation,h.endAngle+t.rotation]){const d=t.center.x+Math.cos(c)*t.radius,p=t.center.y+Math.sin(c)*t.radius,y=e.createRadialGradient(d,p,0,d,p,12);y.addColorStop(0,"rgba(99, 179, 237, 0.6)"),y.addColorStop(1,"rgba(99, 179, 237, 0)"),e.beginPath(),e.arc(d,p,12,0,Math.PI*2),e.fillStyle=y,e.fill()}}_drawTrails(t){const{ctx:e}=this;for(const i of t.values()){this._trails.has(i.id)||this._trails.set(i.id,[]);const r=this._trails.get(i.id);r.push({x:i.position.x,y:i.position.y}),r.length>this.trailLength&&r.shift()}for(const[i]of this._trails)t.has(i)||this._trails.delete(i);for(const[i,r]of this._trails){if(r.length<2)continue;const n=t.get(i),s=n?this._stateColor(n.state,!0):"100,150,255";for(let o=1;o<r.length;o++){const a=o/r.length*.35;e.beginPath(),e.moveTo(r[o-1].x,r[o-1].y),e.lineTo(r[o].x,r[o].y),e.strokeStyle=`rgba(${s}, ${a})`,e.lineWidth=((n==null?void 0:n.radius)??8)*(o/r.length)*.5,e.stroke()}}}_drawBalls(t){const{ctx:e}=this;for(const i of t.values()){const[r,n,s]=this._stateColorRGB(i.state),o=e.createRadialGradient(i.position.x,i.position.y,0,i.position.x,i.position.y,i.radius*2.5);o.addColorStop(0,`rgba(${r},${n},${s},0.25)`),o.addColorStop(1,`rgba(${r},${n},${s},0)`),e.beginPath(),e.arc(i.position.x,i.position.y,i.radius*2.5,0,Math.PI*2),e.fillStyle=o,e.fill();const a=e.createRadialGradient(i.position.x-i.radius*.3,i.position.y-i.radius*.3,i.radius*.1,i.position.x,i.position.y,i.radius);a.addColorStop(0,`rgba(${Math.min(255,r+60)},${Math.min(255,n+60)},${Math.min(255,s+60)},1)`),a.addColorStop(.6,`rgba(${r},${n},${s},1)`),a.addColorStop(1,`rgba(${Math.max(0,r-40)},${Math.max(0,n-40)},${Math.max(0,s-40)},1)`),e.beginPath(),e.arc(i.position.x,i.position.y,i.radius,0,Math.PI*2),e.fillStyle=a,e.fill(),e.strokeStyle="rgba(255,255,255,0.15)",e.lineWidth=1,e.stroke()}}_stateColorRGB(t){switch(t){case"charged":return[251,191,36];case"decaying":return[239,68,68];case"heavy":return[167,139,250];default:return[96,165,250]}}_stateColor(t,e=!1){const[i,r,n]=this._stateColorRGB(t);return e?`${i},${r},${n}`:`rgb(${i},${r},${n})`}_drawHUD(t,e,i){const{ctx:r,canvas:n}=this,s=[`balls    ${t.ballCount}`,`energy   ${t.totalKineticEnergy.toFixed(0)}`,`t        ${i.toFixed(1)}s`],o=Object.entries(t.ballsPerState);for(const[a,h]of o)h>0&&s.push(`${a.padEnd(8)} ${h}`);r.save(),r.font='11px "Courier New", monospace',r.fillStyle="rgba(148,163,184,0.8)",r.textAlign="left";for(let a=0;a<s.length;a++)r.fillText(s[a],14,20+a*16);r.restore()}resize(t,e){this.canvas.width=t,this.canvas.height=e}}const V=(l=2,t=.7,e=60)=>{const i={id:"spawn-on-escape",cfg:{count:l,radiusScale:t,maxBalls:e},guiSchema:[{key:"count",label:"Spawn Count",min:1,max:6,step:1},{key:"radiusScale",label:"Radius Scale",min:.3,max:1,step:.01},{key:"maxBalls",label:"Max Balls",min:5,max:5e3,step:5}],triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(r,n,s){const{count:o,radiusScale:a,maxBalls:h}=i.cfg,{ball:c,circle:d}=r.context;if(!c||!d)return;if(n.entities.getBalls().size>=h){s.push({type:"REMOVE_BALL",id:c.id});return}s.push({type:"REMOVE_BALL",id:c.id});const p=Math.sqrt($(c.velocity));for(let y=0;y<o;y++){const g=n.rng()*Math.PI*2,f=p*(.6+n.rng()*.6);s.push({type:"SPAWN_BALL",spec:{position:{x:d.center.x+(n.rng()-.5)*d.radius*.5,y:d.center.y+(n.rng()-.5)*d.radius*.5},velocity:{x:Math.cos(g)*f,y:Math.sin(g)*f},radius:Math.max(5,c.radius*a),mass:c.mass*a**2,restitution:c.restitution,tags:new Set(c.tags),state:"normal"}})}}};return i},W=(l=300,t=6)=>{const e={id:"split-on-collision",cfg:{energyThreshold:l,minRadius:t},guiSchema:[{key:"energyThreshold",label:"Energy Threshold",min:10,max:1e3,step:10},{key:"minRadius",label:"Min Radius",min:2,max:25,step:1}],triggers:["BALL_BALL_COLLISION"],enabled:!0,condition(i){return(i.context.energy??0)>e.cfg.energyThreshold},action(i,r,n){const{minRadius:s}=e.cfg,{ballA:o,ballB:a}=i.context;for(const h of[o,a])if(!(!h||h.radius<s)){n.push({type:"REMOVE_BALL",id:h.id});for(let c=0;c<2;c++){const d=r.rng()*Math.PI*2,p=Math.sqrt($(h.velocity))*.75;n.push({type:"SPAWN_BALL",spec:{position:{x:h.position.x+Math.cos(d)*h.radius*.6,y:h.position.y+Math.sin(d)*h.radius*.6},velocity:{x:Math.cos(d)*p,y:Math.sin(d)*p},radius:h.radius*.65,mass:h.mass*.5,restitution:h.restitution,tags:new Set(h.tags),state:"normal"}})}}}};return e},K=(l=150)=>{const t={id:"charge-on-collision",cfg:{energyThreshold:l},guiSchema:[{key:"energyThreshold",label:"Energy Threshold",min:10,max:500,step:10}],triggers:["BALL_BALL_COLLISION"],enabled:!0,condition(e){return(e.context.energy??0)>t.cfg.energyThreshold},action(e,i,r){for(const n of[e.context.ballA,e.context.ballB])n&&r.push({type:"MODIFY_BALL",id:n.id,patch:{state:"charged"},mode:"override",priority:0})}};return t},Z=(l=120)=>{const t={id:"charged-emit-energy",cfg:{emitRadius:l},guiSchema:[{key:"emitRadius",label:"Emit Radius",min:20,max:300,step:5}],triggers:["BALL_WALL_COLLISION"],enabled:!0,condition(e){var i;return((i=e.context.ball)==null?void 0:i.state)==="charged"},action(e,i,r){const{emitRadius:n}=t.cfg,{ball:s}=e.context;if(!s)return;const o=i.queryNearby(s.position,n).filter(a=>a.type==="BALL"&&a.id!==s.id);for(const a of o){const h=a.position.x-s.position.x,c=a.position.y-s.position.y,d=Math.sqrt(h*h+c*c)||1,p=.8*(1-d/n);r.push({type:"MODIFY_BALL",id:a.id,patch:{velocity:{x:h/d*p,y:c/d*p}},mode:"merge-add",priority:0})}r.push({type:"MODIFY_BALL",id:s.id,patch:{state:"decaying"},mode:"override",priority:0})}};return t},J=(l=120)=>{const t={id:"decay-to-normal",cfg:{ticksDecaying:l},guiSchema:[{key:"ticksDecaying",label:"Decay Ticks",min:10,max:600,step:10}],triggers:["TIME_TICK"],enabled:!0,action(e,i,r){const{ticksDecaying:n}=t.cfg;for(const s of i.entities.getBalls().values())s.state==="decaying"&&(s._decayTick||(s._decayTick=e.tick),e.tick-s._decayTick>n&&(delete s._decayTick,r.push({type:"MODIFY_BALL",id:s.id,patch:{state:"normal"},mode:"override",priority:0})))}};return t},Q=(l=.04,t=1.2)=>{const e={id:"grow-gap-on-escape",cfg:{deltaRad:l,maxGapRad:t},guiSchema:[{key:"deltaRad",label:"Growth/Escape (rad)",min:.005,max:.2,step:.005},{key:"maxGapRad",label:"Max Gap (rad)",min:.1,max:3.14,step:.05}],triggers:["BALL_ESCAPE_CIRCLE"],enabled:!0,action(i,r,n){const{deltaRad:s,maxGapRad:o}=e.cfg,{circle:a,gap:h}=i.context;if(!a||!h)return;const c=a.gaps.map(d=>d===h?{startAngle:d.startAngle-Math.min(s,(o-(d.endAngle-d.startAngle))/2),endAngle:d.endAngle+Math.min(s,(o-(d.endAngle-d.startAngle))/2)}:d);n.push({type:"MODIFY_CIRCLE",id:a.id,patch:{gaps:c},mode:"override",priority:0})}};return e},tt=(l=8,t=80)=>{const e={id:"shrink-on-overload",cfg:{shrinkAmount:l,minRadius:t},guiSchema:[{key:"shrinkAmount",label:"Shrink Amount",min:1,max:50,step:1},{key:"minRadius",label:"Min Radius (px)",min:30,max:200,step:5}],triggers:["SYSTEM_OVERLOAD"],enabled:!0,action(i,r,n){const{shrinkAmount:s,minRadius:o}=e.cfg;for(const[a,h]of r.entities.getCircles())h.radius<=o||n.push({type:"MODIFY_CIRCLE",id:a,patch:{radius:Math.max(o,h.radius-s)},mode:"override",priority:0})}};return e},Bt=(l=3e3)=>({id:"remove-on-low-energy",cfg:{cooldownMs:l},guiSchema:[],triggers:["LOW_ENERGY_STATE"],enabled:!0,get cooldownMs(){return this.cfg.cooldownMs},action(e,i,r){for(const[s]of i.entities.getBalls())r.push({type:"REMOVE_BALL",id:s});const n=i.entities.circleArray()[0];n&&r.push({type:"SPAWN_BALL",spec:{position:{x:0,y:-n.radius*.4},velocity:{x:4+i.rng()*3,y:2+i.rng()*2},radius:18,mass:1.5,restitution:.95}})}}),Dt={name:"The Escapist",description:"Balls multiply on escape. Gap grows. Arena shrinks on overload.",seed:42,physics:{gravity:0,drag:8e-4,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:260,rotationSpeed:.007,gaps:[{startAngle:-.12,endAngle:.12}],thickness:5}],balls:[{position:{x:0,y:-90},velocity:{x:4.5,y:2},radius:16,mass:1,restitution:.97}]},rules:[V(2,.72,60),Q(.035,1),tt(10,100)],monitors:[I(55),O(6e3,100)]},Rt={name:"Chaos Engine",description:"Balls split on high-energy collisions. Charged balls emit pulses.",seed:7,physics:{gravity:0,drag:.001,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:270,rotationSpeed:.003,gaps:[],thickness:5}],balls:[{position:{x:-60,y:0},velocity:{x:5,y:3},radius:22,mass:2,restitution:.92},{position:{x:60,y:0},velocity:{x:-4,y:-3},radius:20,mass:2,restitution:.92},{position:{x:0,y:-80},velocity:{x:2,y:6},radius:18,mass:1.5,restitution:.92}]},rules:[W(250,6),K(150),Z(130),J(100)],monitors:[I(80),O(9e3,150),U()]},Tt={name:"Gravity Well",description:"Gravity + two nested circles. Inner escapees populate the outer.",seed:13,physics:{gravity:180,drag:.002,timeStep:1/60,timeScale:1},entities:{circles:[{center:{x:0,y:0},radius:150,rotationSpeed:.012,gaps:[{startAngle:Math.PI/2-.15,endAngle:Math.PI/2+.15}],thickness:4},{center:{x:0,y:0},radius:290,rotationSpeed:-.005,gaps:[],thickness:5}],balls:[{position:{x:0,y:-60},velocity:{x:6,y:0},radius:14,mass:1,restitution:.9}]},rules:[V(1,.9,50),Bt()],monitors:[I(45),O(5e3,80)]},Pt={name:"Explosive Chaos",description:"High-growth chain reactions with stronger split and escape spawning.",seed:99,physics:{gravity:0,drag:5e-4,timeStep:1/60,timeScale:1.15},entities:{circles:[{center:{x:0,y:0},radius:280,rotationSpeed:.005,gaps:[{startAngle:-.18,endAngle:.18}],thickness:5}],balls:[{position:{x:-80,y:-20},velocity:{x:7.2,y:3.8},radius:20,mass:1.6,restitution:.96},{position:{x:85,y:15},velocity:{x:-6.8,y:-4.2},radius:19,mass:1.5,restitution:.96},{position:{x:0,y:-95},velocity:{x:2.5,y:7.4},radius:18,mass:1.3,restitution:.96}]},rules:[V(3,.78,140),W(170,5),K(120),Z(170),J(150),Q(.06,1.8),tt(6,90)],monitors:[I(120),O(14e3,120),U()]},L=[Dt,Rt,Tt,Pt],F=document.createElement("canvas");document.body.appendChild(F);const et=()=>{F.width=window.innerWidth,F.height=window.innerHeight};et();window.addEventListener("resize",et);const _=new It({seed:42,physics:{gravity:0,drag:0,timeStep:1/60,timeScale:1}}),H=new Ot(F);_.renderer=H;const E=new P({title:"Simulation"});E.domElement.style.cssText="position:fixed;top:8px;right:8px;z-index:100;";const v={preset:L[0].name,timeScale:1,gravity:0,drag:.001,trails:!0,hud:!0,paused:!1,stepOnce(){v.paused&&_.stepOnce()},reload(){const l=L.find(t=>t.name===v.preset);l&&N(l)}},Vt=L.map(l=>l.name);E.add(v,"preset",Vt).name("Preset").onChange(l=>{const t=L.find(e=>e.name===l);t&&N(t)});E.add(v,"reload").name("Reload Preset");const q=E.addFolder("Physics");q.add(v,"timeScale",.1,4,.1).name("Time Scale").onChange(l=>{_.physics.cfg.timeScale=l});q.add(v,"gravity",-500,500,10).name("Gravity").onChange(l=>{_.physics.cfg.gravity=l});q.add(v,"drag",0,.02,.001).name("Drag").onChange(l=>{_.physics.cfg.drag=l});const it=E.addFolder("Rendering");it.add(v,"trails").name("Trails").onChange(l=>{H.showTrails=l});it.add(v,"hud").name("HUD").onChange(l=>{H.showMetrics=l});const st=E.addFolder("Playback");st.add(v,"paused").name("Paused").onChange(l=>{l?_.stop():_.start()});st.add(v,"stepOnce").name("Step Once");const k=180/Math.PI,j=Math.PI/180;let S=[];function nt(l){var t,e;typeof l._speed!="number"&&(l._speed=Math.sqrt((((t=l.velocity)==null?void 0:t.x)??0)**2+(((e=l.velocity)==null?void 0:e.y)??0)**2))}function rt(l){var r,n;nt(l);const t=((r=l.velocity)==null?void 0:r.x)??0,e=((n=l.velocity)==null?void 0:n.y)??0,i=Math.sqrt(t*t+e*e);if(i>1e-6){const s=l._speed/i;l.velocity.x=t*s,l.velocity.y=e*s}else l.velocity={x:l._speed,y:0}}function Ht(l){var t;for(const e of((t=l.entities)==null?void 0:t.balls)??[])rt(e)}function qt(l){var n;S.forEach(s=>s.destroy()),S=[];const t=E.addFolder("Circles");S.push(t),_.entities.circleArray().forEach((s,o)=>{const a=t.addFolder(`Circle ${o+1}`);if(a.add(s,"radius",30,800,1).name("Radius").onChange(h=>{s.radius=h}),a.add(s,"rotationSpeed",-.08,.08,5e-4).name("Rotation Speed").onChange(h=>{s.rotationSpeed=h}),a.add(s,"thickness",1,50,1).name("Thickness").onChange(h=>{s.thickness=h}),Array.isArray(s.gaps)&&s.gaps.length>0){const h=a.addFolder("Gap"),c=s.gaps[0],d={sizeDeg:(c.endAngle-c.startAngle)*k},p={centerDeg:(c.startAngle+c.endAngle)/2*k};h.add(d,"sizeDeg",1,360,1).name("Gap Size °").onChange(y=>{const g=(c.startAngle+c.endAngle)/2,f=y*j/2;c.startAngle=g-f,c.endAngle=g+f,p.centerDeg=(c.startAngle+c.endAngle)/2*k}),h.add(p,"centerDeg",-360,360,1).name("Gap Center °").onChange(y=>{const g=c.endAngle-c.startAngle,f=y*j;c.startAngle=f-g/2,c.endAngle=f+g/2,d.sizeDeg=(c.endAngle-c.startAngle)*k})}});const e=E.addFolder("Ball Templates");S.push(e),(((n=l.entities)==null?void 0:n.balls)??[]).forEach((s,o)=>{nt(s);const a=e.addFolder(`Ball ${o+1}`);a.add(s,"radius",2,80,1).name("Radius"),a.add(s,"mass",.1,20,.1).name("Mass"),a.add(s,"restitution",0,1,.01).name("Restitution"),a.add(s,"_speed",0,40,.1).name("Speed"),a.add({applyToLive:()=>{rt(s);const h=_.entities.ballArray().map(c=>({type:"MODIFY_BALL",id:c.id,patch:{radius:s.radius,mass:s.mass,restitution:s.restitution},mode:"override",priority:0}));h.length>0&&_.entities.apply(h,_.bus,_.tick,_.time)}},"applyToLive").name("Apply to Live")});const i=E.addFolder("Rules");S.push(i),(l.rules??[]).filter(s=>Array.isArray(s.guiSchema)&&s.guiSchema.length>0).forEach(s=>{const o=i.addFolder(s.id);o.add(s,"enabled").name("Enabled");for(const a of s.guiSchema)o.add(s.cfg,a.key,a.min,a.max,a.step).name(a.label)});const r=(l.monitors??[]).filter(s=>Array.isArray(s.guiSchema)&&s.guiSchema.length>0);if(r.length>0){const s=E.addFolder("Monitors");S.push(s),r.forEach(o=>{const a=s.addFolder(o.id);for(const h of o.guiSchema)a.add(o.cfg,h.key,h.min,h.max,h.step).name(h.label)})}}function N(l){var t,e,i;Ht(l),_.loadPreset(l),v.gravity=((t=l.physics)==null?void 0:t.gravity)??0,v.drag=((e=l.physics)==null?void 0:e.drag)??.001,v.timeScale=((i=l.physics)==null?void 0:i.timeScale)??1,_.physics.cfg.timeScale=v.timeScale,E.controllersRecursive().forEach(r=>r.updateDisplay()),qt(l),_.start()}N(L[0]);
