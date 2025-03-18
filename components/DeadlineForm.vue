<template>
  <form @submit.prevent="submitForm" class="w-full">
    <div class="space-y-4">
      <div>
        <label for="module">Module</label>
        <select id="module" v-model="formData.module" required>
          <option value="">Sélectionner un module</option>
          <option value="autre">Autre</option>
          <!-- À remplir avec les modules depuis l'API -->
        </select>
      </div>

      <div>
        <label for="title">Titre</label>
        <input type="text" id="title" v-model="formData.titre" required />
      </div>

      <div>
        <label for="timestamp">Date et heure limite</label>
        <input
          type="datetime-local"
          id="timestamp"
          v-model="formData.timestamp"
          required
        />
      </div>

      <div>
        <label for="type">Format de rendu</label>
        <input type="text" id="type" v-model="formData.type" required />
      </div>

      <div>
        <label for="lieu">Lieu de rendu</label>
        <input type="text" id="lieu" v-model="formData.lieu" required />
      </div>

      <div>
        <label for="prof">Enseignant référent</label>
        <input type="text" id="prof" v-model="formData.prof" required />
      </div>

      <div>
        <label for="description">Description/Sujet (optionnel)</label>
        <textarea id="description" v-model="formData.description"></textarea>
      </div>

      <div>
        <label for="etendue">Étendue</label>
        <select id="etendue" v-model="formData.etendue" required>
          <option value="TP">TP</option>
          <option value="TD">TD</option>
          <option value="CM">CM</option>
        </select>
      </div>

      <button type="submit">Ajouter la deadline</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  module: "",
  titre: "",
  timestamp: "",
  type: "",
  lieu: "",
  prof: "",
  description: "",
  etendue: "TP",
});

const submitForm = async () => {
  try {
    // Check les doublons
    /*     const duplicateCheck = await $fetch("/api/deadlines/check-duplicate", {
      method: "POST",
      body: {
        module: formData.value.module,
        timestamp: formData.value.timestamp,
        etendue: formData.value.etendue,
      },
    });

    console.log(duplicateCheck);

    if (duplicateCheck.exists) {
      // TODO: Afficher une modal avec les 3 options
      console.log("Deadline similaire trouvée:", duplicateCheck.deadline);
      return;
    } */

    // Création de la deadline
    const response = await $fetch("/api/deadlines", {
      method: "POST",
      body: formData.value,
    });

    console.log("Deadline créée avec succès:", response);
    // TODO: Rediriger vers la page des deadlines ou afficher un message de succès
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire:", error);
    // TODO: Afficher un message d'erreur à l'utilisateur
  }
};
</script>
