<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="w-full h-full fixed flex items-center justify-center bg-indigo-500 z-50"
    >
      <div class="flex flex-col items-center">
        <img
          src="/assets/images/logo_agenda.svg"
          alt="logo-agenda"
          class="w-68"
        />
        <p class="text-2xl font-semibold text-white mt-8">
          Chargement en cours...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
