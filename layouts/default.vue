<template>
  <div>
    <LoadingOverlay :is-loading="loading" />
    <div v-if="!loading" class="flex">
      <NavMenu />
      <div class="w-full mx-12">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const loading = ref(true);

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
  loading.value = false;
});
</script>
