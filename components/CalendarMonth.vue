<template>
  <div class="calendar-month w-full max-w-sm">
    <!-- Calendar header with month and navigation -->
    <div class="flex justify-between items-center mb-4">
      <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <h3 class="font-medium text-center">
        {{ currentMonthName }} {{ currentYear }}
      </h3>
      <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Day names -->
    <div class="grid grid-cols-7 mb-2">
      <div
        v-for="day in days"
        :key="day"
        class="text-center text-xs font-medium text-gray-500"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar days -->
    <div class="grid grid-cols-7 gap-1">
      <!-- Empty cells for days before the first day of the month -->
      <div
        v-for="_ in startDay"
        :key="'empty-' + _"
        class="h-8 rounded-full"
      ></div>

      <!-- Days of the month -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="h-8 flex items-center justify-center rounded-full cursor-pointer text-sm"
        :class="{
          'bg-indigo-500 text-white hover:bg-indigo-600': hasEvent(day),
          'hover:bg-gray-100': !hasEvent(day),
          'border border-gray-200': isToday(day),
        }"
        @click="dayClicked(day)"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  eventDates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["daySelected"]);

// Days of the week
const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// Current displayed month and year
const currentDate = ref(new Date());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString("fr-FR", { month: "long" });
});

// Number of days in the current month
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

// Day of the week of the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const startDay = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Check if a day has an event
const hasEvent = (day) => {
  const formattedDate = `${currentYear.value}-${String(
    currentMonth.value + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return props.eventDates.includes(formattedDate);
};

// Check if a day is today
const isToday = (day) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

// Navigate to previous month
const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

// Navigate to next month
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};

// Handle day click
const dayClicked = (day) => {
  const dateString = `${currentYear.value}-${String(
    currentMonth.value + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  emit("daySelected", dateString);
};

// Watch for changes in the event dates
watch(
  () => props.eventDates,
  (newDates) => {
    // If we need to do something when eventDates changes
  },
  { deep: true }
);
</script>
