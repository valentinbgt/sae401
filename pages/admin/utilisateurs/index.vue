<template>
  <TopNav :notif="true">Gestion des Utilisateurs</TopNav>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Liste des utilisateurs</h1>
      <NuxtLink
        to="utilisateurs/nouveau"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Ajouter un utilisateur
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
            <th class="py-2 px-4 border text-left">Nom</th>
            <th class="py-2 px-4 border text-left">Prénom</th>
            <th class="py-2 px-4 border text-left">Email</th>
            <th class="py-2 px-4 border text-left">Semestre</th>
            <th class="py-2 px-4 border text-left">Rôles</th>
            <th class="py-2 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
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
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const users = ref([]);
const loading = ref(true);
const error = ref("");

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
