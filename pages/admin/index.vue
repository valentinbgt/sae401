<template>
  <TopNav :notif="true">Admin</TopNav>
  <div class="flex gap-4 p-4 justify-center">
    <NuxtLink
      to="admin/modules"
      class="w-1/6 p-3 bg-indigo-500 font-semibold rounded-lg text-white cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400 flex items-center justify-center text-center"
    >
      Voir les modules</NuxtLink
    >
    <NuxtLink
      to="admin/utilisateurs"
      class="w-1/6 p-3 bg-indigo-500 font-semibold rounded-lg text-white cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400 flex items-center justify-center text-center"
      >Gérer les utilisateurs</NuxtLink
    >
  </div>
</template>
<script setup lang="ts"></script>
