<template>
  <TopNav :notif="true">Nouvelle Date</TopNav>
  <div class="relative overflow-hidden  w-full  h-screen ">
              <div class="absolute z-10 bottom-9 -right-10">
                  <img 
                      src="../../assets/images/logo_agenda.svg" 
                      alt="logo-agenda" 
                      class="w-100"
                  />
              </div>
      <div class="flex justify-start">
        <DeadlineForm />
      </div>
  </div>
  
</template>
