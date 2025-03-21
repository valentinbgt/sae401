<template>
  <TopNav :notif="true">Tableau de bord</TopNav>
  <div class="grid grid-cols-3 gap-8 grid-rows-2">
    <div
      class="border rounded-4xl py-6 flex items-center flex-col col-span-2 row-span-2"
    >
      <h2 class="font-bold text-2xl">Prochains rendus</h2>
      <div
        v-for="(dayData, i) in slots"
        :key="i"
        class="w-full flex flex-col items-center"
      >
        <Separator>{{ Object.keys(dayData)[0] }}</Separator>
        <TimeSlot
          v-for="(slot, index) in dayData[Object.keys(dayData)[0]].daySlots"
          :key="index"
          :time="slot.time"
          :title="slot.title"
            :sub-title="slot.subTitle"
        />
      </div>
      <div class="mt-2 h-8 w-full">
        <div class="w-full h-full flex justify-center items-center">
          <div class="w-11/12 flex items-center justify-between">
            <span class="text-lg font-medium"><- Page précédente</span>
            <span class="text-lg font-medium cursor:point">Page suivante -></span>
          </div>
        </div>
      </div>
    </div>
    <div class="border rounded-4xl py-6 flex items-center flex-col">
      <h2 class="font-bold text-2xl">Calendrier</h2>

      
    </div>
    <div class="border rounded-4xl py-6 flex items-center flex-col">
      <h2 class="font-bold text-2xl mb-12 ">Actions</h2>
      <NuxtLink to="dates/nouvelle" class="w-full flex items-center flex-col ">
        <div class=" text-white bg-indigo-500 rounded-2xl py-4 w-10/12 text-center font-bold text-xl ">Ajouter une date</div>
      </NuxtLink>
        <div class="text-white bg-indigo-500 rounded-2xl mt-4 py-4 w-10/12 text-center font-bold text-xl ">Historique</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const slots = ref([]);

const data = [
  {
    timestamp: 1742815800,
    module: "WR412",
    title: "Rendre les travaux sur le VPS",
    prof: "R. Delon",
    lieu: "Rendu sur VPS",
  },
  {
    timestamp: 1742832000,
    module: "WS401",
    title: "Rendre le MCD/MLD",
    prof: "D. Annebicque",
    lieu: "Joindre au document initial",
  },
  {
    timestamp: 1743116340,
    module: "WR409",
    title: "Rendre la maquette Figma",
    prof: "A. Loizon",
    lieu: "Rendu Moodle",
  },
  {
    timestamp: 1743919200,
    module: "WR408",
    title: "Partiel",
    prof: "P. Gommery",
    lieu: "Partiel",
  },
].sort((a, b) => a.timestamp - b.timestamp);

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convertir en millisecondes
  let formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const timestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convertir en millisecondes
  return date
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
};

let lastDay = "";
data.forEach((e) => {
  let time,
    title,
    subTitle = "";

  time = timestampToTime(e.timestamp);
  title = `${e.module} - ${e.title}`;
  subTitle = `${e.prof} | ${e.lieu}`;

  let elementDay = timestampToDate(e.timestamp);

  if (elementDay != lastDay) {
    // Create new day entry
    slots.value.push({
      [elementDay]: {
        daySlots: [
          {
            time,
            title,
            subTitle,
          },
        ],
      },
    });
    lastDay = elementDay;
  } else {
    // Add to existing day
    const lastSlot = slots.value[slots.value.length - 1];
    lastSlot[lastDay].daySlots.push({
      time,
      title,
      subTitle,
    });
  }
});

console.log(slots.value);
</script>
