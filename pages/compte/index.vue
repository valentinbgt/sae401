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
        <img
          src="../../assets/images/ppp.png"
          class="w-60 aspect-square rounded-full border object-cover"
          alt="Photo de profil"
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
              class="mb-2 cursor-pointer text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white text-lg font-medium px-5 py-3 rounded-xl "
            >
              Modifier
            </button>
            <br />
            <button
              class="cursor-pointer bg-indigo-600 text-white hover:text-indigo-600 hover:border hover:border-indigo-600 hover:bg-white text-lg font-medium px-5 py-3 rounded-xl"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
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
