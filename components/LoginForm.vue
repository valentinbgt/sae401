<template>
  <form @submit.prevent="submitLogin" class="w-full">
    <div class="p-4">
      <div class="space-y-10">
        <div>
          <label for="email" class="font-bold">
            Adresse mail universitaire
          </label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="w-full py-2 p-2 border rounded-lg mb-4"
          />
        </div>
        <div>
          <label for="password" class="font-bold"> Mot de passe </label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            class="w-full py-2 p-2 border rounded-lg mb-4"
          />
        </div>
        <div v-if="error" class="text-red-500">
          {{ error }}
        </div>
        <button
          class="cursor-pointer w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Connexion en cours..." : "Se connecter" }}
        </button>
      </div>
      <div class="p-4 text-center">
        Vous n’avez pas de compte ?
        <NuxtLink
          class="underline text-indigo-500 font-semibold"
          to="/compte/inscription"
        >
          Créer un compte
        </NuxtLink>
      </div>
    </div>
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
