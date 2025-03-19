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
    <div v-if="loading">
      <div
        class="w-full h-full fixed flex items-center justify-center bg-indigo-500"
      >
        <div class="flex flex-col items-center">
          <img
            src="/assets/images/logo_agenda.svg"
            alt="logo-agenda"
            class="w-68"
          />

          <p class="text-2xl font-semibold text-white mt-8">
            Chargement en cours...
          </p>
        </div>
      </div>
    </div>
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
