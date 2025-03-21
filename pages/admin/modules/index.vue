<template>
  <TopNav :notif="true">Gestion des Modules</TopNav>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Liste des modules</h1>
      <NuxtLink
        to="modules/nouveau"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Ajouter un module
      </NuxtLink>
    </div>
    <div v-if="loading" class="text-center py-8">
      <LoadingOverlay />
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border text-left">ID</th>
            <th class="py-2 px-4 border text-left">Code</th>
            <th class="py-2 px-4 border text-left">Titre</th>
            <th class="py-2 px-4 border text-left">Semestre</th>
            <th class="py-2 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="module in modules"
            :key="module.id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border">{{ module.id }}</td>
            <td class="py-2 px-4 border">{{ module.code }}</td>
            <td class="py-2 px-4 border">{{ module.titre }}</td>
            <td class="py-2 px-4 border">S{{ module.semestre }}</td>
            <td class="py-2 px-4 border">
              <button
                @click="deleteModule(module.id)"
                class="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const modules = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    error.value = "Vous devez être connecté pour accéder à cette page";
    loading.value = false;
    return;
  }
  await fetchModules();
});

const fetchModules = async () => {
  loading.value = true;
  error.value = "";
  try {
    // Using the admin API endpoint instead of the regular modules endpoint
    const response = await $fetch("/api/admin/modules", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.status === "success") {
      modules.value = response.data;
    } else {
      error.value = "Erreur lors de la récupération des modules";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des modules:", err);
    error.value = "Une erreur est survenue lors de la récupération des modules";
  } finally {
    loading.value = false;
  }
};

const deleteModule = async (moduleId) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) return;
  try {
    // Using the admin API endpoint for deletion
    const response = await $fetch(`/api/admin/modules/${moduleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.status === "success") {
      await fetchModules(); // Refresh the list
    } else {
      error.value = "Erreur lors de la suppression du module";
    }
  } catch (err) {
    console.error("Erreur lors de la suppression du module:", err);
    if (err.data && err.data.message) {
      error.value = err.data.message;
    } else {
      error.value = "Une erreur est survenue lors de la suppression du module";
    }
  }
};
</script>
