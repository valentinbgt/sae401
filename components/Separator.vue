<template>
  <div class="mt-1 h-8 w-full relative">
    <div class="absolute w-full h-full flex justify-center items-center">
      <span class="w-11/12 h-px bg-black"></span>
    </div>
    <div class="absolute w-full h-full flex justify-center items-center">
      <span class="text-lg h-fit bg-white px-6"><slot></slot></span>
    </div>
  </div>
</template>
