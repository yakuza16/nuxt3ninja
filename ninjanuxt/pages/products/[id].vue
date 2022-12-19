<template>
  <div>
    <p>Product details for {{ id }}</p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias eveniet
      fugiat blanditiis, nostrum tenetur doloremque saepe optio ex id sint.
    </p>
  </div>
</template>

<script setup>
const { id } = useRoute().params;

definePageMeta({ layout: "products-layout" });
</script>

<style scoped></style>
