<template>
  <nav class="bg-indigo-500 w-56 h-screen flex flex-col items-center p-6">
    <NuxtLink to="/" class="mb-5 mt-4"
      ><img src="/logo.svg" alt="Logo du cahier de texte" class="w-24"
    /></NuxtLink>

    <NuxtLink
      to="/"
      class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >Dashboard</NuxtLink
    >
    <NuxtLink
      to="/dates"
      class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >Mes dates</NuxtLink
    >
    <NuxtLink
      to="/ics"
      class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >Synchroniser un calendrier</NuxtLink
    >

    <div class="mt-auto text-white text-center">
      <template v-if="authStore.isAuthenticated">
        <span class="block mb-2"
          >Connecté en tant que {{ authStore.user?.prenom }}
          {{ authStore.user?.nom }}</span
        >
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Se déconnecter
        </button>
      </template>
      <template v-else>
        <span class="block mb-2">Vous n'êtes pas connecté</span>
        <div class="space-x-2">
          <NuxtLink
            to="/compte/connexion"
            class="bg-white text-indigo-500 hover:bg-gray-100 px-4 py-2 rounded"
          >
            Connexion
          </NuxtLink>
          <NuxtLink
            to="/compte/inscription"
            class="bg-white text-indigo-500 hover:bg-gray-100 px-4 py-2 rounded"
          >
            Inscription
          </NuxtLink>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
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
