<template>
  <div class="my-10 h-12 flex items-center justify-between w-full">
    <h1 class="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ml-10 md:ml-0">
      <slot />
    </h1>

    <div class="flex flex-col-reverse sm:flex-row sm:items-center">
      <div class="flex justify-center sm:justify-end">
        <NuxtLink to="/admin" class="pr-2 sm:pr-0 pl-4 sm:pl-0 sm:pr-4">
          <img src="/icons/admin.svg" />
        </NuxtLink>
        <NotificationBell :new="notif" />
      </div>

      <template v-if="authStore.isAuthenticated">
        <NuxtLink to="/compte" class="pt-2 sm:pt-0 sm:pl-4 flex items-center justify-center">
          <div class="w-[38px] h-[38px] rounded-full overflow-hidden flex items-center justify-center">
            <img
                v-if="authStore.user?.profilePicture"
                :src="authStore.user.profilePicture"
                class="object-cover w-full h-full rounded-full"
                alt="Photo de profil"
            />
            <img v-else src="/icons/account.svg" alt="Icône compte" />
          </div>
          <span class="text-lg font-medium pl-2">{{ authStore.user?.prenom }}</span>
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
            to="/compte/connexion"
            class="text-lg font-medium pt-2 sm:pt-0 sm:pl-4 flex items-center justify-center"
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
