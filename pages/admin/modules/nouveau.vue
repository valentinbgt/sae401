<template>
  <ImageLogoBackground />
  <TopNav :notif="true">Ajouter un module</TopNav>
    <form @submit.prevent="submitForm"
          class="w-full md:w-3/4 mr-auto rounded-lg space-y-6"
    >
      <div>
        <label for="type" class="block font-semibold">Type</label>
        <select
          id="type"
          v-model="formData.type"
          @change="updateForm"
          required
          class="w-full mt-1 p-2 border bg-white border-gray-300 rounded-lg"
        >
          <option value="WR">WR</option>
          <option value="WS">WS</option>
        </select>
      </div>

      <div>
        <label for="semestre" class="block font-semibold">Semestre</label>
        <select
          id="semestre"
          v-model="formData.semestre"
          @change="updateForm"
          required
          class="w-full mt-1 p-2 border bg-white border-gray-300 rounded-lg"
        >
          <option v-for="n in 6" :key="n" :value="n">S{{ n }}</option>
        </select>
      </div>

      <div>
        <label for="number" class="block font-semibold">Code du module</label>
        <select
          id="number"
          v-model="formData.number"
          @change="updateForm"
          required
          class="w-full mt-1 p-2 border bg-white border-gray-300 rounded-lg"
        >
          <option
            v-if="formData.type && formData.semestre"
            v-for="code in moduleCodes"
            :key="code"
            :value="code"
          >
            {{ code }}
          </option>
        </select>
      </div>

      <div>
        <label for="titre" class="block font-semibold">Intitulé</label>
        <input
          type="text"
          id="titre"
          v-model="formData.titre"
          required
          placeholder="Ex: Développement web"
          class="w-full mt-1 p-2 border bg-white border-gray-300 rounded-lg"
        />
      </div>

      <div
        v-if="formData.number && formData.titre"
        class="p-3 bg-gray-100 rounded-lg"
      >
        Vous êtes sur le point d'ajouter :
        <strong>{{ formData.number }} - {{ formData.titre }}</strong>
      </div>

      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <button
        type="submit"
        class="w-full sm:w-2/4 md:w-2/4 lg:w-2/4 xl:w-2/4 2xl:w-1/4 p-3 text-white bg-indigo-500 cursor-pointer font-semibold rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 mx-auto flex justify-center items-center"
        :disabled="loading || !(formData.number && formData.titre)"
      >
        {{ loading ? "Création en cours..." : "Ajouter le module" }}
      </button>
    </form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import ImageLogoBackground from "~/components/ImageLogoBackground.vue";

const authStore = useAuthStore();
const formData = ref({
  type: "",
  semestre: null,
  number: null,
  titre: "",
});

const loading = ref(false);
const error = ref("");
const router = useRouter();
const existingModules = ref([]);
const moduleCodes = ref([]);

const fetchExistingModules = async () => {
  try {
    const response = await $fetch("/api/modules/all", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.status === "success") {
      existingModules.value = response.data;
      console.log(response.data);
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des modules existants:", err);
    error.value = "Erreur lors de la récupération des modules existants";
  }
};

onMounted(async () => {
  await fetchExistingModules();
});

const updateForm = () => {
  moduleCodes.value = [];

  let existingModulesArray = [];
  existingModules.value.forEach((e) => {
    existingModulesArray.push(e.code);
  });

  if (formData.value.type && formData.value.semestre) {
    for (let n = 1; n <= 20; n++) {
      const code =
        formData.value.type +
        formData.value.semestre +
        String(n).padStart(2, "0");

      if (!existingModulesArray.includes(code)) {
        moduleCodes.value.push(code);
      }
    }
  }

  console.log(moduleCodes.value);
};

const submitForm = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Vérification des doublons
    const duplicateCheck = await $fetch("/api/modules/check-duplicate", {
      method: "POST",
      body: {
        code: formData.value.number,
      },
    });

    if (duplicateCheck.exists) {
      error.value = `Un module avec le code ${formData.value.number} existe déjà`;
      loading.value = false;
      return;
    }

    // Création du module
    const response = await $fetch("/api/modules", {
      method: "POST",
      body: {
        ...formData.value,
        code: formData.value.number,
      },
    });

    if (response.status === "success") {
      // Redirection vers la liste des modules ou affichage d'un message de succès
      router.push("/admin/modules");
    }
  } catch (err) {
    console.error("Erreur lors de l'ajout du module:", err);
    error.value = "Une erreur est survenue lors de la création du module";
  } finally {
    loading.value = false;
  }
};
</script>
