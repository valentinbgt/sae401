<template>
  <TopNav :notif="true">Utilisateur</TopNav>
  <NuxtLink to="compte/connexion"> Se connecter </NuxtLink>
  <br />
  <NuxtLink to="compte/inscription"> S'inscrire </NuxtLink>
  <br />
  <button @click="logout">Se déconnecter</button>
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
