<template>
  <div v-if="deadline" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Section principale -->
    <div class="border rounded-4xl py-6 px-4 lg:px-8 flex flex-col col-span-1 lg:col-span-2 bg-white">
      <h2 class="text-center text-xl lg:text-2xl font-bold mb-6">
        {{ deadline.module }} : {{ deadline.titre }}
      </h2>
      <div class="flex flex-col lg:flex-row">
        <!-- Informations principales -->
        <div class="w-full lg:w-1/2 space-y-3">
          <div class="flex items-start">
            <div class="font-bold">Pour le</div>
            <p class="ml-2 underline font-bold">
              {{ formatDate(deadline.timestamp) }} |
              {{ formatTime(deadline.timestamp) }}
            </p>
          </div>
          <div class="flex items-start">
            <div class="font-bold">Référent :</div>
            <p class="ml-2">{{ deadline.prof }}</p>
          </div>
          <div class="flex items-start">
            <div class="font-bold">Format :</div>
            <p class="ml-2">{{ deadline.type }}</p>
          </div>
          <div class="flex items-start">
            <div class="font-bold">Lieu :</div>
            <p class="ml-2">{{ deadline.lieu }}</p>
          </div>
          <div class="flex items-start">
            <div class="font-bold">Étendue :</div>
            <p class="ml-2">{{ deadline.etendue }}</p>
          </div>
          <div v-if="deadline.auteur" class="flex items-start">
            <div class="font-bold">Créé par :</div>
            <p class="ml-2">
              {{ deadline.auteur.prenom }} {{ deadline.auteur.nom }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="w-full lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
          <h3 class="text-lg lg:text-xl font-semibold mb-4">Description</h3>
          <p
            class="whitespace-pre-wrap break-words overflow-hidden text-ellipsis"
          >
            {{ deadline.description || "Aucune description disponible." }}
          </p>
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex flex-col lg:flex-row justify-between mt-6 mx-4 lg:mx-12 space-y-4 lg:space-y-0">
        <button
          @click="$emit('close')"
          class="px-6 py-3 bg-indigo-500 text-white rounded-lg cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400 font-semibold"
        >
          Retour
        </button>
        <div class="flex flex-col text-center lg:text-left">
          <p class="font-bold underline text-sm cursor-pointer">
            Proposer une modification
          </p>
          <p class="font-bold underline text-sm cursor-pointer">
            Signaler un problème
          </p>
        </div>
      </div>
    </div>

    
      <div class="absolute  z-[-1] -bottom-10 -right-10">
        <img
          src="../assets/images/logo_agenda.svg"
          alt="logo-agenda"
          class="w-100"
        />
    </div>

  </div>

  <!-- Chargement -->
  <div v-else class="flex justify-center items-center h-64">
    <p class="text-gray-500">Chargement des détails...</p>
  </div>
</template>

<script setup>
defineProps({
  deadline: {
    type: Object,
    default: null,
  },
});

defineEmits(["close"]);

// Format the date part of the timestamp
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());
};

// Format the time part of the timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date
    .toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");
};
</script>
