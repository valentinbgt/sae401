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
