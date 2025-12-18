import{r as i,j as a,L as C,f as te,u as U,a as $}from"./app-BOG3Veb3.js";import{A as re}from"./ApplicationLogo-BtzcYS88.js";import{K as ae}from"./transition-BmS32Iyx.js";const P=i.createContext(),p=({children:e})=>{const[t,r]=i.useState(!1),s=()=>{r(l=>!l)};return a.jsx(P.Provider,{value:{open:t,setOpen:r,toggleOpen:s},children:a.jsx("div",{className:"relative",children:e})})},se=({children:e})=>{const{open:t,setOpen:r,toggleOpen:s}=i.useContext(P);return a.jsxs(a.Fragment,{children:[a.jsx("div",{onClick:s,children:e}),t&&a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>r(!1)})]})},oe=({align:e="right",width:t="48",contentClasses:r="py-1 bg-white dark:bg-gray-700",children:s})=>{const{open:l,setOpen:n}=i.useContext(P);let o="origin-top";e==="left"?o="ltr:origin-top-left rtl:origin-top-right start-0":e==="right"&&(o="ltr:origin-top-right rtl:origin-top-left end-0");let d="";return t==="48"?d="w-48":d=t,a.jsx(a.Fragment,{children:a.jsx(ae,{show:l,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:a.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${o} ${d}`,onClick:()=>n(!1),children:a.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+r,children:s})})})})},ie=({className:e="",children:t,...r})=>a.jsx(C,{...r,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 "+e,children:t});p.Trigger=se;p.Content=oe;p.Link=ie;function E({active:e=!1,className:t="",children:r,...s}){return a.jsx(C,{...s,className:"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none "+(e?"border-primary-500 dark:border-primary-600 text-gray-900 dark:text-white focus:border-primary-700 ":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ")+t,children:r})}function j({active:e=!1,className:t="",children:r,...s}){return a.jsx(C,{...s,className:`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${e?"border-primary-500 dark:border-primary-600 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 focus:text-primary-800 dark:focus:text-primary-200 focus:bg-primary-100 dark:focus:bg-primary-900 focus:border-primary-700 dark:focus:border-primary-300":"border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600"} text-base font-medium focus:outline-none transition duration-150 ease-in-out ${t}`,children:r})}let ne={data:""},le=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||ne},de=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ce=/\/\*[^]*?\*\/|  +/g,B=/\n+/g,k=(e,t)=>{let r="",s="",l="";for(let n in e){let o=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+o+";":s+=n[1]=="f"?k(o,n):n+"{"+k(o,n[1]=="k"?"":t)+"}":typeof o=="object"?s+=k(o,t?t.replace(/([^,])+/g,d=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,d):d?d+" "+c:c)):n):o!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),l+=k.p?k.p(n,o):n+":"+o+";")}return r+(t&&l?t+"{"+l+"}":l)+s},v={},K=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+K(e[r]);return t}return e},ue=(e,t,r,s,l)=>{let n=K(e),o=v[n]||(v[n]=(c=>{let m=0,h=11;for(;m<c.length;)h=101*h+c.charCodeAt(m++)>>>0;return"go"+h})(n));if(!v[o]){let c=n!==e?e:(m=>{let h,u,f=[{}];for(;h=de.exec(m.replace(ce,""));)h[4]?f.shift():h[3]?(u=h[3].replace(B," ").trim(),f.unshift(f[0][u]=f[0][u]||{})):f[0][h[1]]=h[2].replace(B," ").trim();return f[0]})(e);v[o]=k(l?{["@keyframes "+o]:c}:c,r?"":"."+o)}let d=r&&v.g?v.g:null;return r&&(v.g=v[o]),((c,m,h,u)=>{u?m.data=m.data.replace(u,c):m.data.indexOf(c)===-1&&(m.data=h?c+m.data:m.data+c)})(v[o],t,s,d),o},me=(e,t,r)=>e.reduce((s,l,n)=>{let o=t[n];if(o&&o.call){let d=o(r),c=d&&d.props&&d.props.className||/^go/.test(d)&&d;o=c?"."+c:d&&typeof d=="object"?d.props?"":k(d,""):d===!1?"":d}return s+l+(o??"")},"");function O(e){let t=this||{},r=e.call?e(t.p):e;return ue(r.unshift?r.raw?me(r,[].slice.call(arguments,1),t.p):r.reduce((s,l)=>Object.assign(s,l&&l.call?l(t.p):l),{}):r,le(t.target),t.g,t.o,t.k)}let Y,I,_;O.bind({g:1});let w=O.bind({k:1});function he(e,t,r,s){k.p=t,Y=e,I=r,_=s}function N(e,t){let r=this||{};return function(){let s=arguments;function l(n,o){let d=Object.assign({},n),c=d.className||l.className;r.p=Object.assign({theme:I&&I()},d),r.o=/ *go\d+/.test(c),d.className=O.apply(r,s)+(c?" "+c:"");let m=e;return e[0]&&(m=d.as||e,delete d.as),_&&m[0]&&_(d),Y(m,d)}return t?t(l):l}}var ge=e=>typeof e=="function",L=(e,t)=>ge(e)?e(t):e,fe=(()=>{let e=0;return()=>(++e).toString()})(),q=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),xe=20,S="default",Q=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:s}=t;return Q(e,{type:e.toasts.find(o=>o.id===s.id)?1:0,toast:s});case 3:let{toastId:l}=t;return{...e,toasts:e.toasts.map(o=>o.id===l||l===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+n}))}}},D=[],G={toasts:[],pausedAt:void 0,settings:{toastLimit:xe}},b={},J=(e,t=S)=>{b[t]=Q(b[t]||G,e),D.forEach(([r,s])=>{r===t&&s(b[t])})},X=e=>Object.keys(b).forEach(t=>J(e,t)),pe=e=>Object.keys(b).find(t=>b[t].toasts.some(r=>r.id===e)),T=(e=S)=>t=>{J(t,e)},ye={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},be=(e={},t=S)=>{let[r,s]=i.useState(b[t]||G),l=i.useRef(b[t]);i.useEffect(()=>(l.current!==b[t]&&s(b[t]),D.push([t,s]),()=>{let o=D.findIndex(([d])=>d===t);o>-1&&D.splice(o,1)}),[t]);let n=r.toasts.map(o=>{var d,c,m;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((d=e[o.type])==null?void 0:d.removeDelay)||e?.removeDelay,duration:o.duration||((c=e[o.type])==null?void 0:c.duration)||e?.duration||ye[o.type],style:{...e.style,...(m=e[o.type])==null?void 0:m.style,...o.style}}});return{...r,toasts:n}},ve=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:r?.id||fe()}),M=e=>(t,r)=>{let s=ve(t,e,r);return T(s.toasterId||pe(s.id))({type:2,toast:s}),s.id},g=(e,t)=>M("blank")(e,t);g.error=M("error");g.success=M("success");g.loading=M("loading");g.custom=M("custom");g.dismiss=(e,t)=>{let r={type:3,toastId:e};t?T(t)(r):X(r)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let r={type:4,toastId:e};t?T(t)(r):X(r)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,r)=>{let s=g.loading(t.loading,{...r,...r?.loading});return typeof e=="function"&&(e=e()),e.then(l=>{let n=t.success?L(t.success,l):void 0;return n?g.success(n,{id:s,...r,...r?.success}):g.dismiss(s),l}).catch(l=>{let n=t.error?L(t.error,l):void 0;n?g.error(n,{id:s,...r,...r?.error}):g.dismiss(s)}),e};var we=1e3,je=(e,t="default")=>{let{toasts:r,pausedAt:s}=be(e,t),l=i.useRef(new Map).current,n=i.useCallback((u,f=we)=>{if(l.has(u))return;let x=setTimeout(()=>{l.delete(u),o({type:4,toastId:u})},f);l.set(u,x)},[]);i.useEffect(()=>{if(s)return;let u=Date.now(),f=r.map(x=>{if(x.duration===1/0)return;let R=(x.duration||0)+x.pauseDuration-(u-x.createdAt);if(R<0){x.visible&&g.dismiss(x.id);return}return setTimeout(()=>g.dismiss(x.id,t),R)});return()=>{f.forEach(x=>x&&clearTimeout(x))}},[r,s,t]);let o=i.useCallback(T(t),[t]),d=i.useCallback(()=>{o({type:5,time:Date.now()})},[o]),c=i.useCallback((u,f)=>{o({type:1,toast:{id:u,height:f}})},[o]),m=i.useCallback(()=>{s&&o({type:6,time:Date.now()})},[s,o]),h=i.useCallback((u,f)=>{let{reverseOrder:x=!1,gutter:R=8,defaultPosition:V}=f||{},z=r.filter(y=>(y.position||V)===(u.position||V)&&y.height),ee=z.findIndex(y=>y.id===u.id),H=z.filter((y,Z)=>Z<ee&&y.visible).length;return z.filter(y=>y.visible).slice(...x?[H+1]:[0,H]).reduce((y,Z)=>y+(Z.height||0)+R,0)},[r]);return i.useEffect(()=>{r.forEach(u=>{if(u.dismissed)n(u.id,u.removeDelay);else{let f=l.get(u.id);f&&(clearTimeout(f),l.delete(u.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:c,startPause:d,endPause:m,calculateOffset:h}}},ke=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ne=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ce=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ee=N("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ke} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ne} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ce} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Me=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Re=N("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Me} 1s linear infinite;
`,$e=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ae=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,De=N("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$e} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ae} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Le=N("div")`
  position: absolute;
`,Oe=N("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Te=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ze=N("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Te} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ze=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return t!==void 0?typeof t=="string"?i.createElement(ze,null,t):t:r==="blank"?null:i.createElement(Oe,null,i.createElement(Re,{...s}),r!=="loading"&&i.createElement(Le,null,r==="error"?i.createElement(Ee,{...s}):i.createElement(De,{...s})))},Fe=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ie=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,_e="0%{opacity:0;} 100%{opacity:1;}",Pe="0%{opacity:1;} 100%{opacity:0;}",Se=N("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ve=N("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,He=(e,t)=>{let r=e.includes("top")?1:-1,[s,l]=q()?[_e,Pe]:[Fe(r),Ie(r)];return{animation:t?`${w(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(l)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Be=i.memo(({toast:e,position:t,style:r,children:s})=>{let l=e.height?He(e.position||t||"top-center",e.visible):{opacity:0},n=i.createElement(Ze,{toast:e}),o=i.createElement(Ve,{...e.ariaProps},L(e.message,e));return i.createElement(Se,{className:e.className,style:{...l,...r,...e.style}},typeof s=="function"?s({icon:n,message:o}):i.createElement(i.Fragment,null,n,o))});he(i.createElement);var We=({id:e,className:t,style:r,onHeightUpdate:s,children:l})=>{let n=i.useCallback(o=>{if(o){let d=()=>{let c=o.getBoundingClientRect().height;s(e,c)};d(),new MutationObserver(d).observe(o,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return i.createElement("div",{ref:n,className:t,style:r},l)},Ue=(e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},l=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:q()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...l}},Ke=O`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,A=16,Ye=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:l,toasterId:n,containerStyle:o,containerClassName:d})=>{let{toasts:c,handlers:m}=je(r,n);return i.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:A,left:A,right:A,bottom:A,pointerEvents:"none",...o},className:d,onMouseEnter:m.startPause,onMouseLeave:m.endPause},c.map(h=>{let u=h.position||t,f=m.calculateOffset(h,{reverseOrder:e,gutter:s,defaultPosition:t}),x=Ue(u,f);return i.createElement(We,{id:h.id,key:h.id,onHeightUpdate:m.updateHeight,className:h.visible?Ke:"",style:x},h.type==="custom"?L(h.message,h):l?l(h):i.createElement(Be,{toast:h,position:u}))}))};function qe({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{fillRule:"evenodd",d:"M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z",clipRule:"evenodd"}))}const Qe=i.forwardRef(qe);function Ge({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{fillRule:"evenodd",d:"M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z",clipRule:"evenodd"}),i.createElement("path",{fillRule:"evenodd",d:"M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z",clipRule:"evenodd"}))}const Je=i.forwardRef(Ge);function Xe({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{fillRule:"evenodd",d:"M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z",clipRule:"evenodd"}))}const et=i.forwardRef(Xe);function tt({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{d:"M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"}))}const rt=i.forwardRef(tt);function at({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{d:"M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z"}))}const st=i.forwardRef(at);function ot({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{d:"M15 3.75H9v16.5h6V3.75ZM16.5 20.25h3.375c1.035 0 1.875-.84 1.875-1.875V5.625c0-1.036-.84-1.875-1.875-1.875H16.5v16.5ZM4.125 3.75H7.5v16.5H4.125a1.875 1.875 0 0 1-1.875-1.875V5.625c0-1.036.84-1.875 1.875-1.875Z"}))}const it=i.forwardRef(ot);function W(){const{theme:e,setTheme:t}=te(),r=e==="dark"||e==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches,s=()=>{t(r?"light":"dark")};return a.jsx("button",{onClick:s,className:"p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200","aria-label":"Toggle dark mode",children:r?a.jsx(rt,{className:"h-6 w-6 text-yellow-500"}):a.jsx(et,{className:"h-6 w-6 text-gray-700"})})}function nt({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"}))}const F=i.forwardRef(nt);function lt({title:e,titleId:t,...r},s){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:s,"aria-labelledby":t},r),e?i.createElement("title",{id:t},e):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"}))}const dt=i.forwardRef(lt);function ct(){const{auth:e}=U().props,t=e.notifications;i.useEffect(()=>{const n=setInterval(()=>{$.reload({only:["auth"]})},5e3);return()=>clearInterval(n)},[]);const r=()=>{t.length>0&&$.post(route("notifications.read_all"),{},{preserveScroll:!0})},s=(n,o)=>{n.preventDefault(),$.patch(route("notifications.read_one",o.id),{},{preserveScroll:!0,onSuccess:()=>{$.get(o.data.link)}})},l=n=>{switch(n){case"UserPlusIcon":return a.jsx(st,{className:"h-5 w-5 text-blue-500"});case"ViewColumnsIcon":return a.jsx(it,{className:"h-5 w-5 text-purple-500"});case"ClipboardDocumentCheckIcon":return a.jsx(Je,{className:"h-5 w-5 text-green-500"});case"ArrowPathIcon":return a.jsx(Qe,{className:"h-5 w-5 text-orange-500"});default:return a.jsx(F,{className:"h-5 w-5 text-gray-500"})}};return a.jsxs(p,{children:[a.jsx(p.Trigger,{children:a.jsxs("button",{className:"relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none",children:[a.jsx(F,{className:"h-6 w-6"}),t.length>0&&a.jsx("span",{className:"absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white dark:border-gray-800",children:t.length>9?"9+":t.length})]})}),a.jsxs(p.Content,{width:"w-96",children:[a.jsxs("div",{className:"px-4 py-3 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50",children:[a.jsxs("span",{className:"text-sm font-bold text-gray-700 dark:text-gray-200",children:["Notifications",t.length>0&&a.jsxs("span",{className:"ml-2 text-xs font-normal text-gray-500",children:["(",t.length," unread)"]})]}),t.length>0&&a.jsx("button",{onClick:r,className:"text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline",children:"Mark all read"})]}),a.jsx("div",{className:"max-h-[24rem] overflow-y-auto",children:t.length===0?a.jsxs("div",{className:"px-4 py-8 text-center",children:[a.jsx(F,{className:"h-8 w-8 mx-auto text-gray-300 dark:text-zinc-600 mb-2"}),a.jsx("p",{className:"text-sm text-gray-500 dark:text-gray-400",children:"You're all caught up!"})]}):t.map(n=>a.jsx("a",{href:n.data.link,onClick:o=>s(o,n),className:"block px-4 py-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition border-b border-gray-100 dark:border-zinc-700/50",children:a.jsxs("div",{className:"flex gap-4",children:[a.jsx("div",{className:"flex-shrink-0 mt-1",children:a.jsx("div",{className:"p-2 bg-gray-100 dark:bg-zinc-800 rounded-full",children:l(n.data.icon)})}),a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsx("p",{className:"text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug",children:n.data.message}),a.jsxs("p",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:[new Date(n.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a.jsx("span",{className:"mx-1",children:"•"}),new Date(n.created_at).toLocaleDateString()]})]}),a.jsx("div",{className:"flex-shrink-0 self-center",children:a.jsx("div",{className:"h-2 w-2 bg-primary-500 rounded-full"})})]})},n.id))}),a.jsx(C,{href:route("notifications.index"),className:"block w-full px-4 py-2 text-center text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-700 transition",children:"View all history →"})]})]})}function gt({user:e,header:t,children:r}){const[s,l]=i.useState(!1),{flash:n,auth:o}=U().props;return i.useEffect(()=>{n.success&&g.success(n.success,{position:"bottom-right"}),n.error&&g.error(n.error,{position:"bottom-right"})},[n]),a.jsxs("div",{className:"min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900",children:[a.jsx(Ye,{}),a.jsxs("nav",{className:"bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700",children:[a.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:a.jsxs("div",{className:"flex justify-between h-16",children:[a.jsxs("div",{className:"flex",children:[a.jsx("div",{className:"shrink-0 flex items-center",children:a.jsx(C,{href:"/",children:a.jsx(re,{className:"block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"})})}),a.jsxs("div",{className:"hidden space-x-8 sm:-my-px sm:ms-10 sm:flex",children:[a.jsx(E,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),a.jsx(E,{href:route("notes.index"),active:route().current().startsWith("notes"),children:"Notes"}),a.jsx(E,{href:route("boards.index"),active:route().current().startsWith("boards")||route().current().startsWith("tasks"),children:"Tasks"}),a.jsx(E,{href:route("contacts.index"),active:route().current().startsWith("contacts"),children:"Contacts"}),a.jsx(E,{href:route("activity.index"),active:route().current("activity.index"),children:"Activity"})]})]}),a.jsxs("div",{className:"hidden sm:flex sm:items-center sm:ms-6 gap-2",children:[a.jsx("div",{className:"me-1",children:a.jsx(W,{})}),a.jsxs(C,{href:route("chat.index"),className:"relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition",children:[a.jsx(dt,{className:"h-6 w-6"}),o.unread_chat_count>0&&a.jsx("span",{className:"absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800",children:o.unread_chat_count>9?"9+":o.unread_chat_count})]}),a.jsx("div",{className:"me-1",children:a.jsx(ct,{})}),a.jsx("div",{className:"ms-3 relative",children:a.jsxs(p,{children:[a.jsx(p.Trigger,{children:a.jsx("span",{className:"inline-flex rounded-md",children:a.jsxs("button",{type:"button",className:"inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150",children:[a.jsx("div",{className:"me-2 h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600",children:e.avatar?a.jsx("img",{src:`/storage/${e.avatar}`,alt:e.name,className:"h-full w-full object-cover"}):e.name.charAt(0)}),e.name,a.jsx("svg",{className:"ms-2 -me-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:a.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),a.jsxs(p.Content,{children:[a.jsx(p.Link,{href:route("profile.edit"),children:"Profile"}),a.jsx(p.Link,{href:route("logout"),method:"post",as:"button",children:"Log Out"})]})]})})]}),a.jsx("div",{className:"-me-2 flex items-center sm:hidden",children:a.jsx("button",{onClick:()=>l(d=>!d),className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none transition duration-150 ease-in-out",children:a.jsxs("svg",{className:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[a.jsx("path",{className:s?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),a.jsx("path",{className:s?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),a.jsxs("div",{className:(s?"block":"hidden")+" sm:hidden",children:[a.jsxs("div",{className:"pt-2 pb-3 space-y-1",children:[a.jsx(j,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),a.jsx(j,{href:route("notes.index"),active:route().current().startsWith("notes"),children:"Notes"}),a.jsx(j,{href:route("boards.index"),active:route().current().startsWith("boards"),children:"Tasks"}),a.jsx(j,{href:route("chat.index"),active:route().current().startsWith("chat"),children:"Chat"}),a.jsx(j,{href:route("contacts.index"),active:route().current().startsWith("contacts"),children:"Contacts"}),a.jsx(j,{href:route("activity.index"),active:route().current("activity.index"),children:"Activity"})]}),a.jsxs("div",{className:"pt-4 pb-1 border-t border-gray-200 dark:border-gray-600",children:[a.jsxs("div",{className:"flex justify-between items-center px-4",children:[a.jsxs("div",{children:[a.jsx("div",{className:"font-medium text-base text-gray-800 dark:text-gray-200",children:e.name}),a.jsx("div",{className:"font-medium text-sm text-gray-500",children:e.email})]}),a.jsx(W,{})]}),a.jsxs("div",{className:"mt-3 space-y-1",children:[a.jsx(j,{href:route("profile.edit"),children:"Profile"}),a.jsx(j,{method:"post",href:route("logout"),as:"button",children:"Log Out"})]})]})]})]}),t&&a.jsx("header",{className:"bg-white dark:bg-zinc-800 shadow-sm flex-shrink-0",children:a.jsx("div",{className:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",children:t})}),a.jsx("main",{className:"flex-1 flex flex-col overflow-hidden",children:r})]})}export{gt as A,F,Qe as a,Je as b,it as c,st as d};
