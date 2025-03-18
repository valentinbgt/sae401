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

      <button type="submit">Se connecter</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  email: "",
  password: "",
});

const submitLogin = async () => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: formData.value,
    });
    console.log("Connexion réussie:", response);
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
  }
};
</script>
