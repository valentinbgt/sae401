<template>
  <TopNav :notif="true">Tableau de bord</TopNav>
  <div
    class="flex flex-col md:grid md:grid-cols-3 gap-8 md:grid-rows-2 p-4 md:p-8"
  >
    <div
      class="border rounded-4xl py-6 flex items-center flex-col col-span-2 row-span-2"
    >
      <h2 class="font-bold text-2xl">Prochains rendus</h2>
      <div v-if="slots.length === 0" class="mt-4">
        <p class="text-red-500">Aucun élément à afficher pour le moment.</p>

        <NuxtLink
          to="dates/nouvelle"
          class="w-full flex items-center flex-col pt-4"
        >
          <div
            class="text-white bg-indigo-500 rounded-2xl py-4 w-10/12 text-center font-bold text-xl hover:bg-indigo-600"
          >
            Ajouter un rendu
          </div>
        </NuxtLink>
      </div>
      <div
        v-else
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
          :deadline-id="slot.id"
        />
      </div>
    </div>
    <div class="border rounded-4xl py-6 flex items-center flex-col">
      <h2 class="font-bold text-2xl">Calendrier</h2>
    </div>
    <div class="border rounded-4xl py-6 flex items-center flex-col">
      <h2 class="font-bold text-2xl mb-12">Actions</h2>
      <NuxtLink to="dates/nouvelle" class="w-full flex items-center flex-col">
        <div
          class="text-white bg-indigo-500 rounded-2xl py-4 w-10/12 text-center font-bold text-xl hover:bg-indigo-600"
        >
          Ajouter un rendu
        </div>
      </NuxtLink>
      <div
        class="text-white bg-indigo-500 rounded-2xl mt-4 py-4 w-10/12 text-center font-bold text-xl hover:bg-indigo-600"
      >
        Historique
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const slots = ref([]);

// Fonction pour convertir le timestamp en date
const timestampToDate = (date) => {
  const dateObj = new Date(date);
  let formattedDate = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

// Fonction pour convertir le timestamp en heure
const timestampToTime = (date) => {
  const dateObj = new Date(date);
  return dateObj
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
};

// Charger les deadlines depuis l'API
onMounted(async () => {
  try {
    const response = await $fetch("/api/deadlines", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.statusCode == 401 || response.statusCode == 403) {
      console.error(
        "Utilisateur non authentifié ou accès refusé, redirection vers la page de connexion."
      );
      route.push("/compte/connexion");
      return;
    }

    if (response.status === "success") {
      const deadlines = response.data;

      // Organisation des deadlines par jour
      let lastDay = "";
      deadlines.forEach((e) => {
        let time,
          title,
          subTitle = "";

        time = timestampToTime(e.timestamp);
        title = `${e.module} - ${e.titre}`;
        subTitle = `${e.prof} | ${e.lieu}`;

        let elementDay = timestampToDate(e.timestamp);

        if (elementDay != lastDay) {
          // Create new day entry
          slots.value.push({
            [elementDay]: {
              daySlots: [
                {
                  id: e.id,
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
            id: e.id,
            time,
            title,
            subTitle,
          });
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des deadlines:", error);
  }
});
</script>
