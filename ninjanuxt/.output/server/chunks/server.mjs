import { getCurrentInstance, ref, onServerPrefetch, inject, version, defineComponent, h, computed, unref, Suspense, nextTick, Transition, provide, reactive, resolveComponent, shallowRef, useSSRContext, createApp, toRef, isRef, defineAsyncComponent, onErrorCaptured, withCtx, createVNode, watch, resolveDynamicComponent } from 'vue';
import { $fetch as $fetch$1 } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import destr from 'destr';
import { hasProtocol, isEqual, parseURL, joinURL } from 'ufo';
import { createError as createError$1, sendRedirect, appendHeader } from 'h3';
import { useHead, createHead as createHead$1 } from '@unhead/vue';
import { renderDOMHead, debouncedRenderDOMHead } from '@unhead/dom';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, routerKey } from 'vue-router';
import { parse, serialize } from 'cookie-es';
import { isEqual as isEqual$1 } from 'ohash';
import { stringify } from 'qs';
import { createClient, predicate, cookie } from '@prismicio/client';
import { asText, asHTML, asLink, asDate, asImageSrc, asImageWidthSrcSet, asImagePixelDensitySrcSet, documentToLinkField, isFilled } from '@prismicio/helpers';
import { ssrRenderSuspense, ssrRenderComponent } from 'vue/server-renderer';
import { defu } from 'defu';
import { u as useRuntimeConfig$1 } from './node-server.mjs';
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

var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a2;
      if (prop === "public") {
        return target.public;
      }
      return (_a2 = target[prop]) != null ? _a2 : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const getDefault = () => null;
function useAsyncData(...args) {
  var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = (_a2 = options.server) != null ? _a2 : true;
  options.default = (_b2 = options.default) != null ? _b2 : getDefault;
  options.lazy = (_c2 = options.lazy) != null ? _c2 : false;
  options.immediate = (_d2 = options.immediate) != null ? _d2 : true;
  const nuxt = useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref((_g2 = (_f2 = getCachedData()) != null ? _f2 : (_e2 = options.default) == null ? void 0 : _e2.call(options)) != null ? _g2 : null),
      pending: ref(!hasCachedData()),
      error: ref(nuxt.payload._errors[key] ? createError(nuxt.payload._errors[key]) : null)
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      var _a3, _b3;
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref((_b3 = (_a3 = options.default) == null ? void 0 : _a3.call(options)) != null ? _b3 : null);
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
async function refreshNuxtData(keys) {
  {
    return Promise.resolve();
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a2;
  return (_a2 = useNuxtApp()) == null ? void 0 : _a2.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a2;
  return (_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.event;
}
const CookieDefaults = {
  path: "/",
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a2, _b2;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie2 = ref((_b2 = cookies[name]) != null ? _b2 : (_a2 = opts.default) == null ? void 0 : _a2.call(opts));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual$1(cookie2.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie2.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie2;
}
function readRawCookies(opts = {}) {
  var _a2;
  {
    return parse(((_a2 = useRequestEvent()) == null ? void 0 : _a2.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, { ...opts, maxAge: -1 });
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a2, _b2, _c2;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b2 = (_a2 = router.resolve(to.value)) == null ? void 0 : _a2.href) != null ? _b2 : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_c2 = slots.default) == null ? void 0 : _c2.call(slots));
      };
    }
  });
}
const __nuxt_component_0$1 = defineNuxtLink({ componentName: "NuxtLink" });
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const inlineConfig = {};
defuFn(inlineConfig);
const components = {};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function createHead(initHeadObject) {
  const unhead = createHead$1();
  const legacyHead = {
    unhead,
    install(app) {
      if (version.startsWith("3")) {
        app.config.globalProperties.$head = unhead;
        app.provide("usehead", unhead);
      }
    },
    use(plugin) {
      unhead.use(plugin);
    },
    resolveTags() {
      return unhead.resolveTags();
    },
    headEntries() {
      return unhead.headEntries();
    },
    headTags() {
      return unhead.resolveTags();
    },
    push(input, options) {
      return unhead.push(input, options);
    },
    addEntry(input, options) {
      return unhead.push(input, options);
    },
    addHeadObjs(input, options) {
      return unhead.push(input, options);
    },
    addReactiveEntry(input, options) {
      const api = useHead(input, options);
      if (typeof api !== "undefined")
        return api.dispose;
      return () => {
      };
    },
    removeHeadObjs() {
    },
    updateDOM(document2, force) {
      if (force)
        renderDOMHead(unhead, { document: document2 });
      else
        debouncedRenderDOMHead(unhead, { delayFn: (fn) => setTimeout(() => fn(), 50), document: document2 });
    },
    internalHooks: unhead.hooks,
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    }
  };
  unhead.addHeadObjs = legacyHead.addHeadObjs;
  unhead.updateDOM = legacyHead.updateDOM;
  unhead.hooks.hook("dom:beforeRender", (ctx) => {
    for (const hook of legacyHead.hooks["before:dom"]) {
      if (hook() === false)
        ctx.shouldRender = false;
    }
  });
  if (initHeadObject)
    legacyHead.addHeadObjs(initHeadObject);
  return legacyHead;
}
version.startsWith("2.");
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }, { "name": "description", "content": "Everything about Nuxt 3" }], "link": [{ "rel": "stylesheet", "href": "https://fonts.googleapis.com/icon?family=Material+Icons" }], "style": [], "script": [{ "hid": "prismic-preview", "src": "https://static.cdn.prismic.io/prismic.min.js?repo=olejekcbd&new=true", "async": true, "defer": true }], "noscript": [], "title": "Nuxt Dojo" };
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = useHead;
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const { renderSSRHead } = await import('@unhead/ssr');
      const meta = await renderSSRHead(head.unhead);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        bodyScripts: meta.bodyTags
      };
    };
  }
});
const __nuxt_page_meta$4 = {};
const __nuxt_page_meta$3 = {};
const __nuxt_page_meta$2 = {};
const __nuxt_page_meta$1 = { layout: "products-layout" };
const __nuxt_page_meta = { layout: "products-layout" };
const _routes = [
  {
    name: (_a = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) != null ? _a : "prismic-preview",
    path: (_b = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) != null ? _b : "/preview",
    file: "C:/Users/User/Desktop/nuxt3ninja/ninjanuxt/node_modules/@nuxtjs/prismic/dist/runtime/preview.vue",
    children: [],
    meta: __nuxt_page_meta$4,
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./preview.c91624bb.mjs').then((m) => m.default || m)
  },
  {
    name: (_c = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) != null ? _c : "about",
    path: (_d = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) != null ? _d : "/about",
    file: "C:/Users/User/Desktop/nuxt3ninja/ninjanuxt/pages/about.vue",
    children: [],
    meta: __nuxt_page_meta$3,
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./about.684174c4.mjs').then((m) => m.default || m)
  },
  {
    name: (_e = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) != null ? _e : "index",
    path: (_f = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) != null ? _f : "/",
    file: "C:/Users/User/Desktop/nuxt3ninja/ninjanuxt/pages/index.vue",
    children: [],
    meta: __nuxt_page_meta$2,
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./index.9a72764c.mjs').then((m) => m.default || m)
  },
  {
    name: (_g = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) != null ? _g : "products-id",
    path: (_h = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) != null ? _h : "/products/:id",
    file: "C:/Users/User/Desktop/nuxt3ninja/ninjanuxt/pages/products/[id].vue",
    children: [],
    meta: __nuxt_page_meta$1,
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_id_.d96d7645.mjs').then((m) => m.default || m)
  },
  {
    name: (_i = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) != null ? _i : "products",
    path: (_j = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) != null ? _j : "/products",
    file: "C:/Users/User/Desktop/nuxt3ninja/ninjanuxt/pages/products/index.vue",
    children: [],
    meta: __nuxt_page_meta,
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./index.03a5b753.mjs').then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => {
      var _a2;
      return !!((_a2 = route.meta.pageTransition) != null ? _a2 : appPageTransition);
    };
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a, b) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = defineNuxtRouteMiddleware(async (to) => {
  var _a2;
  let __temp, __restore;
  if (!((_a2 = to.meta) == null ? void 0 : _a2.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (typeof result === "boolean") {
    return result;
  }
  return createError(result);
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {};
const node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB = defineNuxtPlugin(async (nuxtApp) => {
  var _a2, _b2, _c2, _d2;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = (_b2 = (_a2 = routerOptions.history) == null ? void 0 : _a2.call(routerOptions, routerBase)) != null ? _b2 : createMemoryHistory(routerBase);
  const routes = (_d2 = (_c2 = routerOptions.routes) == null ? void 0 : _c2.call(routerOptions, _routes)) != null ? _d2 : _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a3, _b3, _c3, _d3;
    if (((_b3 = (_a3 = to.matched[0]) == null ? void 0 : _a3.components) == null ? void 0 : _b3.default) === ((_d3 = (_c3 = from.matched[0]) == null ? void 0 : _c3.components) == null ? void 0 : _d3.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    callWithNuxt(nuxtApp, showError, [error2]);
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a3, _b3;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating) {
      to.meta.layout = (_a3 = initialLayout.value) != null ? _a3 : to.meta.layout;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b3 = namedMiddleware[entry2]) == null ? void 0 : _b3.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        force: true
      });
    } catch (error2) {
      callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const useStrapiToken = () => {
  const nuxt = useNuxtApp();
  const config = useRuntimeConfig();
  nuxt._cookies = nuxt._cookies || {};
  if (nuxt._cookies[config.strapi.cookieName]) {
    return nuxt._cookies[config.strapi.cookieName];
  }
  const cookie2 = useCookie(config.strapi.cookieName, config.strapi.cookie);
  nuxt._cookies[config.strapi.cookieName] = cookie2;
  return cookie2;
};
const useStrapiUser = () => useState("strapi_user");
const useStrapiUrl = () => {
  const config = useRuntimeConfig();
  const version2 = config.strapi.version;
  return version2 === "v3" ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`;
};
const useStrapiVersion = () => {
  const config = useRuntimeConfig();
  return config.strapi.version;
};
const defaultErrors = (err) => ({
  v4: {
    error: {
      status: 500,
      name: "UnknownError",
      message: err.message,
      details: err
    }
  },
  v3: {
    error: "UnknownError",
    message: err.message,
    statusCode: 500
  }
});
const useStrapiClient = () => {
  const nuxt = useNuxtApp();
  const baseURL2 = useStrapiUrl();
  const version2 = useStrapiVersion();
  const token = useStrapiToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    if (fetchOptions.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true });
      if (params) {
        url = `${url}?${params}`;
      }
      delete fetchOptions.params;
    }
    try {
      return await $fetch(url, {
        retry: 0,
        baseURL: baseURL2,
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers
        }
      });
    } catch (err) {
      const e = err.data || defaultErrors(err)[version2];
      nuxt.hooks.callHook("strapi:error", e);
      throw e;
    }
  };
};
const useStrapiAuth = () => {
  const url = useStrapiUrl();
  const token = useStrapiToken();
  const user = useStrapiUser();
  const client2 = useStrapiClient();
  const config = useRuntimeConfig();
  const setToken = (value) => {
    token.value = value;
  };
  const setUser = (value) => {
    user.value = value;
  };
  const fetchUser = async () => {
    if (token.value && !user.value) {
      try {
        user.value = await client2("/users/me", { params: config.strapi.auth });
      } catch (e) {
        setToken(null);
      }
    }
    return user;
  };
  const login = async (data) => {
    setToken(null);
    const { jwt } = await client2("/auth/local", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  const register = async (data) => {
    setToken(null);
    const { jwt } = await client2("/auth/local/register", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const forgotPassword = async (data) => {
    setToken(null);
    await client2("/auth/forgot-password", { method: "POST", body: data });
  };
  const resetPassword = async (data) => {
    setToken(null);
    const { jwt } = await client2("/auth/reset-password", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const changePassword = async (data) => {
    await client2("/auth/change-password", { method: "POST", body: data });
  };
  const sendEmailConfirmation = async (data) => {
    await client2("/auth/send-email-confirmation", { method: "POST", body: data });
  };
  const getProviderAuthenticationUrl = (provider) => {
    return `${url}/connect/${provider}`;
  };
  const authenticateProvider = async (provider, access_token) => {
    setToken(null);
    const { jwt } = await client2(`/auth/${provider}/callback`, { method: "GET", params: { access_token } });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  return {
    setToken,
    setUser,
    fetchUser,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    sendEmailConfirmation,
    getProviderAuthenticationUrl,
    authenticateProvider
  };
};
const node_modules__64nuxtjs_strapi_dist_runtime_strapi_plugin_mjs_35gTOGMBRa = defineNuxtPlugin(async () => {
  let __temp, __restore;
  const { fetchUser } = useStrapiAuth();
  [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
});
const simplyResolveComponent = (component) => {
  return resolveDynamicComponent(component);
};
const defaultWrapper$2 = "div";
const PrismicEmbedImpl = /* @__PURE__ */ defineComponent({
  name: "PrismicEmbed",
  props: {
    field: {
      type: Object,
      required: true
    },
    wrapper: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    }
  },
  setup(props) {
    if (!props.field) {
      return () => null;
    }
    return () => {
      return h(simplyResolveComponent(props.wrapper || defaultWrapper$2), {
        "data-oembed": props.field.embed_url,
        "data-oembed-type": props.field.type,
        "data-oembed-provider": props.field.provider_name,
        innerHTML: props.field.html || null
      });
    };
  }
});
const PrismicEmbed = PrismicEmbedImpl;
if (typeof process === "undefined") {
  globalThis.process = { env: {} };
}
const prismicKey = Symbol("prismic");
const usePrismic = () => {
  return inject(prismicKey, { options: { endpoint: "" } });
};
const defaultImageComponent = "img";
const usePrismicImage = (props) => {
  const { options } = usePrismic();
  const asImage = computed(() => {
    var _a2, _b2;
    const field = unref(props.field);
    if (!isFilled.image(field)) {
      return {
        src: null,
        srcset: null
      };
    }
    const imgixParams = unref(props.imgixParams);
    const widths = unref(props.widths);
    const pixelDensities = unref(props.pixelDensities);
    if (widths) {
      return asImageWidthSrcSet(field, {
        ...imgixParams,
        widths: widths === "defaults" ? (_a2 = options.components) == null ? void 0 : _a2.imageWidthSrcSetDefaults : widths
      });
    } else if (pixelDensities) {
      return asImagePixelDensitySrcSet(field, {
        ...imgixParams,
        pixelDensities: pixelDensities === "defaults" ? (_b2 = options.components) == null ? void 0 : _b2.imagePixelDensitySrcSetDefaults : pixelDensities
      });
    } else {
      return {
        src: asImageSrc(field, imgixParams),
        srcset: null
      };
    }
  });
  const src = computed(() => {
    return asImage.value.src;
  });
  const srcset = computed(() => {
    return asImage.value.srcset;
  });
  const alt = computed(() => {
    return unref(props.field).alt || "";
  });
  const copyright = computed(() => {
    return unref(props.field).copyright || null;
  });
  return {
    src,
    srcset,
    alt,
    copyright
  };
};
const PrismicImageImpl = /* @__PURE__ */ defineComponent({
  name: "PrismicImage",
  props: {
    field: {
      type: Object,
      required: true
    },
    imageComponent: {
      type: [String, Object],
      default: void 0,
      required: false
    },
    imgixParams: {
      type: Object,
      default: void 0,
      required: false
    },
    widths: {
      type: [String, Object],
      default: void 0,
      required: false
    },
    pixelDensities: {
      type: [String, Object],
      default: void 0,
      required: false
    }
  },
  setup(props) {
    if (!props.field) {
      return () => null;
    }
    const { options } = usePrismic();
    const type = computed(() => {
      var _a2;
      return props.imageComponent || ((_a2 = options.components) == null ? void 0 : _a2.imageComponent) || defaultImageComponent;
    });
    const { src, srcset, alt, copyright } = usePrismicImage(props);
    return () => {
      const attributes = {
        src: src.value,
        srcset: srcset.value,
        alt: alt.value
      };
      switch (type.value) {
        case "img":
          return h("img", attributes);
        default:
          return h(simplyResolveComponent(type.value), {
            ...attributes,
            copyright: copyright.value
          });
      }
    };
  }
});
const PrismicImage = PrismicImageImpl;
const isInternalURL = (url) => {
  const isInternal = /^\/(?!\/)/.test(url);
  const isSpecialLink = !isInternal && !/^https?:\/\//i.test(url);
  return isInternal && !isSpecialLink;
};
const getSlots = (parent, slots, defaultPayload) => {
  if (typeof parent === "string") {
    return slots.default && slots.default(defaultPayload);
  } else {
    if (slots.default) {
      const content = slots.default(defaultPayload);
      return {
        ...slots,
        default: () => content
      };
    } else {
      return slots;
    }
  }
};
const defaultInternalComponent = "router-link";
const defaultExternalComponent = "a";
const defaultBlankTargetRelAttribute = "noopener noreferrer";
const usePrismicLink = (props) => {
  const { options } = usePrismic();
  const type = computed(() => {
    var _a2, _b2;
    const internalComponent = unref(props.internalComponent) || ((_a2 = options.components) == null ? void 0 : _a2.linkInternalComponent) || defaultInternalComponent;
    const externalComponent = unref(props.externalComponent) || ((_b2 = options.components) == null ? void 0 : _b2.linkExternalComponent) || defaultExternalComponent;
    return href.value && isInternalURL(href.value) && !target.value ? internalComponent : externalComponent;
  });
  const href = computed(() => {
    var _a2, _b2;
    const field = unref(props.field);
    const linkResolver2 = (_a2 = unref(props.linkResolver)) != null ? _a2 : options.linkResolver;
    return (_b2 = asLink(field, linkResolver2)) != null ? _b2 : "";
  });
  const target = computed(() => {
    const field = unref(props.field);
    const target2 = unref(props.target);
    if (typeof target2 !== "undefined") {
      return target2;
    } else {
      return field && "target" in field && field.target ? field.target : null;
    }
  });
  const rel = computed(() => {
    var _a2;
    const rel2 = unref(props.rel);
    if (typeof rel2 !== "undefined") {
      return rel2;
    } else if (target.value === "_blank") {
      const blankTargetRelAttribute = unref(props.blankTargetRelAttribute);
      if (typeof blankTargetRelAttribute !== "undefined") {
        return blankTargetRelAttribute;
      } else {
        return typeof ((_a2 = options.components) == null ? void 0 : _a2.linkBlankTargetRelAttribute) !== "undefined" ? options.components.linkBlankTargetRelAttribute : defaultBlankTargetRelAttribute;
      }
    } else {
      return null;
    }
  });
  return {
    type,
    href,
    target,
    rel
  };
};
const PrismicLinkImpl = /* @__PURE__ */ defineComponent({
  name: "PrismicLink",
  props: {
    field: {
      type: Object,
      required: true
    },
    linkResolver: {
      type: Function,
      default: void 0,
      required: false
    },
    target: {
      type: String,
      default: void 0,
      required: false
    },
    rel: {
      type: String,
      default: void 0,
      required: false
    },
    blankTargetRelAttribute: {
      type: String,
      default: void 0,
      required: false
    },
    internalComponent: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    },
    externalComponent: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    }
  },
  setup(props, { slots }) {
    if (!props.field) {
      return () => null;
    }
    const { type, href, target, rel } = usePrismicLink(props);
    return () => {
      const parent = type.value === "a" ? "a" : simplyResolveComponent(type.value);
      const computedSlots = getSlots(parent, slots, reactive({ href: href.value }));
      if (typeof parent === "string") {
        return h(parent, { href: href.value, target: target.value, rel: rel.value }, computedSlots);
      } else {
        return h(parent, { to: href.value }, computedSlots);
      }
    };
  }
});
const PrismicLink = PrismicLinkImpl;
const defaultWrapper$1 = "div";
const usePrismicText = (props) => {
  const text = computed(() => {
    var _a2;
    const field = unref(props.field);
    if (!isFilled.richText(field)) {
      return (_a2 = unref(props.fallback)) != null ? _a2 : "";
    }
    return asText(unref(field), unref(props.separator));
  });
  return {
    text
  };
};
const PrismicTextImpl = /* @__PURE__ */ defineComponent({
  name: "PrismicText",
  props: {
    field: {
      type: Array,
      default: void 0,
      required: false
    },
    separator: {
      type: String,
      default: void 0,
      required: false
    },
    wrapper: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    },
    fallback: {
      type: String,
      default: void 0,
      required: false
    }
  },
  setup(props) {
    const { text } = usePrismicText(props);
    return () => {
      const parent = simplyResolveComponent(props.wrapper || defaultWrapper$1);
      return h(parent, null, {
        default: () => text.value
      });
    };
  }
});
const PrismicText = PrismicTextImpl;
const defaultWrapper = "div";
const usePrismicRichText = (props) => {
  const { options } = usePrismic();
  const html = computed(() => {
    var _a2, _b2, _c2;
    const field = unref(props.field);
    if (!isFilled.richText(field)) {
      return (_a2 = unref(props.fallback)) != null ? _a2 : "";
    }
    const linkResolver2 = (_b2 = unref(props.linkResolver)) != null ? _b2 : options.linkResolver;
    const htmlSerializer2 = (_c2 = unref(props.htmlSerializer)) != null ? _c2 : options.htmlSerializer;
    return asHTML(unref(field), linkResolver2, htmlSerializer2);
  });
  return {
    html
  };
};
const PrismicRichTextImpl = /* @__PURE__ */ defineComponent({
  name: "PrismicRichText",
  props: {
    field: {
      type: Array,
      default: void 0,
      required: false
    },
    linkResolver: {
      type: Function,
      default: void 0,
      required: false
    },
    htmlSerializer: {
      type: [Function, Object],
      default: void 0,
      required: false
    },
    wrapper: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    },
    fallback: {
      type: String,
      default: void 0,
      required: false
    }
  },
  setup(props) {
    const { html } = usePrismicRichText(props);
    const root = ref(null);
    const maybeRouter = inject(routerKey, null);
    if (maybeRouter) {
      let links = [];
      const navigate = function(event) {
        event.preventDefault();
        maybeRouter.push(this.href);
      };
      const addListeners = () => {
        const node = root.value && "$el" in root.value ? root.value.$el : root.value;
        if (node && "querySelectorAll" in node) {
          links = Array.from(node.querySelectorAll("a")).map((element) => {
            const href = element.getAttribute("href");
            if (href && isInternalURL(href)) {
              const listener = navigate.bind({ href });
              element.addEventListener("click", listener);
              return { element, listener };
            } else {
              return false;
            }
          }).filter((link) => link);
        }
      };
      const removeListeners = () => {
        links.forEach(({ element, listener }) => element.removeEventListener("click", listener));
        links = [];
      };
      watch(html, () => {
        removeListeners();
        nextTick(addListeners);
      }, { immediate: true });
    }
    return () => {
      return h(simplyResolveComponent(props.wrapper || defaultWrapper), {
        innerHTML: html.value,
        ref: root
      });
    };
  }
});
const PrismicRichText = PrismicRichTextImpl;
const TODOSliceComponent = () => null ;
const SliceZoneImpl = /* @__PURE__ */ defineComponent({
  name: "SliceZone",
  props: {
    slices: {
      type: Array,
      required: true
    },
    components: {
      type: Object,
      default: void 0,
      required: false
    },
    resolver: {
      type: Function,
      default: void 0,
      required: false
    },
    context: {
      type: null,
      default: void 0,
      required: false
    },
    defaultComponent: {
      type: Object,
      default: void 0,
      required: false
    },
    wrapper: {
      type: [String, Object, Function],
      default: void 0,
      required: false
    }
  },
  setup(props) {
    if (!props.slices) {
      return () => null;
    }
    const { options } = usePrismic();
    const renderedSlices = computed(() => {
      return props.slices.map((slice, index) => {
        var _a2;
        const type = "slice_type" in slice ? slice.slice_type : slice.type;
        let component = props.components && type in props.components ? props.components[type] : props.defaultComponent || ((_a2 = options.components) == null ? void 0 : _a2.sliceZoneDefaultComponent) || TODOSliceComponent;
        if (props.resolver) {
          const resolvedComponent = props.resolver({
            slice,
            sliceName: type,
            i: index
          });
          if (resolvedComponent) {
            component = resolvedComponent;
          }
        }
        const key = "id" in slice && slice.id ? slice.id : `${index}-${JSON.stringify(slice)}`;
        const p = {
          key,
          slice,
          index,
          context: props.context,
          slices: props.slices
        };
        return h(simplyResolveComponent(component), p);
      });
    });
    return () => {
      if (props.wrapper) {
        const parent = simplyResolveComponent(props.wrapper);
        if (typeof parent === "string") {
          return h(parent, null, renderedSlices.value);
        } else {
          return h(parent, null, { default: () => renderedSlices.value });
        }
      } else {
        return renderedSlices.value;
      }
    };
  }
});
const SliceZone = SliceZoneImpl;
const createPrismic = (options) => {
  let client2;
  if (options.client) {
    client2 = options.client;
  } else {
    client2 = createClient(options.endpoint, {
      fetch: async (endpoint, options2) => {
        let fetchFunction;
        if (typeof globalThis.fetch === "function") {
          fetchFunction = globalThis.fetch;
        } else {
          fetchFunction = (await import('isomorphic-unfetch')).default;
        }
        return await fetchFunction(endpoint, options2);
      },
      ...options.clientConfig
    });
  }
  const prismicClient = {
    client: client2,
    predicate,
    cookie
  };
  const prismicHelpers = {
    asText,
    asHTML: (richTextField, linkResolver2, htmlSerializer2) => {
      return asHTML(richTextField, linkResolver2 || options.linkResolver, htmlSerializer2 || options.htmlSerializer);
    },
    asLink: (linkField, linkResolver2) => {
      return asLink(linkField, linkResolver2 || options.linkResolver);
    },
    asDate,
    asImageSrc,
    asImageWidthSrcSet,
    asImagePixelDensitySrcSet,
    documentToLinkField
  };
  const prismic = {
    options,
    ...prismicClient,
    ...prismicHelpers,
    install(app) {
      app.provide(prismicKey, this);
      app.config.globalProperties.$prismic = this;
      if (options.injectComponents !== false) {
        app.component(PrismicLink.name, PrismicLink);
        app.component(PrismicEmbed.name, PrismicEmbed);
        app.component(PrismicImage.name, PrismicImage);
        app.component(PrismicText.name, PrismicText);
        app.component(PrismicRichText.name, PrismicRichText);
        app.component(SliceZone.name, SliceZone);
      }
    }
  };
  return prismic;
};
const client = void 0;
const linkResolver = void 0;
const htmlSerializer = void 0;
const pkgName = "@nuxtjs/prismic";
const node_modules__64nuxtjs_prismic_dist_runtime_plugin_mjs_JbOpvgCHAb = defineNuxtPlugin((nuxtApp) => {
  var _a2, _b2, _c2;
  const mergedOptions = (_b2 = (_a2 = nuxtApp.payload.config[pkgName]) != null ? _a2 : nuxtApp.payload.config.public[pkgName]) != null ? _b2 : {};
  const prismicPlugin = createPrismic({
    ...mergedOptions,
    client,
    linkResolver,
    htmlSerializer,
    injectComponents: false,
    components: {
      linkInternalComponent: __nuxt_component_0$1,
      linkExternalComponent: __nuxt_component_0$1,
      ...mergedOptions.components
    }
  });
  nuxtApp.vueApp.use(prismicPlugin);
  if (mergedOptions.preview) {
    const previewCookie = useCookie("io.prismic.preview").value;
    {
      prismicPlugin.client.enableAutoPreviewsFromReq((_c2 = useRequestEvent()) == null ? void 0 : _c2.req);
    }
    if (previewCookie) {
      try {
        const session = typeof previewCookie === "string" ? JSON.parse(decodeURIComponent(previewCookie)) : previewCookie;
        if (Object.keys(session).some((key) => key in session && typeof session[key] === "object" && session[key] !== null && "preview" in session[key] && session[key].preview)) {
          refreshNuxtData();
        }
      } catch (error) {
        console.warn("Failed to parse Prismic preview cookie", error);
      }
    }
  }
});
const _plugins = [
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0,
  node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB,
  node_modules__64nuxtjs_strapi_dist_runtime_strapi_plugin_mjs_35gTOGMBRa,
  node_modules__64nuxtjs_prismic_dist_runtime_plugin_mjs_JbOpvgCHAb
];
const Fragment = defineComponent({
  setup(_props, { slots }) {
    return () => {
      var _a2;
      return (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const layouts = {
  default: () => import('./default.ec4d0668.mjs').then((m) => m.default || m),
  "products-layout": () => import('./productsLayout.24506dbf.mjs').then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => {
      return h(LayoutComponent, {}, context.slots);
    };
  }
});
const __nuxt_component_0 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = unref(props.name)) != null ? _a2 : route.meta.layout) != null ? _b2 : "default";
    });
    return () => {
      var _a2;
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = (_a2 = route.meta.layoutTransition) != null ? _a2 : appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && { key: layout.value, name: layout.value, hasTransition: void 0 }, context.slots).default()
      }).default();
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a2;
    return ((_a2 = route.params[r.slice(1)]) == null ? void 0 : _a2.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a2;
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a3;
    return ((_a3 = m.components) == null ? void 0 : _a3.default) === routeProps.Component.type;
  });
  const source = (_a2 = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a2 : matchedRoute && interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a2, _b2, _c2, _d2;
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(props.pageKey, routeProps);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!((_b2 = (_a2 = props.transition) != null ? _a2 : routeProps.route.meta.pageTransition) != null ? _b2 : appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              (_d2 = (_c2 = props.keepalive) != null ? _c2 : routeProps.route.meta.keepalive) != null ? _d2 : appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h(Component, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const Component = defineComponent({
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_1;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./error-component.1f7814cb.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { _export_sfc as _, useRouter as a, useNuxtApp as b, useAsyncData as c, useRoute as d, entry$1 as default, createError as e, __nuxt_component_0$1 as f, usePrismic as u };
//# sourceMappingURL=server.mjs.map
