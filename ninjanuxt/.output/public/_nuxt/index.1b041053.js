import{_ as u,o,c as s,a as c,t as p,n as r,q as i,v as l,p as m,f as h,w as x,F as f,x as v,h as g}from"./entry.34747317.js";import{u as y}from"./composables.6451d6b2.js";import{u as w}from"./fetch.fd345325.js";const C=t=>(m("data-v-5f2635d8"),t=t(),h(),t),N={class:"card text-center"},$=["src"],b={class:"font-bold text-gray-400 m-4 truncate"},k=C(()=>c("p",{class:"btn my-4"},"View Details",-1)),I={__name:"ProductCard",props:["product"],setup(t){return(e,a)=>{const n=l;return o(),s("div",N,[c("img",{src:t.product.image,alt:"product thumb",class:"thumb"},null,8,$),c("p",b,p(t.product.title),1),r(n,{to:`/products/${t.product.id}`},{default:i(()=>[k]),_:1},8,["to"])])}}},S=u(I,[["__scopeId","data-v-5f2635d8"]]),B={class:"grid grid-cols-4 gap-5"},M={__name:"index",async setup(t){let e,a;const{data:n}=([e,a]=x(()=>w("https://fakestoreapi.com/products","$U48yGv7YOO")),e=await e,a(),e);return y({title:"Nuxt Dojo | Merch",meta:[{name:"description",content:"Nuxt 3 Merchendise"}]}),(D,F)=>{const _=S;return o(),s("div",null,[c("div",B,[(o(!0),s(f,null,v(g(n),d=>(o(),s("div",null,[r(_,{product:d},null,8,["product"])]))),256))])])}}};export{M as default};
