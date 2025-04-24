<template>
  <TopNav :notif="true">Mes rendus</TopNav>
  <p class="text-xl font-bold pb-5">
    Vous pouvez consulter et ajouter des rendus.
  </p>

  <div class="mb-6 flex justify-end">
    <NuxtLink
      to="dates/nouvelle"
      class="p-3 px-5 bg-indigo-500 font-semibold rounded-lg text-white cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400"
      >Ajouter une date</NuxtLink
    >
  </div>

  <LoadingOverlay v-if="loading" />

  <div v-else>
    <div v-if="slots.length === 0" class="text-center">
      <p class="text-lg text-gray-500">
        Vous n'avez pas encore ajouté de rendus.
      </p>
    </div>

    <div
      v-else
      class="border rounded-4xl py-6 flex items-center flex-col mb-10"
    >
      <h2 class="font-bold text-2xl mb-4">Vous avez ajouté :</h2>
      <div
        v-for="(dayData, i) in slots"
        :key="i"
        class="w-full flex flex-col items-center"
      >
        <Separator>{{ Object.keys(dayData)[0] }}</Separator>
        <div class="w-full flex flex-col items-center">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const slots = ref([]);
const loading = ref(true);

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
    loading.value = true;

    // Initialiser l'authentification
    authStore.initAuth();

    // Si l'utilisateur a un token mais pas d'infos utilisateur, on essaie de récupérer ses infos
    if (authStore.token && !authStore.user) {
      await authStore.fetchUser();
    }

    if (!authStore.user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return navigateTo("/compte/connexion");
    }

    // Récupérer les deadlines de l'utilisateur
    const response = await $fetch("/api/deadlines?my", {
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

      // Si aucune deadline, on arrête ici
      if (deadlines.length === 0) {
        loading.value = false;
        return;
      }

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
  } finally {
    loading.value = false;
  }
});
</script>
