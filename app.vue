<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const authRoutes = ["/compte/inscription", "/compte/connexion"];

const isAuthRoute = computed(() => authRoutes.includes(route.path));
const currentLayout = computed(() => (isAuthRoute.value ? "auth" : "default"));

const checkAuthentication = async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  // Redirect authenticated users away from auth pages
  if (authStore.isAuthenticated && isAuthRoute.value) {
    router.push("/");
    return;
  }

  // Redirect unauthenticated users to login
  if (!authStore.isAuthenticated && !isAuthRoute.value) {
    router.push("/compte/connexion");
  }
};

onMounted(() => {
  checkAuthentication();
});

watch(route, () => {
  checkAuthentication();
});
</script>

<template>
  <NuxtLayout :name="currentLayout">
    <NuxtPage />
  </NuxtLayout>
</template>
