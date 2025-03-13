<template>
  <TopNav :notif="true">Tableau de bord</TopNav>
  <div
    class="max-w-6xl h-96 border rounded-4xl py-6 flex items-center flex-col"
  >
    <h2 class="font-bold text-2xl">Prochains rendus</h2>
    <Separator>Lundi 24 mars</Separator>
    <TimeSlot
      v-for="slot in slots"
      :time="slot.time"
      :title="slot.title"
      :sub-title="slot.subTitle"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const slots = ref([
  {
    time: "12h30",
    title: "WR412 - Rendre les travaux sur le VPS",
    subTitle: "R. Delon | Rendu sur VPS",
  },
]);
</script>
