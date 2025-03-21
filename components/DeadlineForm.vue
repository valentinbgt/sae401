<template>
  <form
    @submit.prevent="submitForm"
    class="w-full max-w-xl mr-auto rounded-lg space-y-6"
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <label for="title" class="block font-semibold">Nom du rendu</label>
        <input
          type="text"
          id="title"
          v-model="formData.titre"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label for="lieu" class="block font-semibold">Lieu de rendu</label>
        <select
          id="lieu"
          v-model="formData.lieu"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          @change="updateLieuDetailsPlaceholder"
        >
          <option value="">Choisir</option>
          <option value="Moodle">Moodle</option>
          <option value="Email">Email</option>
          <option value="Oral">Oral</option>
          <option value="Partiel">Partiel</option>
        </select>
      </div>
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
          <option
            v-for="teacher in teachers"
            :key="teacher.id"
            :value="`${teacher.prenom} ${teacher.nom}`"
          >
            {{ teacher.prenom }} {{ teacher.nom }}
          </option>
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

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="lieu" class="block font-semibold">Lieu de rendu</label>
        <select
          id="lieu"
          v-model="formData.lieu"
          required
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          @change="updateLieuDetailsPlaceholder"
        >
          <option value="">Choisir</option>
          <option value="Moodle">Moodle</option>
          <option value="Email">Email</option>
          <option value="Oral">Oral</option>
          <option value="Partiel">Partiel</option>
        </select>
      </div>
      <div v-if="formData.lieu">
        <label for="lieuDetails" class="block font-semibold">{{
          lieuDetailsLabel
        }}</label>
        <input
          type="text"
          id="lieuDetails"
          v-model="formData.lieuDetails"
          :placeholder="lieuDetailsPlaceholder"
          class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        />
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
      class="w-full p-3 text-white bg-indigo-500 cursor-pointer font-semibold rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
    >
      Ajouter un rendu
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  module: "",
  titre: "",
  timestamp: "",
  type: "",
  lieu: "",
  lieuDetails: "",
  prof: "",
  description: "",
  etendue: "TP",
});

const modules = ref([]);
const teachers = ref([]);
const lieuDetailsLabel = ref("Détails du lieu");
const lieuDetailsPlaceholder = ref("");

const updateLieuDetailsPlaceholder = () => {
  switch (formData.value.lieu) {
    case "Moodle":
      lieuDetailsLabel.value = "Lien Moodle";
      lieuDetailsPlaceholder.value = "https://moodle.iutmmi.fr/...";
      break;
    case "Email":
      lieuDetailsLabel.value = "Adresse email";
      lieuDetailsPlaceholder.value = "example@example.com";
      break;
    case "Oral":
      lieuDetailsLabel.value = "Salle";
      lieuDetailsPlaceholder.value = "Numéro de salle ou lieu";
      break;
    case "Partiel":
      lieuDetailsLabel.value = "Informations";
      lieuDetailsPlaceholder.value = "Détails sur le partiel";
      break;
    default:
      lieuDetailsLabel.value = "Détails du lieu";
      lieuDetailsPlaceholder.value = "";
  }
};

onMounted(async () => {
  try {
    // Fetch modules
    const modulesResponse = await $fetch("/api/modules", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (modulesResponse.status === "success") {
      modules.value = modulesResponse.data;
    }

    // Fetch teachers
    const teachersResponse = await $fetch("/api/users/teachers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (teachersResponse.status === "success") {
      teachers.value = teachersResponse.data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
});

const submitForm = async () => {
  // Vérifier si l'utilisateur est connecté
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion
    router.push("/compte/connexion");
    return;
  }

  try {
    // Création de la deadline avec le token d'authentification
    const response = await $fetch("/api/deadlines", {
      method: "POST",
      body: formData.value,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.status === "success") {
      // Redirection vers la liste des deadlines
      router.push("/dates");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire:", error);
    // TODO: Afficher un message d'erreur à l'utilisateur
  }
};
</script>
