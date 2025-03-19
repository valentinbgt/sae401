<template>
  <TopNav :notif="true">Profile</TopNav>
  <div>
            <div class="relative overflow-hidden  w-full  h-screen ">
              <div class="absolute z-10 bottom-9 -right-10">
                  <img 
                      src="../../assets/images/logo_agenda.svg" 
                      alt="logo-agenda" 
                      class="w-100"
                  />
              </div>

              <div class="flex items-center">
              <img src="../../assets/images/ppp.png" alt="photo de profil" />
              <div class="ml-8">
                <h1 class="text-xl font-bold">Nom de l'etudiant :</h1>
                <p class="mb-5">{{ authStore.user?.nom }}</p>
                <h1 class="text-xl font-bold">Prenom de l'etudiant :</h1>
                <p class="mb-5">{{ authStore.user?.prenom }}</p>
                <h1 class="text-xl font-bold">Adresse de l'etudiant :</h1>
                <p class="mb-5">{{ authStore.user?.email }}</p>
              </div>
            </div>

            <div class="flex justify mt-8">
                <div class="pr-8">
                  <button  
                    class="cursor-pointer text-bg-indigo-600 p-5  hover:underline" 
                    @click="logout">
                   Déconnexion
                  </button>
                </div>

                <div class="">
                  <Button class="cursor-pointer text-bg-indigo-600 p-5  hover:underline" 
                    >Modifier</Button>
                </div>
          </div>
          </div>

  </div>




</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Charger les données utilisateur au chargement du composant
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
});

const logout = () => {
  authStore.logout();
  navigateTo("/");
};

if (!authStore.user) {
  navigateTo("/compte/connexion");
}

console.log(authStore.user);
</script>
