<template>
  <nav class="bg-indigo-500 w-56 h-screen flex flex-col items-center p-6">
    <NuxtLink to="/" class="mb-5 mt-4"
      ><img src="/logo.svg" alt="Logo du cahier de texte" class="w-24"
    /></NuxtLink>

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
