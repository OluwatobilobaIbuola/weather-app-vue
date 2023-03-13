<template>
  <div class="">
    <Suspense>
      <template #default>
        <AsyncCityView />
      </template>
      <template #fallback>
        <CityViewSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import CityViewSkeleton from "../components/CityViewSkeleton.vue";
import AsyncCityView from "../components/AsyncCityView.vue";
</script>
