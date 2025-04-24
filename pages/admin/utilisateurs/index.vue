<template>
  <TopNav :notif="true">Gestion des utilisateurs</TopNav>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Liste des utilisateurs</h1>
      <NuxtLink
        to="utilisateurs/nouveau"
        class="p-3 px-5 bg-indigo-500 font-semibold rounded-lg text-white cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400"
      >
        Ajouter un utilisateur
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
            placeholder="Rechercher par nom, prénom ou email..."
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
            <option value="none">Sans semestre</option>
          </select>
        </div>

        <!-- Role filter -->
        <div>
          <label
            for="roleFilter"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Filtrer par rôle</label
          >
          <select
            id="roleFilter"
            v-model="roleFilter"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="prof">Professeur</option>
            <option value="student">Étudiant</option>
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
        v-if="filteredUsers.length === 0"
        class="text-center py-8 text-gray-500"
      >
        Aucun utilisateur ne correspond aux critères de recherche
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
              @click="sortBy('nom')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Nom
              <span v-if="sortColumn === 'nom'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              @click="sortBy('prenom')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Prénom
              <span v-if="sortColumn === 'prenom'">{{
                sortDirection === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              @click="sortBy('email')"
              class="py-2 px-4 border text-left cursor-pointer"
            >
              Email
              <span v-if="sortColumn === 'email'">{{
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
            <th class="py-2 px-4 border text-left">Rôles</th>
            <th class="py-2 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border">{{ user.id }}</td>
            <td class="py-2 px-4 border">{{ user.nom }}</td>
            <td class="py-2 px-4 border">{{ user.prenom }}</td>
            <td class="py-2 px-4 border">{{ user.email }}</td>
            <td class="py-2 px-4 border">
              {{ user.semestre ? `S${user.semestre}` : "N/A" }}
            </td>
            <td class="py-2 px-4 border">
              <div class="flex flex-wrap gap-1">
                <span
                  v-if="user.admin"
                  class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded"
                  >Admin</span
                >
                <span
                  v-if="user.prof"
                  class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                  >Professeur</span
                >
                <span
                  v-if="!user.admin && !user.prof"
                  class="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded"
                  >Étudiant</span
                >
              </div>
            </td>
            <td class="py-2 px-4 border">
              <button
                @click="deleteUser(user.id)"
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
const users = ref([]);
const loading = ref(true);
const error = ref("");

// Search and filter state
const searchQuery = ref("");
const semestreFilter = ref("all");
const roleFilter = ref("all");

// Sorting state
const sortColumn = ref("id");
const sortDirection = ref("asc");

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    error.value = "Vous devez être connecté pour accéder à cette page";
    loading.value = false;
    return;
  }
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.status === "success") {
      users.value = response.data;
    } else {
      error.value = "Erreur lors de la récupération des utilisateurs";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    error.value =
      "Une erreur est survenue lors de la récupération des utilisateurs";
  } finally {
    loading.value = false;
  }
};

// Computed property for filtered and sorted users
const filteredUsers = computed(() => {
  return users.value
    .filter((user) => {
      // Filter by search query (case insensitive)
      const matchesSearch =
        !searchQuery.value ||
        user.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

      // Filter by semester
      let matchesSemestre = true;
      if (semestreFilter.value === "none") {
        matchesSemestre = !user.semestre;
      } else if (semestreFilter.value !== "all") {
        matchesSemestre = user.semestre?.toString() === semestreFilter.value;
      }

      // Filter by role
      let matchesRole = true;
      if (roleFilter.value === "admin") {
        matchesRole = user.admin;
      } else if (roleFilter.value === "prof") {
        matchesRole = user.prof;
      } else if (roleFilter.value === "student") {
        matchesRole = !user.admin && !user.prof;
      }

      return matchesSearch && matchesSemestre && matchesRole;
    })
    .sort((a, b) => {
      // Sort by the selected column
      if (sortColumn.value === "id") {
        return sortDirection.value === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortColumn.value === "semestre") {
        // Handle null semester values for sorting
        if (a.semestre === null && b.semestre === null) return 0;
        if (a.semestre === null) return sortDirection.value === "asc" ? 1 : -1;
        if (b.semestre === null) return sortDirection.value === "asc" ? -1 : 1;
        return sortDirection.value === "asc"
          ? a.semestre - b.semestre
          : b.semestre - a.semestre;
      } else {
        // For string columns (nom, prenom, email)
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

const deleteUser = async (userId) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
  try {
    const response = await $fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.status === "success") {
      await fetchUsers(); // Refresh the list
    } else {
      error.value = "Erreur lors de la suppression de l'utilisateur";
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur:", err);
    error.value =
      "Une erreur est survenue lors de la suppression de l'utilisateur";
  }
};
</script>
