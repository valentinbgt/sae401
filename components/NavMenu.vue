<template>
  <div>
    <button @click="toggleMenu" class="md:hidden p-4 text-black z-30">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16m-7 6h7"
        ></path>
      </svg>
    </button>

    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
    ></div>

    <nav
      :class="{
        'translate-x-0': isMenuOpen,
        '-translate-x-full': !isMenuOpen
      }"
      class="bg-indigo-500 w-56 h-screen fixed top-0 left-0 transform transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 flex flex-col items-center p-6"
    >
      <NuxtLink to="/" class="mb-5 mt-4">
        <img src="/logo.svg" alt="Logo du cahier de texte" class="w-24" />
      </NuxtLink>

      <NuxtLink
        to="/"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
        >Dashboard</NuxtLink
      >
      <NuxtLink
        to="/dates"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
        >Mes dates</NuxtLink
      >
      <NuxtLink
        to="/ics"
        class="text-white font-semibold hover:underline mt-5 text-xl text-center"
        >Synchroniser un calendrier</NuxtLink
      >
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
