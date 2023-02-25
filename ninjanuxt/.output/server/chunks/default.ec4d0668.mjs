import { _ as _export_sfc, f as __nuxt_component_0$1 } from './server.mjs';
import { withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'ufo';
import 'h3';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import 'cookie-es';
import 'ohash';
import 'qs';
import '@prismicio/client';
import '@prismicio/helpers';
import 'defu';
import './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-8c678648><header class="shadow-sm bg-white" data-v-8c678648><nav class="container mx-auto p-4 flex justify-between" data-v-8c678648>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "font-bold",
    to: "/"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Nuxt Dojo`);
      } else {
        return [
          createTextVNode("Nuxt Dojo")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<ul class="flex gap-4" data-v-8c678648><li data-v-8c678648>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-8c678648>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/about" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`About`);
      } else {
        return [
          createTextVNode("About")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-8c678648>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/products",
    class: "btn"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Products`);
      } else {
        return [
          createTextVNode("Products")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></nav></header><div class="container mx-auto p-4" data-v-8c678648>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8c678648"]]);

export { _default as default };
//# sourceMappingURL=default.ec4d0668.mjs.map
