<template>

  <form @submit.prevent="submitForm" class="w-full max-w-lg mr-auto  rounded-lg space-y-6">
    <div>
      <label for="title" class="block font-semibold">Nom du rendu</label>
      <input type="text" id="title" v-model="formData.titre" required
             class="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label for="module" class="block font-semibold">Module</label>
        <select id="module" v-model="formData.module" required
                class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
          <option value="">wr407</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label for="module" class="block font-semibold">Format</label>
        <select id="module" v-model="formData.module" required
                class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
          <option value="">pdf</option>
          <option value="">jpg</option>
          <option value="">png</option>
          <option value="">doc/docx</option>
          <option value="">ppt/pptx</option>
          <option value="">zip</option>
          <option value="">jpg</option>

          <option value="autre">autre</option>

        </select>
      </div>

      <div>
        <label for="prof" class="block font-semibold">Enseignant</label>
        <select id="prof" v-model="formData.prof" required
                class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
          <option value="">Choisir</option>
          <option value="prof1">Professeur 1</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <label for="timestamp" class="block font-semibold">Date et heure limite</label>
        <input type="datetime-local" id="timestamp" v-model="formData.timestamp" required
               class="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
      </div>

      <div>
        <label for="tp" class="block font-semibold">Étendu</label>
        <select id="tp" v-model="formData.etendue" required
                class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
          <option value="TP">TP</option>
          <option value="TD">TD</option>
          <option value="CM">CM</option>
        </select>
      </div>
    </div>



    <div>
      <label for="description" class="block font-semibold">Détail</label>
      <textarea id="description" v-model="formData.description"
                class="w-full mt-1 p-2 border border-gray-300 rounded-lg h-32"></textarea>
    </div>

    <button type="submit" class="w-full p-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">
      Ajouter un rendu
    </button>
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
