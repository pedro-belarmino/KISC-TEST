<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <NuxtLayout name="error">
    <div>
      <h1>Oh no! Something went wrong...</h1>
      <template v-if="error">
        <template v-if="error.statusCode == 404">
          <h2>Page not found</h2>
        </template>
        <template v-else-if="error.statusCode == 403">
          <h2>Access Denied</h2>
        </template>
        <template v-else>
          <h2>Error {{ error.statusCode }}</h2>
        </template>
      </template>
      <p v-if="error && error.message" class="lead">{{ error.message }}</p>
      <NuxtLink class="my-3 btn btn-primary btn-lg" to="/">Go back home</NuxtLink>

      <p class="mt-2">If the problem continues, please <a href="mailto:digital@kisc.ch">send us an email</a>!</p>

    </div>
  </NuxtLayout>
</template>