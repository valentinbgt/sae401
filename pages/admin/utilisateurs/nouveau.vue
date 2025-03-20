<template>
  <TopNav :notif="true">Ajouter un utilisateur</TopNav>
  <div class="max-w-2xl mx-auto p-4">
    <form @submit.prevent="submitForm" class="w-full space-y-6">
      <h1 class="text-2xl font-bold mb-6">Création d'un nouvel utilisateur</h1>

      <!-- Informations personnelles -->
      <div class="space-y-4">
        <div>
          <label for="nom" class="block text-sm font-medium text-gray-700"
            >Nom</label
          >
          <input
            type="text"
            id="nom"
            v-model="formData.nom"
            required
            placeholder="Nom de famille"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="prenom" class="block text-sm font-medium text-gray-700"
            >Prénom</label
          >
          <input
            type="text"
            id="prenom"
            v-model="formData.prenom"
            required
            placeholder="Prénom"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="email@exemple.com"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            placeholder="Mot de passe"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Rôles et informations académiques -->
      <div class="space-y-4 pt-4 border-t border-gray-200">
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Rôle</label
          >
          <div class="flex gap-4">
            <div class="flex items-center">
              <input
                type="radio"
                id="roleEtudiant"
                name="role"
                value="etudiant"
                v-model="selectedRole"
                class="h-4 w-4 text-indigo-600"
              />
              <label for="roleEtudiant" class="ml-2 block text-sm text-gray-700"
                >Étudiant</label
              >
            </div>

            <div class="flex items-center">
              <input
                type="radio"
                id="roleProf"
                name="role"
                value="prof"
                v-model="selectedRole"
                class="h-4 w-4 text-indigo-600"
              />
              <label for="roleProf" class="ml-2 block text-sm text-gray-700"
                >Professeur</label
              >
            </div>

            <div class="flex items-center">
              <input
                type="radio"
                id="roleAdmin"
                name="role"
                value="admin"
                v-model="selectedRole"
                class="h-4 w-4 text-indigo-600"
              />
              <label for="roleAdmin" class="ml-2 block text-sm text-gray-700"
                >Administrateur</label
              >
            </div>
          </div>
        </div>

        <div v-if="selectedRole === 'etudiant'">
          <label for="semestre" class="block text-sm font-medium text-gray-700"
            >Semestre</label
          >
          <select
            id="semestre"
            v-model="formData.semestre"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Sélectionnez un semestre</option>
            <option v-for="n in 6" :key="n" :value="n">S{{ n }}</option>
          </select>
        </div>
      </div>

      <!-- Erreur et bouton de soumission -->
      <div v-if="error" class="text-red-500 text-sm py-2">
        {{ error }}
      </div>

      <div class="flex justify-between pt-4">
        <NuxtLink
          to="/admin/utilisateurs"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        >
          Annuler
        </NuxtLink>

        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          :disabled="loading"
        >
          {{ loading ? "Création en cours..." : "Créer l'utilisateur" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const formData = ref({
  nom: "",
  prenom: "",
  email: "",
  password: "",
  semestre: "",
  prof: false,
  admin: false,
});

const selectedRole = ref("etudiant");
const loading = ref(false);
const error = ref("");

onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.user?.admin) {
    error.value = "Vous devez être administrateur pour accéder à cette page";
    loading.value = false;
  }
});

// Watch pour mettre à jour les rôles en fonction de la sélection
watch(selectedRole, (newRole) => {
  formData.value.prof = newRole === "prof" || newRole === "admin";
  formData.value.admin = newRole === "admin";

  // Réinitialise le semestre si l'utilisateur n'est pas un étudiant
  if (newRole !== "etudiant") {
    formData.value.semestre = null;
  }
});

const checkDuplicateEmail = async () => {
  try {
    const response = await $fetch("/api/users/check-duplicate", {
      method: "POST",
      body: {
        email: formData.value.email,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    return response.exists;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'email:", err);
    throw err;
  }
};

const submitForm = async () => {
  if (!authStore.isAuthenticated) {
    error.value = "Vous devez être connecté pour créer un utilisateur";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Vérification des doublons d'email
    const emailExists = await checkDuplicateEmail();
    if (emailExists) {
      error.value = "Un utilisateur avec cette adresse email existe déjà";
      loading.value = false;
      return;
    }

    // Création de l'utilisateur
    const response = await $fetch("/api/users", {
      method: "POST",
      body: formData.value,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.status === "success") {
      router.push("/admin/utilisateurs");
    } else {
      error.value =
        response.message || "Erreur lors de la création de l'utilisateur";
    }
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    error.value =
      "Une erreur est survenue lors de la création de l'utilisateur";
  } finally {
    loading.value = false;
  }
};
</script>
