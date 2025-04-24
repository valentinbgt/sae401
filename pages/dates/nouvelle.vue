<template>
  <TopNav :notif="true">Ajouter un nouveau rendu</TopNav>

  <ImageLogoBackground />

  <div class="flex justify-start relative z-10">
    <DeadlineForm />
  </div>
</template>
<script setup lang="ts">
import ImageLogoBackground from "~/components/ImageLogoBackground.vue";
</script>