var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode&&t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function f(){return u(" ")}function d(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function p(t,e){e=""+e,t.data!==e&&(t.data=e)}function h(t,e){t.value=null==e?"":e}let b;function g(t){b=t}const $=[],y=[];let x=[];const N=[],v=Promise.resolve();let _=!1;function k(t){x.push(t)}const C=new Set;let w=0;function E(){if(0!==w)return;const t=b;do{try{for(;w<$.length;){const t=$[w];w++,g(t),S(t.$$)}}catch(t){throw $.length=0,w=0,t}for(g(null),$.length=0,w=0;y.length;)y.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];C.has(e)||(C.add(e),e())}x.length=0}while($.length);for(;N.length;)N.pop()();_=!1,C.clear(),g(t)}function S(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(k)}}const M=new Set;function O(t,e){t&&t.i&&(M.delete(t),t.i(e))}function L(t,e){t.d(1),e.delete(t.key)}function I(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];x.forEach((r=>-1===t.indexOf(r)?e.push(r):n.push(r))),n.forEach((t=>t())),x=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function q(t,e){-1===t.$$.dirty[0]&&($.push(t),_||(_=!0,v.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function A(s,c,a,l,u,f,d,m=[-1]){const p=b;g(s);const h=s.$$={fragment:null,ctx:[],props:f,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(c.context||(p?p.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:c.target||p.$$.root};d&&d(h.root);let $=!1;if(h.ctx=a?a(s,c.props||{},((t,e,...n)=>{const r=n.length?n[0]:e;return h.ctx&&u(h.ctx[t],h.ctx[t]=r)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](r),$&&q(s,t)),e})):[],h.update(),$=!0,r(h.before_update),h.fragment=!!l&&l(h.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);h.fragment&&h.fragment.l(t),t.forEach(i)}else h.fragment&&h.fragment.c();c.intro&&O(s.$$.fragment),function(t,n,s,c){const{fragment:a,after_update:i}=t.$$;a&&a.m(n,s),c||k((()=>{const n=t.$$.on_mount.map(e).filter(o);t.$$.on_destroy?t.$$.on_destroy.push(...n):r(n),t.$$.on_mount=[]})),i.forEach(k)}(s,c.target,c.anchor,c.customElement),E()}g(p)}class j{$destroy(){I(this,1),this.$destroy=t}$on(e,n){if(!o(n))return t;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const t=r.indexOf(n);-1!==t&&r.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function D(t,e,n){const r=t.slice();return r[16]=e[n],r[18]=n,r}function J(t){let e,n,o,s,c;function u(){return t[14](t[18])}function p(){return t[15](t[18])}return{c(){e=l("button"),e.textContent="Edit",n=f(),o=l("button"),o.textContent="Delete",m(e,"class","btn btn-warning btn-sm"),m(o,"class","btn btn-danger btn-sm")},m(t,r){a(t,e,r),a(t,n,r),a(t,o,r),s||(c=[d(e,"click",u),d(o,"click",p)],s=!0)},p(e,n){t=e},d(t){t&&i(e),t&&i(n),t&&i(o),s=!1,r(c)}}}function T(e){let n,o,s,c,u;return{c(){n=l("button"),n.textContent="Save",o=f(),s=l("button"),s.textContent="Cancel",m(n,"class","btn btn-success btn-sm"),m(s,"class","btn btn-secondary btn-sm")},m(t,r){a(t,n,r),a(t,o,r),a(t,s,r),c||(u=[d(n,"click",e[12]),d(s,"click",e[13])],c=!0)},p:t,d(t){t&&i(n),t&&i(o),t&&i(s),c=!1,r(u)}}}function G(t,e){let n,r,o,s,d,m,h,b,g=e[16].firstName+"",$=e[16].lastName+"",y=e[16].idCardNumber+"";function x(t,e){return t[18]===t[4]?T:J}let N=x(e),v=N(e);return{key:t,first:null,c(){n=l("li"),r=u(g),o=f(),s=u($),d=u(" ("),m=u(y),h=u(")\n\t\t\t"),v.c(),b=f(),this.first=n},m(t,e){a(t,n,e),c(n,r),c(n,o),c(n,s),c(n,d),c(n,m),c(n,h),v.m(n,null),c(n,b)},p(t,o){e=t,1&o&&g!==(g=e[16].firstName+"")&&p(r,g),1&o&&$!==($=e[16].lastName+"")&&p(s,$),1&o&&y!==(y=e[16].idCardNumber+"")&&p(m,y),N===(N=x(e))&&v?v.p(e,o):(v.d(1),v=N(e),v&&(v.c(),v.m(n,b)))},d(t){t&&i(n),v.d()}}}function H(e){let n,o,s,u,p,b,g,$,y,x,N,v,_,k,C,w,E,S,M,I,q,A,j,J,T,H,P,R,B,F=[],z=new Map,K=e[0];const Q=t=>t[16].idCardNumber;for(let t=0;t<K.length;t+=1){let n=D(e,K,t),r=Q(n);z.set(r,F[t]=G(r,n))}return{c(){n=l("main"),o=l("div"),s=l("div"),s.innerHTML='<h1 class="card-title text-center">Guest Registration</h1>',u=f(),p=l("div"),b=l("form"),g=l("div"),$=l("label"),$.textContent="First Name:",y=f(),x=l("input"),N=f(),v=l("div"),_=l("label"),_.textContent="Last Name:",k=f(),C=l("input"),w=f(),E=l("div"),S=l("label"),S.textContent="ID Card Number:",M=f(),I=l("input"),q=f(),A=l("div"),A.innerHTML='<button type="submit" class="btn btn-primary">Register</button>',j=f(),J=l("div"),T=l("h2"),T.textContent="Guest List",H=f(),P=l("ul");for(let t=0;t<F.length;t+=1)F[t].c();m(s,"class","card-header"),m($,"for","firstName"),m($,"class","form-label"),m(x,"type","text"),m(x,"id","firstName"),m(x,"class","form-control"),x.required=!0,m(g,"class","mb-3"),m(_,"for","lastName"),m(_,"class","form-label"),m(C,"type","text"),m(C,"id","lastName"),m(C,"class","form-control"),C.required=!0,m(v,"class","mb-3"),m(S,"for","idCardNumber"),m(S,"class","form-label"),m(I,"type","text"),m(I,"id","idCardNumber"),m(I,"class","form-control"),I.required=!0,m(E,"class","mb-3"),m(A,"class","text-center"),m(p,"class","card-body"),m(o,"class","card svelte-128loa9"),m(J,"class","mt-4"),m(n,"class","container mt-5")},m(t,r){a(t,n,r),c(n,o),c(o,s),c(o,u),c(o,p),c(p,b),c(b,g),c(g,$),c(g,y),c(g,x),h(x,e[1]),c(b,N),c(b,v),c(v,_),c(v,k),c(v,C),h(C,e[2]),c(b,w),c(b,E),c(E,S),c(E,M),c(E,I),h(I,e[3]),c(b,q),c(b,A),c(n,j),c(n,J),c(J,T),c(J,H),c(J,P);for(let t=0;t<F.length;t+=1)F[t]&&F[t].m(P,null);var i;R||(B=[d(x,"input",e[9]),d(C,"input",e[10]),d(I,"input",e[11]),d(b,"submit",(i=e[5],function(t){return t.preventDefault(),i.call(this,t)}))],R=!0)},p(t,[e]){2&e&&x.value!==t[1]&&h(x,t[1]),4&e&&C.value!==t[2]&&h(C,t[2]),8&e&&I.value!==t[3]&&h(I,t[3]),497&e&&(K=t[0],F=function(t,e,n,o,s,c,a,i,l,u,f,d){let m=t.length,p=c.length,h=m;const b={};for(;h--;)b[t[h].key]=h;const g=[],$=new Map,y=new Map,x=[];for(h=p;h--;){const t=d(s,c,h),r=n(t);let i=a.get(r);i?o&&x.push((()=>i.p(t,e))):(i=u(r,t),i.c()),$.set(r,g[h]=i),r in b&&y.set(r,Math.abs(h-b[r]))}const N=new Set,v=new Set;function _(t){O(t,1),t.m(i,f),a.set(t.key,t),f=t.first,p--}for(;m&&p;){const e=g[p-1],n=t[m-1],r=e.key,o=n.key;e===n?(f=e.first,m--,p--):$.has(o)?!a.has(r)||N.has(r)?_(e):v.has(o)?m--:y.get(r)>y.get(o)?(v.add(r),_(e)):(N.add(o),m--):(l(n,a),m--)}for(;m--;){const e=t[m];$.has(e.key)||l(e,a)}for(;p;)_(g[p-1]);return r(x),g}(F,e,Q,1,t,K,z,P,L,G,null,D))},i:t,o:t,d(t){t&&i(n);for(let t=0;t<F.length;t+=1)F[t].d();R=!1,r(B)}}}function P(t,e,n){let r=JSON.parse(localStorage.getItem("guests"))||[],o="",s="",c="",a=-1;function i(){if(o&&s&&c){const t={firstName:o,lastName:s,idCardNumber:c};-1===a?n(0,r=[...r,t]):(n(0,r[a]=t,r),n(4,a=-1)),localStorage.setItem("guests",JSON.stringify(r)),l()}else alert("Please fill in all fields.")}function l(){n(1,o=""),n(2,s=""),n(3,c=""),n(4,a=-1)}function u(t){t>=0&&t<r.length?(r.splice(t,1),localStorage.setItem("guests",JSON.stringify(r))):console.error("Invalid index for deleting guest")}function f(t){const e=r[t];n(1,o=e.firstName),n(2,s=e.lastName),n(3,c=e.idCardNumber),n(4,a=t)}return[r,o,s,c,a,i,l,u,f,function(){o=this.value,n(1,o)},function(){s=this.value,n(2,s)},function(){c=this.value,n(3,c)},()=>i(),()=>l(),t=>f(t),t=>u(t)]}return new class extends j{constructor(t){super(),A(this,t,P,H,s,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map