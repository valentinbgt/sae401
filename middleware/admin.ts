import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  // If not authenticated or not an admin, redirect to home
  if (!authStore.isAuthenticated || !authStore.user?.admin) {
    return navigateTo("/");
  }
});
