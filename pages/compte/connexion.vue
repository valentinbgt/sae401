<template>
  <div class="flex max-w-[1920px]  h-screen">
    <div class="w-1/2 flex flex-col justify-center items-center p-12">
      <p class="text-8xl font-bold mb-2 text-center">Bienvenue</p>
      <p class="text-gray-600 mb-6 text-center">
        Entrez votre Adresse mail universitaire
      </p>
      <LoginForm />
    </div>

    <div class="w-1/2 relative flex items-center justify-center bg-indigo-500">
  
      <img
        src="../../assets/images/logo_agenda.svg"
        alt="logo-agenda"
        class="absolute bottom-0 right-0 w-[40%] max-w-[1000px] "
      />
    </div>
  </div>
</template>