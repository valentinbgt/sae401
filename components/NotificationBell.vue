<template>
  <span >
    <img v-if="new" src="/icons/bell_new.svg" />
    <img v-else src="/icons/bell.svg" />
  </span>
</template>

<script setup>
defineProps({
  new: Boolean,
});
</script>
