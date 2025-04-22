<template>
  <div class="flex max-w-[1920px] h-screen">
    <!-- Section gauche : Formulaire de connexion -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
      <!-- Titre principal -->
      <h2 class="text-4xl md:text-6xl font-bold mb-2 text-center">
        Bon retour !
      </h2>
      <!-- Texte secondaire -->
      <p class="text-sm md:text-base text-gray-600 mb-6 text-center">
        Veuillez vous connecter en rentrant vos identifiants.
      </p>
      <!-- Formulaire -->
      <LoginForm />
    </div>

    <!-- Section droite : Image ou contenu supplémentaire -->
    <div class="hidden lg:flex w-1/2 bg-indigo-500 relative overflow-hidden">
      <div class="absolute -bottom-10 -right-10">
        <img
          src="../../assets/images/logo_agenda.svg"
          alt="logo-agenda"
          class="w-100"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire ici, car tout est géré dans LoginForm.vue
</script>
