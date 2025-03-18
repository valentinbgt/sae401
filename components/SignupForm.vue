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

      <button type="submit">S'inscrire</button>
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
