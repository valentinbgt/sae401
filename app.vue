<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const noNavRoutes = ['/compte/inscription', '/compte/connexion']
const hideNavMenu = noNavRoutes.includes(route.path)
</script>

<template>
  <div>
    <NuxtLayout>
      <div class="flex">
        <template v-if="!hideNavMenu">
          <NavMenu />
        </template>
        <div class="mx-12 w-full">
          <NuxtPage />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
