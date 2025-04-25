<template>
  <div class="flex min-h-screen">
  <div class="relative">
    <!-- Bouton hamburger -->
    <button
      @click="toggleMenu"
      class="md:hidden p-4 text-black z-40 fixed top-7 left-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-9 h-9  "
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>

    <!-- Overlay sombre -->
    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
    ></div>

    <!-- Barre latérale -->
    <nav
      :class="{
        'translate-x-0': isMenuOpen,
        '-translate-x-full': !isMenuOpen,
      }"
      class="bg-indigo-500 w-56 h-full fixed top-0 left-0 transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 flex flex-col items-center p-6"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="mb-5 mt-4">
        <img src="/logo.svg" alt="Logo du cahier de texte" class="w-24" />
      </NuxtLink>

      <!-- Liens de navigation -->
      <NuxtLink
        to="/"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >
        Dashboard
      </NuxtLink>
      <NuxtLink
        to="/dates"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >
        Mes dates
      </NuxtLink>
      <NuxtLink
        to="/ics"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
      >
        Synchroniser un calendrier
      </NuxtLink>
    </nav>
  </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
body {
  overflow-x: hidden;
}
</style>
