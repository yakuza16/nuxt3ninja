<template>
  <div>
    <div class="grid grid-cols-4 gap-5">
      <div v-for="(blog, id) in data">
        <NuxtLink :to="`/blog/${id}`">{{ blog.data.opis[0].text }}</NuxtLink>
        <!-- <ProductCard :product="p" /> -->
        <p class="font-bold" :key="id">{{ blog.data.opis[0].text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// fetch products
// const { data: products } = await useFetch("https://fakestoreapi.com/products")
// console.log(products.value);

const { client } = usePrismic()
const { data } = await useAsyncData(() => client.getAllByType("bloglist"))

console.log(data.value)

useHead({
  title: "Nuxt Dojo | Merch",
  meta: [{ name: "description", content: "Nuxt 3 Merchendise" }],
})
</script>

<style scoped></style>
