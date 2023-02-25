import { defineEventHandler } from 'h3';

const ninja = defineEventHandler(async (event) => {
  const { data } = await $fetch(
    "https://api.currencyapi.com/v3/latest?apikey=mZNzFM3IwMkG4rKFEi5aUVzWCtAGcDdHp8Ve2aK6"
  );
  return {
    data
  };
});

export { ninja as default };
//# sourceMappingURL=ninja.mjs.map
