<template>
  <TopNav :notif="true">Synchroniser un calendrier</TopNav>
  <div class="container mx-auto mt-8 px-4">
    <div class="bg-white rounded-lg border p-6 max-w-3xl mx-auto">
      <div v-if="loading" class="flex justify-center my-8">
        <LoadingOverlay />
      </div>

      <div v-else>
        <div v-if="icsToken" class="mb-8">
          <h3 class="text-lg font-semibold mb-3">
            Votre lien de calendrier ICS
          </h3>
          <div class="bg-gray-100 p-4 rounded-lg mb-4 relative">
            <p class="text-sm break-all pr-10">{{ icsUrl }}</p>
            <button
              @click="copyToClipboard"
              class="absolute right-2 top-2 p-2 hover:bg-gray-200 rounded transition-colors"
              title="Copier le lien"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </button>
          </div>

          <div class="flex flex-wrap gap-4 mt-4">
            <a
              :href="icsUrl"
              target="_blank"
              rel="external nofollow"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 transition-colors inline-flex items-center"
              @click.prevent="downloadIcsFile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Télécharger le fichier ICS
            </a>

            <button
              @click="regenerateToken"
              class="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition-colors inline-flex items-center"
              :disabled="regenerating"
            >
              <svg
                v-if="regenerating"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Régénérer le lien
            </button>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <p class="mb-4">Vous n'avez pas encore de lien de calendrier ICS.</p>
          <button
            @click="generateToken"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 transition-colors inline-flex items-center"
            :disabled="generating"
          >
            <svg
              v-if="generating"
              class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            Générer un lien
          </button>
        </div>

        <div class="mt-8 border-t pt-6">
          <h3 class="text-lg font-semibold mb-3">
            Comment utiliser votre lien ICS
          </h3>
          <div class="space-y-4 text-gray-700">
            <div>
              <h4 class="font-medium text-indigo-600">Google Calendar</h4>
              <ol class="list-decimal list-inside ml-4 mt-2">
                <li>
                  Allez sur
                  <a
                    href="https://calendar.google.com/"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-600 hover:underline"
                    >Google Calendar</a
                  >
                </li>
                <li>Cliquez sur le "+" à côté de "Autres agendas"</li>
                <li>Sélectionnez "À partir de l'URL"</li>
                <li>
                  Collez votre lien ICS et cliquez sur "Ajouter un agenda"
                </li>
              </ol>
            </div>

            <div>
              <h4 class="font-medium">Apple Calendar</h4>
              <ol class="list-decimal list-inside ml-4 mt-2">
                <li>Ouvrez l'application Calendrier</li>
                <li>Allez dans Fichier > Nouvel abonnement au calendrier</li>
                <li>Collez votre lien ICS et cliquez sur "S'abonner"</li>
              </ol>
            </div>

            <div>
              <h4 class="font-medium">Outlook</h4>
              <ol class="list-decimal list-inside ml-4 mt-2">
                <li>Ouvrez Outlook et allez dans l'onglet Calendrier</li>
                <li>
                  Cliquez sur "Ajouter un calendrier" > "À partir d'Internet"
                </li>
                <li>Collez votre lien ICS et cliquez sur "OK"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 -right-10 -mb-10 -ml-10 w-40 sm:w-40 md:w-52 lg:w-68 xl:w-100">
    <img
        src="../assets/images/logo_agenda.svg"
        alt="logo-agenda"
        class="w-full"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase || window.location.origin;
const authStore = useAuthStore();

const loading = ref(true);
const generating = ref(false);
const regenerating = ref(false);
const icsToken = ref(null);
const icsUrl = computed(() => {
  if (!icsToken.value) return "";
  // Use full URL to avoid Vue Router handling
  return `${baseUrl}/api/calendar/${icsToken.value}.ics`;
});

// Fetch current token on page load
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    navigateTo("/compte/connexion");
    return;
  }

  try {
    const response = await $fetch("/api/calendar/token", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.icsToken) {
      icsToken.value = response.icsToken;
    }
  } catch (error) {
    console.error("Error fetching ICS token:", error);
    $toast.error("Erreur lors de la récupération du token ICS");
  } finally {
    loading.value = false;
  }
});

// Generate new token
async function generateToken() {
  generating.value = true;
  try {
    const response = await $fetch("/api/calendar/generate-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.icsToken) {
      icsToken.value = response.icsToken;
      $toast.success("Lien de calendrier généré avec succès");
    }
  } catch (error) {
    console.error("Error generating ICS token:", error);
    $toast.error("Erreur lors de la génération du token ICS");
  } finally {
    generating.value = false;
  }
}

// Regenerate token
async function regenerateToken() {
  if (
    !confirm(
      "Êtes-vous sûr de vouloir régénérer votre lien ? Les anciennes intégrations cesseront de fonctionner."
    )
  ) {
    return;
  }

  regenerating.value = true;
  try {
    const response = await $fetch("/api/calendar/generate-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.icsToken) {
      icsToken.value = response.icsToken;
      $toast.success("Lien de calendrier régénéré avec succès");
    }
  } catch (error) {
    console.error("Error regenerating ICS token:", error);
    $toast.error("Erreur lors de la régénération du token ICS");
  } finally {
    regenerating.value = false;
  }
}

// Copy ICS URL to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(icsUrl.value);
    $toast.success("Lien copié dans le presse-papiers");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    $toast.error("Erreur lors de la copie du lien");
  }
}

// Direct download of ICS file
function downloadIcsFile() {
  // Open in new tab to avoid Vue Router
  window.open(icsUrl.value, "_blank");
}
</script>
