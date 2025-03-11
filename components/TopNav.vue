<template>
  <div class="my-10 h-12 flex items-center justify-between w-full">
    <h1 class="text-4xl font-bold"><slot /></h1>
    <div class="flex">
      <NotificationBell :new="notif"></NotificationBell>

      <NuxtLink to="/compte" class="pl-4">
        <img src="/icons/account.svg" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notif: Boolean,
});
</script>
