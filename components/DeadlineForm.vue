<template>
  <form
    @submit.prevent="submitForm"
    class="w-full max-w-lg mr-auto rounded-lg space-y-6"
  >
    <div>
      <label for="title" class="block font-semibold">Nom du rendu</label>
      <input
        type="text"
        id="title"
        v-model="formData.titre"
        required
        class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
      />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label for="module" class="block font-semibold">Module</label>
        <select
          id="module"
          v-model="formData.module"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choisir</option>
          <option
            v-for="module in modules"
            :key="module.code"
            :value="module.code"
          >
            {{ module.code }}
          </option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label for="format" class="block font-semibold">Format</label>
        <select
          id="format"
          v-model="formData.type"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option value="pdf">pdf</option>
          <option value="jpg">jpg</option>
          <option value="png">png</option>
          <option value="doc/docx">doc/docx</option>
          <option value="ppt/pptx">ppt/pptx</option>
          <option value="zip">zip</option>
          <option value="autre">autre</option>
        </select>
      </div>

      <div>
        <label for="prof" class="block font-semibold">Enseignant</label>
        <select
          id="prof"
          v-model="formData.prof"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choisir</option>
          <option value="prof1">Professeur 1</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <label for="timestamp" class="block font-semibold"
          >Date et heure limite</label
        >
        <input
          type="datetime-local"
          id="timestamp"
          v-model="formData.timestamp"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label for="tp" class="block font-semibold">Étendue</label>
        <select
          id="tp"
          v-model="formData.etendue"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option value="TP">TP</option>
          <option value="TD">TD</option>
          <option value="CM">CM</option>
        </select>
      </div>
    </div>

    <div>
      <label for="description" class="block font-semibold">Sujet</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="w-full mt-1 p-2 border border-gray-300 rounded-lg h-32"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full p-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
    >
      Ajouter un rendu
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

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

const modules = ref([]);

onMounted(async () => {
  try {
    const response = await $fetch("/api/modules");
    if (response.status === "success") {
      modules.value = response.data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
  }
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
