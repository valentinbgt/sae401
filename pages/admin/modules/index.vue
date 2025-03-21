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

    <!-- Search and filter section -->
    <div class="bg-white p-4 mb-6 rounded shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search bar -->
        <div>
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Rechercher</label
          >
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            placeholder="Rechercher par code ou titre..."
            class="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Semester filter -->
        <div>
          <label
            for="semestre"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Filtrer par semestre</label
          >
          <select
            id="semestre"
            v-model="semestreFilter"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">Tous les semestres</option>
            <option value="1">S1</option>
            <option value="2">S2</option>
            <option value="3">S3</option>
            <option value="4">S4</option>
            <option value="5">S5</option>
            <option value="6">S6</option>
          </select>
        </div>

        <!-- WR/WS filter -->
        <div>
          <label
            for="moduleType"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Filtrer par type</label
          >
          <select
            id="moduleType"
            v-model="moduleTypeFilter"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">Tous les types</option>
            <option value="WR">WR</option>
            <option value="WS">WS</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <LoadingOverlay />
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    <div v-else class="overflow-x-auto">
      <div
        v-if="filteredModules.length === 0"
        class="text-center py-8 text-gray-500"
      >
        Aucun module ne correspond aux critères de recherche
      </div>
      <table v-else class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th
              @click="sortBy('id')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              ID
              <span v-if="sortColumn === 'id'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              @click="sortBy('code')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Code
              <span v-if="sortColumn === 'code'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              @click="sortBy('titre')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Titre
              <span v-if="sortColumn === 'titre'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              @click="sortBy('semestre')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Semestre
              <span v-if="sortColumn === 'semestre'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th class="py-2 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="module in filteredModules"
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
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const modules = ref([]);
const loading = ref(true);
const error = ref("");

// Search and filter state
const searchQuery = ref("");
const semestreFilter = ref("all");
const moduleTypeFilter = ref("all");

// Sorting state
const sortColumn = ref("code");
const sortDirection = ref("asc");

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

// Helper function to determine if a module is WR or WS based on its code
const getModuleType = (code) => {
  if (!code) return "";
  return code.startsWith("WR") ? "WR" : code.startsWith("WS") ? "WS" : "";
};

// Computed property for filtered and sorted modules
const filteredModules = computed(() => {
  return modules.value
    .filter((module) => {
      // Filter by search query (case insensitive)
      const matchesSearch =
        !searchQuery.value ||
        module.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        module.titre.toLowerCase().includes(searchQuery.value.toLowerCase());

      // Filter by semester
      const matchesSemestre =
        semestreFilter.value === "all" ||
        module.semestre.toString() === semestreFilter.value;

      // Filter by module type (WR/WS)
      const moduleType = getModuleType(module.code);
      const matchesType =
        moduleTypeFilter.value === "all" ||
        moduleType === moduleTypeFilter.value;

      return matchesSearch && matchesSemestre && matchesType;
    })
    .sort((a, b) => {
      // Sort by the selected column
      if (sortColumn.value === "id") {
        return sortDirection.value === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortColumn.value === "semestre") {
        return sortDirection.value === "asc"
          ? a.semestre - b.semestre
          : b.semestre - a.semestre;
      } else {
        // For string columns (code, titre)
        const aValue = a[sortColumn.value]?.toLowerCase() || "";
        const bValue = b[sortColumn.value]?.toLowerCase() || "";
        return sortDirection.value === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });
});

// Function to change the sort column and direction
const sortBy = (column) => {
  if (sortColumn.value === column) {
    // If already sorting by this column, toggle direction
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // If sorting by a new column, default to ascending
    sortColumn.value = column;
    sortDirection.value = "asc";
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
