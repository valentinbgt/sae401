<template>

  <div class="absolute z-10 bottom-9 -right-10">
    <img
        src="../../../assets/images/logo_agenda.svg"
        alt="logo-agenda"
        class="w-100"
    />
  </div>

  <TopNav :notif="true">Ajouter un module</TopNav>
  <div class="w-full max-w-lg bg-white rounded-lg space-y-6">
    <form @submit.prevent="submitForm" class="w-full space-y-6">
      <div>
        <label for="type" class="block font-semibold">Type</label>
        <select
            id="type"
            v-model="formData.type"
            @change="updateForm"
            required
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
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
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
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
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        >
          <option
              v-if="formData.type && formData.semestre"
              v-for="n in 20"
              :key="n"
              :value="n"
          >
            {{ formData.type }}{{ formData.semestre }}{{ String(n).padStart(2, "0") }}
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
            class="w-full mt-1 p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div v-if="moduleCode && formData.titre" class="p-3 bg-gray-100 rounded-lg">
        Vous êtes sur le point d'ajouter : <strong>{{ moduleCode }} - {{ formData.titre }}</strong>
      </div>

      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <button
          type="submit"
          class="hover:cursor-pointer w-full p-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          :disabled="loading || !(moduleCode && formData.titre)"
      >
        {{ loading ? "Création en cours..." : "Ajouter le module" }}
      </button>
    </form>
  </div>
</template>


<script setup>
import { ref, computed } from "vue";

const formData = ref({
  type: "",
  semestre: null,
  number: null,
  titre: "",
});

const loading = ref(false);
const error = ref("");
const router = useRouter();

// Computed property pour générer automatiquement le code
const moduleCode = computed(() => {
  if (formData.value.type && formData.value.semestre && formData.value.number) {
    return (
      formData.value.type +
      formData.value.semestre +
      String(formData.value.number).padStart(2, "0")
    );
  }
  return "";
});

const updateForm = () => {
  console.log("Update form");
};

const submitForm = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Vérification des doublons
    const duplicateCheck = await $fetch("/api/modules/check-duplicate", {
      method: "POST",
      body: {
        code: moduleCode.value,
      },
    });

    if (duplicateCheck.exists) {
      error.value = `Un module avec le code ${moduleCode.value} existe déjà`;
      loading.value = false;
      return;
    }

    // Création du module
    const response = await $fetch("/api/modules", {
      method: "POST",
      body: {
        ...formData.value,
        code: moduleCode.value,
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
