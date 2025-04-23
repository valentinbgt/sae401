<template>
  <TopNav :notif="true">Ajouter une nouvelle date</TopNav>

  <div class="fixed bottom-0 -right-10 -mb-10 -ml-10 w-40 sm:w-40 md:w-52 lg:w-68 xl:w-100">
    <img
      src="../../assets/images/logo_agenda.svg"
      alt="logo-agenda"
      class="w-full"
    />
  </div>

  <div class="flex justify-start relative z-10">
    <DeadlineForm />
  </div>
</template>
