<template>
  <TopNav :notif="true">Admin</TopNav>
  <div class="flex flex-col gap-4 p-4">
    <NuxtLink to="admin/modules" class="text-blue-500 hover:underline"
      >Voir les modules</NuxtLink
    >
    <NuxtLink to="admin/utilisateurs" class="text-blue-500 hover:underline"
      >Gérer les utilisateurs</NuxtLink
    >
  </div>
</template>
