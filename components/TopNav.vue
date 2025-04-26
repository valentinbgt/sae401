<template>
  <div class="my-10 h-12 flex items-center justify-between w-full">
    <!-- Titre -->
    <h1
      class="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ml-10 md:ml-0"
    >
      <slot />
    </h1>

    <!-- Icônes -->
    <div class="flex items-center space-x-4">
      <!-- Admin icon: clickable if user is admin, else disabled style -->
      <template v-if="authStore.user?.admin">
        <NuxtLink to="/admin" class="flex items-center justify-center">
          <img src="/icons/admin.svg" alt="Admin Icon" class="w-8 h-8" />
        </NuxtLink>
      </template>
      <NotificationBell :new="notif" />
      <NuxtLink to="/compte" class="flex items-center justify-center">
        <div
          class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="authStore.user?.profilePicture"
            :src="authStore.user.profilePicture"
            class="object-cover w-full h-full rounded-full"
            alt="Photo de profil"
          />
          <img
            v-else
            src="/icons/account.svg"
            alt="Icône compte"
            class="w-8 h-8"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notif: Boolean,
});

import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
// reactive flag for admin status
const isAdmin = computed(() => authStore.user?.admin);

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
