<template>
  <TopNav :notif="true">Mes dates</TopNav>
  <p class="text-xl font-bold pb-5">Vous pouvez consulter et ajouter des dates ici.</p>
  <div class=" hover:underline">
    <NuxtLink to="dates/nouvelle" class="p-3 bg-indigo-500 text-white rounded-lg ">  Ajouter une date </NuxtLink>
    </div>
  <div class="relative overflow-hidden  w-full  h-screen ">
    <div class="absolute z-10 bottom-9 -right-10">
      <img 
          src="../../assets/images/logo_agenda.svg" 
          alt="logo-agenda" 
          class="w-100"
      />
            </div>
          </div>

          
   

    


    






</template>

<script setup>
import { ref } from "vue";

const slots = ref([]);


</script>
