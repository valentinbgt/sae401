<template>
  <div class="flex max-w-[1920px] h-screen">
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
      <h2 class="text-6xl font-bold mb-2 text-center">Bon retour !</h2>
      <p class="text-gray-600 mb-6 text-center">
        Veuillez vous connecter en rentrant vos identifiants.
      </p>
      <LoginForm />
    </div>

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
