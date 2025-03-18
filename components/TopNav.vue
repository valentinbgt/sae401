<template>
  <div class="my-10 h-12 flex items-center justify-between w-full">
    <h1 class="text-4xl font-bold"><slot /></h1>
    <div class="flex">
      <NuxtLink to="/admin" class="pl-4">
        <img src="/icons/admin.svg" />
      </NuxtLink>

      <NotificationBell :new="notif"></NotificationBell>

      <template v-if="authStore.isAuthenticated">
        <NuxtLink to="/compte" class="pl-4 flex items-center">
          <img src="/icons/account.svg" />
          <span class="text-lg font-medium pl-2">{{
            authStore.user?.prenom
          }}</span>
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          to="/compte/connexion"
          class="text-lg font-medium pl-4 flex items-center"
        >
          Connexion
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notif: Boolean,
});

import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Charger les données utilisateur au chargement du composant
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
});

const logout = () => {
  authStore.logout();
  navigateTo("/");
};
</script>
