<template>
  <form @submit.prevent="submitLogin" class="w-full">
    <div class="space-y-4">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" required />
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
        />
      </div>

      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Connexion en cours..." : "Se connecter" }}
      </button>
    </div>
    <div>Pas de compte ? <NuxtLink to="inscription">S'inscrire</NuxtLink></div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

const submitLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const success = await authStore.login(formData.value);

    if (success) {
      router.push("/");
    } else {
      error.value = "Identifiants incorrects";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    error.value = "Une erreur s'est produite lors de la connexion";
  } finally {
    loading.value = false;
  }
};
</script>
