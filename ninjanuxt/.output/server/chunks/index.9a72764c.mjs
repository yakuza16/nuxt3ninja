import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h2>Home</h2><p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, error est eos ex consectetur, beatae dolore exercitationem quibusdam soluta, debitis inventore saepe rerum aliquid tempore possimus repudiandae nemo id eaque culpa expedita? Veniam, a. Voluptas illo officiis ab tenetur velit at aperiam voluptatibus beatae unde, libero placeat repellat quasi a! </p></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.9a72764c.mjs.map
