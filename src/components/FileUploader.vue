<template>
  <div class="mb-6">
    <label class="block mb-2 text-lg font-semibold">Upload PHPStan JSON File</label>
    <input
        accept=".json"
        class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700"
        type="file"
        @change="$emit('file-loaded', $event.target.files[0])"
    >
  </div>
</template>

<script setup>
</script>