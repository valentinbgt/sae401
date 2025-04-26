<template>
  <div
    class="mt-4 w-full sm:w-11/12 h-auto rounded-2xl text-white flex items-center px-6 py-4 transition-colors"
    :class="{
      'cursor-pointer': deadlineId,
      'bg-gray-500 hover:bg-gray-600': passed,
      'bg-indigo-500 hover:bg-indigo-600': !passed,
    }"
    @click="navigateToDetails"
  >
    <span class="uppercase font-bold text-base sm:text-lg md:text-xl mx-4 ">
      {{ time }}
    </span>
    <span class="border-r border-white h-8"></span>
    <div class="mx-4 sm:mx-6 w-full">
      <p
        class="font-bold text-base sm:text-lg md:text-xl whitespace-nowrap overflow-hidden w-full overflow-ellipsis un"
      >
        {{ title }}
      </p>
      <!-- SubTitle visible uniquement sur PC -->
      <p
        class="hidden md:block font-semibold text-white opacity-80 text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden w-full overflow-ellipsis"
      >
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  time: String,
  title: String,
  subTitle: String,
  deadlineId: {
    type: [Number, String],
    default: null,
  },
  passed: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const navigateToDetails = () => {
  if (props.deadlineId) {
    router.push(`/dates/${props.deadlineId}`);
  }
};
</script>
