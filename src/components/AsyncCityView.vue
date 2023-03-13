<template>
  <div class="flex flex-col flex-1 items-center">
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-secondaryTwo w-full text-center"
    >
      <p>
        You are currently previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData?.current?.dt).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{ ", " }}
        {{
          new Date(weatherData?.current?.dt).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="text-8xl mb-8">
        {{ Math.round(weatherData?.current?.temp) }}&deg;
      </p>
      <p>
        Feels like
        {{ Math.round(weatherData?.current?.feels_like) }} &deg;
      </p>
      <p class="capitalize">
        {{ weatherData?.current?.weather[0]?.description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData?.current?.weather[0]?.icon}@2x.png`"
        alt=""
      />
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-auto py-4">
          <div
            v-for="hourData in weatherData?.hourly"
            :key="hourData?.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData?.dt).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              class="w-auto h-[50px] object-cover"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt=""
            />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">7 Day Forecast</h2>
        <div
          v-for="day in weatherData.daily"
          :key="day.dt"
          class="flex items-center"
        >
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img
            class="w-[50px] h-[50px] object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            alt=""
          />
          <div class="flex gap-2 flex-1 justify-end">
            <p>H: {{ Math.round(day.temp.max) }}</p>
            <p>L: {{ Math.round(day.temp.min) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { weatherApiKey } from "../utils/helper";
const route = useRoute();
const router = useRouter();
const getCityData = async () => {
  try {
    const response = await fetch(
      `https://api.teleport.org/api/cities/${route.query.id}/`
    );
    const data = await response.json();
    return data?.location?.latlon;
  } catch (err) {
    console.log(err);
  }
};
const getWeather = async () => {
  const {
    latitude = latitude.replaceAll(" ", ""),
    longitude = longitude.replaceAll(" ", ""),
  } = await getCityData();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${weatherApiKey}&units=imperial`
    );
    const data = await response.json();
    data.current.dt = 1000 * data.current.dt;

    // cal hourly weather offset
    data.hourly.forEach((hour) => {
      hour.dt = hour.dt * 1000;
    });

    await new Promise((res) => setTimeout(res, 1000));

    return data;
  } catch (err) {
    console.log(err);
  }
};
const weatherData = await getWeather();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  console.log(cities);
  const newCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(newCities));
  router.push({ name: "home" });
};
</script>
