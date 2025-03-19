<template>
  <form @submit.prevent="submitSignup" class="w-full">
    <div class="mx-14">
      <h2 class="font-bold text-4xl mb-10">Inscription</h2>
      <form @submit.prevent="submitSignup" class="w-full">
        <div class="space-y-10">

          <div class="flex justify-between">
            <div class="flex flex-col w-60" >
              <label class="font-bold" for="prenom">Prénom</label>
              <input class="border rounded-lg py-0.5 p-2" type="text" id="prenom" v-model="formData.prenom" required />
            </div>

            <div class="flex flex-col w-60 ">
              <label class="font-bold" for="nom">Nom</label>
              <input class="border rounded-lg py-0.5 p-2" type="text" id="nom" v-model="formData.nom" required />
            </div>
          </div>

          <div class="flex flex-col w-full">
            <label class="font-bold" for="email">Email</label>
            <input class="border rounded-lg py-0.5 p-2" type="email" id="email" v-model="formData.email" required />
          </div>

          <div class="flex flex-col w-full">
            <label class="font-bold" for="password">Mot de passe</label>
            <input
                type="password"
                id="password"
                v-model="formData.password"
                required
                class="border rounded-lg py-0.5 p-2"
            />
          </div>

          <div v-if="error" class="text-red-500">
            {{ error }}
          </div>

          <button class="border w-full bg-indigo-500 text-white rounded-lg py-1 cursor-pointer" type="submit" :disabled="loading">
            {{ loading ? "Inscription en cours..." : "S'inscrire" }}
          </button>
        </div>
        <div class="mt-4">Déjà un compte ? <NuxtLink class="font-bold" to="connexion">Se connecter</NuxtLink></div>
      </form>
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
