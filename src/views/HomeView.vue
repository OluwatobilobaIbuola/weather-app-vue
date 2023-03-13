<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        v-model="searchQuery"
        @input="getSearchResults"
        type="text"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-secondaryTwo focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        v-if="results"
        class="absolute overflow-y-scroll max-h-[400px] bg-secondaryTwo text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p v-if="errorResults" class="py-2">
          Sorry, something went wrong, please try again.
        </p>
        <p v-if="!errorResults && results.length === 0" class="py-2">
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            @click="previewResults(result)"
            v-for="result in results"
            :key="result.id"
            class="py-2 cursor-pointer hover:bg-secondaryThree"
          >
            <div class="flex flex-col">
              <p class="font-bold">{{ result.matching_full_name }}</p>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";
import CityList from "../components/CityList.vue";
const searchQuery = ref("");
const queryTimeout = ref(null);
const results = ref(null);
const errorResults = ref(null);
const router = useRouter();
const previewResults = (result) => {
  const [city, state] = result.matching_full_name.split(", ");
  const [id] = result._links["city:item"].href.split("/").slice(-2);
  router.push({
    name: "cityView",
    params: {
      state: state.toLowerCase().replaceAll(" ", ""),
      city: city.toLowerCase(),
    },
    query: {
      id: id,
      preview: true,
    },
  });
};
const getSearchResults = async () => {
  if (queryTimeout.value) {
    clearTimeout(queryTimeout.value);
  }
  if (!searchQuery.value) {
    results.value = null;
    return;
  }
  queryTimeout.value = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://api.teleport.org/api/cities/?search=${searchQuery.value}`
      );
      const data = await response.json();
      results.value = data?._embedded["city:search-results"];
    } catch (err) {
      errorResults.value = err;
    }
  }, 500);
};
</script>
