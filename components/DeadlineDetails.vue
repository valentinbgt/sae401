<template>
  <div v-if="deadline" class="bg-white rounded-2xl p-6 shadow-md w-full">
    <h1 class="text-3xl font-bold text-indigo-700 mb-6">{{ deadline.titre }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h2 class="text-xl font-semibold mb-4 text-indigo-600">Informations</h2>
        <div class="space-y-3">
          <div class="flex items-start">
            <span class="font-semibold w-32">Module:</span>
            <span>{{ deadline.module }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Date limite:</span>
            <span>{{ formatDate(deadline.timestamp) }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Heure limite:</span>
            <span>{{ formatTime(deadline.timestamp) }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Lieu:</span>
            <span>{{ deadline.lieu }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Enseignant:</span>
            <span>{{ deadline.prof }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Format:</span>
            <span>{{ deadline.type }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-semibold w-32">Étendue:</span>
            <span>{{ deadline.etendue }}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h2 class="text-xl font-semibold mb-4 text-indigo-600">Description</h2>
        <div class="bg-gray-50 p-4 rounded-lg min-h-[200px]">
          <p class="whitespace-pre-wrap">{{ deadline.description || "Aucune description disponible." }}</p>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center mt-6">
      <button
        @click="$emit('close')"
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition mr-4"
      >
        Retour
      </button>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-64">
    <p class="text-gray-500">Chargement des détails...</p>
  </div>
</template>

<script setup>
defineProps({
  deadline: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

// Format the date part of the timestamp
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase());
};

// Format the time part of the timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).replace(':', 'h');
};
</script>