<template>
  <button
      class="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      @click="$emit('toggle-theme')"
  >
    {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
  </button>
</template>

<script setup>
defineProps(['darkMode']);
</script>