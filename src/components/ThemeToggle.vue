<template>
  <button
      :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      class="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
      @click="toggleTheme"
  >
    <svg v-if="darkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </svg>
    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </svg>
  </button>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:darkMode']);

const localDarkMode = ref(props.darkMode);

watch(() => props.darkMode, (newValue) => {
  localDarkMode.value = newValue;
});

const toggleTheme = () => {
  localDarkMode.value = !localDarkMode.value;
  emit('update:darkMode', localDarkMode.value);
};
</script>