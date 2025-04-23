<template>
  <div class="border rounded-lg">
    <button
        class="w-full text-left px-4 py-3 font-medium flex justify-between items-center hover:bg-gray-100 transition"
        @click="isOpen = !isOpen"
    >
      <span>{{ title }}</span>
      <svg
          :class="{'transform rotate-180': isOpen}"
          class="w-4 h-4 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div v-if="isOpen" class="px-4 pb-4 text-sm text-gray-700">
      <slot />
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false);
defineProps(['title']);
</script>
