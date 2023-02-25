import { defineEventHandler } from 'h3';
import { u as useRuntimeConfig } from './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'defu';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const _code_ = defineEventHandler(async (event) => {
  const { code } = event.context.params;
  const { currencyKey } = useRuntimeConfig();
  const uri = `https://api.currencyapi.com/v3/latest?currencies=${code}&apikey=${currencyKey}`;
  const { data } = await $fetch(uri);
  return data;
});

export { _code_ as default };
//# sourceMappingURL=_code_.mjs.map
