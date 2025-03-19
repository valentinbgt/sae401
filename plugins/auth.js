import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(({ $pinia }) => {
  // Initialiser l'authentification au démarrage, mais seulement côté client
  if (process.client) {
    const authStore = useAuthStore();
    authStore.initAuth();
  }
});
