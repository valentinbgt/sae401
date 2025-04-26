<template>
  <TopNav :notif="true">Votre profil</TopNav>
  <div>
    <div>
      <ImageLogoBackground />
      <div class="flex flex-col md:flex-row items-center">
        <ProfilePictureUpload
          :currentImage="authStore.user?.profilePicture"
          @update:image="updateProfilePicture"
          @delete:image="deleteProfilePicture"
        />
        <div class="mt-8 md:mt-0 md:ml-8 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center">
            <div>
              <p>Prénom :</p>
              <p class="mb-5 text-xl font-semibold">
                {{ authStore.user?.prenom }}
              </p>
            </div>
            <div class="mt-4 md:mt-0 md:ml-8">
              <p>Nom :</p>
              <p class="mb-5 text-xl font-semibold">
                {{ authStore.user?.nom }}
              </p>
            </div>
          </div>

          <p>Adresse email :</p>
          <p class="mb-5 text-xl font-semibold">{{ authStore.user?.email }}</p>

          <div class="mt-4">
            <!-- <button
                class="mb-2 cursor-pointer text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white text-lg font-medium px-5 py-3 rounded-xl"
            >
              Modifier
            </button> -->
            <br />
            <button
              class="cursor-pointer bg-indigo-600 text-white hover:text-indigo-600 border hover:border-indigo-600 hover:bg-white text-lg font-medium px-5 py-3 rounded-xl"
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
import ImageLogoBackground from "~/components/ImageLogoBackground.vue";

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

const deleteProfilePicture = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.updateProfile({
      profilePicture: null,
    });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    errorMessage.value =
      "Une erreur est survenue lors de la suppression de la photo de profil";
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
