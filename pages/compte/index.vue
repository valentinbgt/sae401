<template>
  <TopNav :notif="true">Votre profil</TopNav>
  <div>
    <div>
      <div class="fixed bottom-0 -right-10 -mb-10 -ml-10">
        <img
          src="../../assets/images/logo_agenda.svg"
          alt="logo-agenda"
          class="w-100"
        />
      </div>
      <div class="flex items-center">
        <ProfilePictureUpload
          :currentImage="authStore.user?.profilePicture"
          @update:image="updateProfilePicture"
        />
        <div class="ml-8">
          <div class="flex">
            <div>
              <p>Prenom :</p>
              <p class="mb-5 text-xl font-semibold">
                {{ authStore.user?.prenom }}
              </p>
            </div>
            <div class="ml-8">
              <p>Nom :</p>
              <p class="mb-5 text-xl font-semibold">
                {{ authStore.user?.nom }}
              </p>
            </div>
          </div>

          <p>Adresse email :</p>
          <p class="mb-5 text-xl font-semibold">{{ authStore.user?.email }}</p>

          <div>
            <button
              class="cursor-pointer text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white text-lg font-medium px-5 py-3 rounded-xl"
            >
              Modifier
            </button>

            <button
              class="ml-5 cursor-pointer bg-indigo-600 text-white hover:text-indigo-600 hover:border hover:border-indigo-600 hover:bg-white text-lg font-medium px-5 py-3 rounded-xl"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingOverlay v-if="isLoading" />
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { ref } from "vue";

const authStore = useAuthStore();
const isLoading = ref(false);
const errorMessage = ref("");

// Charger les données utilisateur au chargement du composant
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
});

const updateProfilePicture = async (imageData) => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.updateProfile({
      profilePicture: imageData,
    });

    // Show success notification if needed
  } catch (error) {
    console.error("Error updating profile picture:", error);
    errorMessage.value =
      "Une erreur est survenue lors de la mise à jour de la photo de profil";
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  navigateTo("/");
};

if (!authStore.user) {
  navigateTo("/compte/connexion");
}
</script>
