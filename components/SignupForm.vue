<template>
  <h2>Inscripton</h2>
  <form @submit.prevent="submitSignup" class="w-full">
    <div class="space-y-4">

      <div class="flex">
        <div class="flex flex-col w-30" >
          <label class="font-bold" for="prenom">Prénom</label>
          <input class="border rounded-lg" type="text" id="prenom" v-model="formData.prenom" required />
        </div>

        <div class="flex flex-col w-30">
          <label class="font-bold" for="nom">Nom</label>
          <input class="border rounded-lg" type="text" id="nom" v-model="formData.nom" required />
        </div>
      </div>

      <div>
        <label class="font-bold" for="email">Email</label>
        <input class="border rounded-lg" type="email" id="email" v-model="formData.email" required />
      </div>

      <div>
        <label class="font-bold" for="password">Mot de passe</label>
        <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            class="border rounded-lg"
        />
      </div>

      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Inscription en cours..." : "S'inscrire" }}
      </button>
    </div>
    <div>Déjà un compte ? <NuxtLink to="connexion">Se connecter</NuxtLink></div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  nom: "",
  prenom: "",
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

const submitSignup = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await $fetch("/api/auth/signup", {
      method: "POST",
      body: formData.value,
    });

    if (response?.status == "success") {
      const success = await authStore.login(formData.value);

      if (success) {
        router.push("/");
      } else {
        router.push("/compte/connexion");
      }
    } else {
      error.value = "Echec de l'inscription";
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
