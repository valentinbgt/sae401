<template>
  <TopNav :notif="true">Tableau de bord</TopNav>
  <div
    class="flex flex-col md:grid md:grid-cols-3 gap-8 md:grid-rows-2 p-4 md:p-8"
  >
    <div
      class="border rounded-4xl py-6 flex items-center flex-col col-span-2 row-span-2"
    >
      <h2 class="font-bold text-2xl">
        {{ isShowingPassedDeadlines ? "Rendus passés" : "Prochains rendus" }}
      </h2>
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
      <!-- Loop through visible slots -->
      <div v-else class="w-full">
        <div
          v-for="(dayData, i) in visibleSlots"
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
            :passed="slot.passed"
          />
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between w-10/12 mt-6">
        <!-- Bouton Précédent -->
        <button
          @click="navigatePrevious"
          class="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600"
          :disabled="!hasPreviousDeadlines"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="hidden md:inline">Précédent</span>
        </button>

        <!-- Bouton Suivant -->
        <button
          @click="navigateNext"
          class="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600"
          :disabled="!hasMoreDeadlines"
        >
          <span class="hidden md:inline">Suivant</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
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
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const slots = ref([]);

const displayIndex = ref(0);
const firstNonPassedIndex = ref(0); // Store the index of the first non-passed deadline

// Computed property to check if there are previous deadlines (passed deadlines)
const hasPreviousDeadlines = computed(() => {
  // Only return true if:
  // 1. There are passed deadlines (firstNonPassedIndex > 0)
  // 2. AND we're NOT already at the beginning of passed deadlines (displayIndex > 0)
  return (
    firstNonPassedIndex.value > 0 &&
    (displayIndex.value > 0 || displayIndex.value >= firstNonPassedIndex.value)
  );
});

// Computed property to determine if we're showing passed deadlines
const isShowingPassedDeadlines = computed(() => {
  return displayIndex.value < firstNonPassedIndex.value;
});

// Function to navigate to previous deadlines (passed deadlines)
const navigatePrevious = () => {
  if (displayIndex.value > 0) {
    // If we're already looking at passed deadlines, go back by 4 more
    displayIndex.value = Math.max(0, displayIndex.value - 4);
  } else if (firstNonPassedIndex.value > 0) {
    // Jump to passed deadlines, showing the most recent 4 passed deadlines
    const passedCount = firstNonPassedIndex.value;
    const passedPages = Math.ceil(passedCount / 4);
    // Show the most recent page of passed deadlines
    displayIndex.value = Math.max(0, (passedPages - 1) * 4);
  }
};

// Function to navigate to next deadlines
const navigateNext = () => {
  if (displayIndex.value < firstNonPassedIndex.value) {
    // If we're viewing passed deadlines, jump directly to first non-passed deadline
    displayIndex.value = firstNonPassedIndex.value;
  } else {
    // Otherwise, just move forward by 4
    displayIndex.value = displayIndex.value + 4;
  }
};

// Computed property to get only the visible slots with their days
const visibleSlots = computed(() => {
  const result = [];
  let counter = 0;

  // Determine if we're viewing passed or upcoming deadlines
  const viewingPassedDeadlines = displayIndex.value < firstNonPassedIndex.value;

  // Loop through all days
  for (const dayData of slots.value) {
    const day = Object.keys(dayData)[0];
    const slots_for_this_day = [];

    // Filter only slots that should be visible in the current page
    for (const slot of dayData[day].daySlots) {
      // Only include the slot if:
      // 1. It's in the current display range (between displayIndex and displayIndex + 4)
      // 2. AND it matches the current view type (passed or upcoming)
      if (counter >= displayIndex.value && counter < displayIndex.value + 4) {
        // Only include passed deadlines when viewing passed deadlines page
        // Only include upcoming deadlines when viewing upcoming deadlines page
        if (
          (viewingPassedDeadlines && slot.passed) ||
          (!viewingPassedDeadlines && !slot.passed)
        ) {
          slots_for_this_day.push(slot);
        }
      }
      counter++;
    }

    // Only add days that have visible slots
    if (slots_for_this_day.length > 0) {
      result.push({
        [day]: {
          daySlots: slots_for_this_day,
        },
      });
    }
  }

  return result;
});

// Computed property to check if there are more deadlines to show
const hasMoreDeadlines = computed(() => {
  // Count total deadlines across all days
  let totalDeadlines = 0;
  for (const dayData of slots.value) {
    const day = Object.keys(dayData)[0];
    totalDeadlines += dayData[day].daySlots.length;
  }

  // If there are more deadlines after the current display range
  return totalDeadlines > displayIndex.value + 4;
});

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

        //if day is passed
        //currente date (hours and minutes to 0)
        let currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);

        let passed = new Date(e.timestamp) < currentDay;

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
                  passed,
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
            passed,
          });
        }
      });

      // Find the first non-passed deadline to set initial displayIndex
      let nonPassedIndex = 0;
      let found = false;

      // Loop through all slots to find first non-passed deadline
      for (const dayData of slots.value) {
        const day = Object.keys(dayData)[0];
        for (const slot of dayData[day].daySlots) {
          if (!slot.passed) {
            found = true;
            break;
          }
          nonPassedIndex++;
        }
        if (found) break;
      }

      // Store this index for navigation purposes
      firstNonPassedIndex.value = nonPassedIndex;

      // Set displayIndex to show non-passed deadlines first
      displayIndex.value = nonPassedIndex;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des deadlines:", error);
  }
});
</script>
