<template>
  <div>
    <h2>About</h2>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, error
      est eos ex consectetur, beatae dolore exercitationem quibusdam soluta,
      debitis inventore saepe rerum aliquid tempore possimus repudiandae nemo id
      eaque culpa expedita? Veniam, a. Voluptas illo officiis ab tenetur velit
      at aperiam voluptatibus beatae unde, libero placeat repellat quasi a!
    </p>
    <div class="bg-red-50">{{ data }}</div>
  </div>
</template>

<script setup>
const { data } = await useFetch(
  "/api/currency/GBP"
  //   {
  //   method: "post",
  //   body: { age: 30 },
  // }
);
console.log(data);
</script>

<style scoped></style>
