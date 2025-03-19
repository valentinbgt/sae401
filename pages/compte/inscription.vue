<template>
  <div class="flex h-screen w-full">
    <div class="w-1/2 self-center">
      <h2 class="text-6xl font-bold mb-2 text-center">Bienvenue !</h2>
      <p class="text-gray-600 mb-6 text-center">
        Pour vous inscrire, veuillez entrer votre adresse mail universitaire.
      </p>
      <SignupForm />
    </div>
    <div class="w-1/2 bg-indigo-500 relative overflow-hidden ">
      <div class="absolute -bottom-10 -right-10 ">
        <img
            src="../../assets/images/logo_agenda.svg"
            alt="logo-agenda"
            class="w-100"
        />
      </div>
    </div>
  </div>
</template>
