import { withAsyncContext, unref, useSSRContext } from 'vue';
import { u as useFetch } from './fetch.24353c31.mjs';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import 'ohash';
import './server.mjs';
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

const _sfc_main = {
  __name: "about",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/currency/GBP",
      "$c6wy8KmN8o"
    )), __temp = await __temp, __restore(), __temp);
    console.log(data);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h2>About</h2><p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, error est eos ex consectetur, beatae dolore exercitationem quibusdam soluta, debitis inventore saepe rerum aliquid tempore possimus repudiandae nemo id eaque culpa expedita? Veniam, a. Voluptas illo officiis ab tenetur velit at aperiam voluptatibus beatae unde, libero placeat repellat quasi a! </p><div class="bg-red-50">${ssrInterpolate(unref(data))}</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about.684174c4.mjs.map
