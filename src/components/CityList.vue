<template>
  <div>
    <div v-for="city in savedCities" :key="city.id">
      <CityCard :city="city" @click="goToCityView(city)" />
    </div>

    <p v-if="savedCities.length === 0">
      No locations added. To start tracking a location, search in the field
      above.
    </p>
  </div>
</template>

<script setup>
import CityCard from "./CityCard.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const savedCities = ref([]);
const getCities = async () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }
  const request = [];
  savedCities.value.forEach((city) => {
    request.push(
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.latitude}&lon=${city.coords.longitude}&appid=87c946a8cbc9e34c1a8c166bdb58a148&units=imperial`
      )
    );
  });
  const data = await Promise.all(request);
  const results = await Promise.all(data.map((res) => res.json()));

  await new Promise((res) => setTimeout(res, 1000));

  results.forEach((result, i) => {
    console.log(result);
    savedCities.value[i].weather = result;
  });
};
await getCities();
const goToCityView = (city) => {
  router.push({
    name: "cityView",
    params: { state: city.state, city: city.city },
    query: {
      id: city.id,
    },
  });
};
</script>

<style lang="scss" scoped></style>
