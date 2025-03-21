import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await $fetch("/api/auth/login", {
          method: "POST",
          body: credentials,
        });

        this.token = response.token;

        // Stocker le token dans localStorage seulement côté client
        if (process.client) {
          localStorage.setItem("auth_token", response.token);
        }

        // Chercher les infos utilisateur
        await this.fetchUser();

        return true;
      } catch (error) {
        console.error("Erreur de connexion:", error);
        return false;
      }
    },

    async fetchUser() {
      try {
        const user = await $fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = user;
        return user;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur:",
          error
        );
        this.logout();
        return null;
      }
    },

    async updateProfile(profileData) {
      try {
        const response = await $fetch("/api/auth/update-profile", {
          method: "POST",
          body: profileData,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.status === "success" && response.user) {
          this.user = response.user;
        }

        return response;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem("auth_token");
      }
    },

    initAuth() {
      if (process.client) {
        const token = localStorage.getItem("auth_token");
        if (token) {
          this.token = token;
        }
      }
    },
  },
});
