<template>
  <TopNav :notif="true">Détails du rendu</TopNav>
  <div class="container mx-auto px-4 py-8">
    <LoadingOverlay v-if="loading" />
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500 text-xl">{{ error }}</p>
      <button
        @click="goBack"
        class="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
      >
        Retour
      </button>
    </div>
    <div v-else>
      <DeadlineDetails :deadline="deadline" @close="goBack" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const deadline = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const deadlineId = route.params.id;

  if (!deadlineId) {
    error.value = "Aucune deadline spécifiée";
    loading.value = false;
    return;
  }

  try {
    const response = await $fetch(`/api/deadlines/${deadlineId}`);

    if (response.status === "success") {
      deadline.value = response.data;
    } else {
      error.value = "Erreur lors du chargement des détails";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des détails:", err);
    error.value = "Impossible de charger les détails de ce rendu";
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.back();
};
</script>
