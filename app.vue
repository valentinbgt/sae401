<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const noNavRoutes = ["/compte/inscription", "/compte/connexion"];

const loading = ref(true);

const checkConnexion = async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  const userTryToLogIn = noNavRoutes.includes(route.path);

  if (authStore.isAuthenticated) {
    if (userTryToLogIn) {
      router.push("/");
    }
  } else {
    if (!userTryToLogIn) {
      router.push("/compte/connexion");
    }
  }

  loading.value = false;
};

onMounted(() => {
  checkConnexion();
});

watch(route, () => {
  checkConnexion();
});
</script>

<template>
  <NuxtLayout>
    <div v-if="loading">Chargement en cours...</div>
    <div v-else class="flex">
      <!-- Show NavMenu only when not on login/register pages AND authenticated -->
      <NavMenu
        v-if="!noNavRoutes.includes(route.path) && authStore.isAuthenticated"
      />

      <div
        class="w-full"
        :class="[!noNavRoutes.includes(route.path) ? 'mx-12' : '']"
      >
        <NuxtPage />
      </div>
    </div>
  </NuxtLayout>
</template>
