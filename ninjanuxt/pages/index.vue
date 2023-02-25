<template>
  <div>
    <h2>Home</h2>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, error
      est eos ex consectetur, beatae dolore exercitationem quibusdam soluta,
      debitis inventore saepe rerum aliquid tempore possimus repudiandae nemo id
      eaque culpa expedita? Veniam, a. Voluptas illo officiis ab tenetur velit
      at aperiam voluptatibus beatae unde, libero placeat repellat quasi a!
    </p>
    <!-- <button>{{ data }}</button> -->
    <!-- <p v-for="restaurant in response.data">
      {{ restaurant.attributes.name }}
      <span>{{ restaurant.attributes.description }}</span>
    </p> -->
    <!-- <p>{{ response.data.attributes.Opis }}</p> -->
  </div>
</template>

<script setup>
// tutaj odnosnie STRAPI
// const route = useRoute();
// const { find } = useStrapi();
// const { findOne } = useStrapi();

// const response = await findOne("opis");

// console.log(response);

// const response = await find("restaurants");

// console.log(response.data);

// const response = await find("restaurants");

// console.log(response);

// dotąd jest strapi

// niżej odnośnie prismica
// const { client } = usePrismic();
// const { data } = await useAsyncData(() => client.getAllByType("maincontent"));
</script>

<style scoped></style>
