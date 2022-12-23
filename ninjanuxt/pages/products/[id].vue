<template>
  <div>
    <ProductDetails :product="product" />
  </div>
</template>

<script setup>
const { id } = useRoute().params;

definePageMeta({ layout: "products-layout" });

const { data: product } = await useFetch(
  `https://fakestoreapi.com/products/${id}`,
  { key: id }
);

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Product not found",
    fatal: true,
  });
}
</script>

<style scoped></style>
