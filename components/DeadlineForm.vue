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
        <div class="relative">
          <input
            id="lieu"
            v-model="formData.lieu"
            required
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            @focus="showLieuOptions = true"
            @blur="setTimeout(() => (showLieuOptions = false), 200)"
            @input="updateLieuDetailsPlaceholder"
            type="text"
            autocomplete="off"
          />
          <div
            v-if="showLieuOptions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="lieu in filteredLieux"
              :key="lieu"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown="
                formData.lieu = lieu;
                updateLieuDetailsPlaceholder();
              "
            >
              {{ lieu }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label for="module" class="block font-semibold">Module</label>
        <div class="relative">
          <input
            id="module"
            v-model="formData.module"
            required
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            @focus="showModuleOptions = true"
            @blur="setTimeout(() => (showModuleOptions = false), 200)"
            type="text"
            autocomplete="off"
          />
          <div
            v-if="showModuleOptions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="module in filteredModules"
              :key="module.code"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown="formData.module = module.code"
            >
              {{ module.code }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label for="format" class="block font-semibold">Format</label>
        <div class="relative">
          <input
            id="format"
            v-model="formData.type"
            required
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            @focus="showFormatOptions = true"
            @blur="setTimeout(() => (showFormatOptions = false), 200)"
            type="text"
            autocomplete="off"
          />
          <div
            v-if="showFormatOptions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="format in filteredFormats"
              :key="format"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown="formData.type = format"
            >
              {{ format }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label for="prof" class="block font-semibold">Enseignant</label>
        <div class="relative">
          <input
            id="prof"
            v-model="formData.prof"
            required
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            @focus="showTeacherOptions = true"
            @blur="setTimeout(() => (showTeacherOptions = false), 200)"
            type="text"
            autocomplete="off"
          />
          <div
            v-if="showTeacherOptions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="teacher in filteredTeachers"
              :key="teacher.id"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown="formData.prof = `${teacher.prenom} ${teacher.nom}`"
            >
              {{ teacher.prenom }} {{ teacher.nom }}
            </div>
          </div>
        </div>
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
import { ref, onMounted, computed } from "vue";
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

const showModuleOptions = ref(false);
const showFormatOptions = ref(false);
const showTeacherOptions = ref(false);
const showLieuOptions = ref(false);

const filteredModules = computed(() => {
  if (!formData.value.module) return modules.value;
  return modules.value.filter((module) =>
    module.code.toLowerCase().includes(formData.value.module.toLowerCase())
  );
});

const filteredFormats = computed(() => {
  const formats = ["pdf", "jpg", "png", "doc/docx", "ppt/pptx", "zip", "autre"];
  if (!formData.value.type) return formats;
  return formats.filter((format) =>
    format.toLowerCase().includes(formData.value.type.toLowerCase())
  );
});

const filteredTeachers = computed(() => {
  if (!formData.value.prof) return teachers.value;
  return teachers.value.filter((teacher) =>
    `${teacher.prenom} ${teacher.nom}`
      .toLowerCase()
      .includes(formData.value.prof.toLowerCase())
  );
});

const filteredLieux = computed(() => {
  const lieux = ["Moodle", "Email", "Oral", "Partiel"];
  if (!formData.value.lieu) return lieux;
  return lieux.filter((lieu) =>
    lieu.toLowerCase().includes(formData.value.lieu.toLowerCase())
  );
});

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
