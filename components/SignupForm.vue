<template>
  <form @submit.prevent="submitSignup" class="w-full">
    <div class="space-y-4">
      <div>
        <label for="nom">Nom</label>
        <input type="text" id="nom" v-model="formData.nom" required />
      </div>

      <div>
        <label for="prenom">Prénom</label>
        <input type="text" id="prenom" v-model="formData.prenom" required />
      </div>

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
        {{ loading ? "Inscription en cours..." : "S'inscrire" }}
      </button>
    </div>
    <div>Déjà un compte ? <NuxtLink to="connexion">Se connecter</NuxtLink></div>
  </form>
</template>

<script setup>
import { ref } from "vue";

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

    router.push("/");
  } catch (error) {
    error.value = "Une erreur s'est produite lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
