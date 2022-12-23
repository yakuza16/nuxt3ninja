<template>
  <div>
    <div class="grid grid-cols-4 gap-5">
      <div v-for="p in products">
        <!-- <NuxtLink :to="`/products/${p.id}`">{{ p.title }}</NuxtLink> -->
        <ProductCard :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "products-layout" });

// fetch products
const { data: products } = await useFetch("https://fakestoreapi.com/products");
// console.log(products.value);
</script>

<style scoped></style>
