<template>
  <div
    class="mt-2 w-11/12 h-22 rounded-2xl text-white flex items-center px-2 transition-colors"
    :class="{
      'cursor-pointer': deadlineId,
      'bg-gray-500 hover:bg-gray-600': passed,
      'bg-indigo-500 hover:bg-indigo-600': !passed,
    }"
    @click="navigateToDetails"
  >
    <span class="uppercase font-bold text-xl mx-4">{{ time }}</span>
    <span class="border-r border-white h-8/12"></span>
    <div class="mx-4 w-full">
      <p
        class="font-bold text-xl whitespace-nowrap overflow-hidden w-full overflow-ellipsis"
      >
        {{ title }}
      </p>
      <p
        class="font-semibold text-white opacity-80 text-lg whitespace-nowrap overflow-hidden w-full overflow-ellipsis"
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
