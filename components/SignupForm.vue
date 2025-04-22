<template>
  <form @submit.prevent="submitSignup" class="w-full">
    <div class="mx-14">
      <div class="space-y-10">
        <!-- Ligne pour Prénom et Nom -->
        <div class="flex flex-col md:flex-row w-full md:justify-between md:space-x-6">
          <div class="flex flex-col w-full md:w-1/2">
            <label class="font-bold" for="prenom">Prénom</label>
            <input
              class="border rounded-lg py-2 px-2"
              type="text"
              id="prenom"
              v-model="formData.prenom"
              required
            />
          </div>

          <div class="flex flex-col w-full md:w-1/2 mt-4 md:mt-0">
            <label class="font-bold" for="nom">Nom</label>
            <input
              class="border rounded-lg py-2 px-2"
              type="text"
              id="nom"
              v-model="formData.nom"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex flex-col w-full">
          <label class="font-bold" for="email">Email</label>
          <input
            class="border rounded-lg py-2 px-2"
            type="email"
            id="email"
            v-model="formData.email"
            required
          />
        </div>

        <!-- Mot de passe -->
        <div class="flex flex-col w-full">
          <label class="font-bold" for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            class="border rounded-lg py-2 px-2"
          />
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="text-red-500">
          {{ error }}
        </div>

        <!-- Bouton d'inscription -->
        <button
          class="border w-full bg-indigo-500 text-white rounded-lg py-3 cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Inscription en cours..." : "S'inscrire" }}
        </button>
      </div>

      <!-- Lien vers la connexion -->
      <div class="mt-4 text-center">
        Déjà un compte ?
        <NuxtLink
          class="underline text-indigo-500 font-semibold"
          to="connexion"
          >Se connecter</NuxtLink
        >
      </div>
    </div>
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

const submitSignup = async () => {
  try {
    const response = await $fetch("/api/auth/signup", {
      method: "POST",
      body: formData.value,
    });
    console.log("Inscription réussie:", response);
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
  }
};
</script>
