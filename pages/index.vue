<template>
  <div class="my-5 mx-8 h-12 flex items-center justify-between w-full">
    <h1 class="text-4xl font-bold">Dashboard</h1>
    <div class="flex">
      <NotificationBell :new="true"></NotificationBell>

      <NuxtLink to="/account" class="pl-2">
        <img src="/icons/account.svg" />
      </NuxtLink>
    </div>
  </div>
</template>
