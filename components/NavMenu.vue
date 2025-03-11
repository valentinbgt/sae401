<template>
  <nav class="bg-indigo-500 w-56 h-screen flex flex-col items-center p-6">
    <img src="https://placehold.co/150" alt="Logo du cahier de texte" />
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
</template>
