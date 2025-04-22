<template>
  <div class="flex h-screen w-full">
    <!-- Section gauche : Formulaire d'inscription -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
      <!-- Titre principal -->
      <h2 class="text-4xl md:text-6xl font-bold mb-2 text-center">
        Bienvenue !
      </h2>
      <!-- Texte secondaire -->
      <p class="text-sm md:text-base text-gray-600 mb-6 text-center">
        Pour vous inscrire, veuillez entrer votre adresse mail universitaire.
      </p>
      <!-- Formulaire -->
      <SignupForm />
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
