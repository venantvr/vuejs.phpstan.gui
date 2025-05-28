<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Errors ({{ totalErrors }})</h2>
    <div v-if="jsonData && Object.keys(jsonData.files || {}).length > 0">
      <div
          v-for="(fileData, fileName) in jsonData.files"
          :key="fileName"
          class="mb-4 p-4 border rounded dark:border-gray-700 dark:bg-gray-800"
      >
        <h3 class="text-lg font-medium">{{ fileName }}</h3>
        <ul class="list-disc pl-5">
          <li v-for="(error, index) in fileData.messages" :key="index" class="my-2">
            <span class="font-semibold">Line {{ error.line }}:</span> {{ error.message }}
            <span v-if="error.ignorable" class="text-sm text-gray-500 dark:text-gray-400">(Ignorable)</span>
          </li>
        </ul>
      </div>
    </div>
    <p v-else class="text-gray-500 dark:text-gray-400">No errors found or no file loaded.</p>
  </div>
</template>

<script setup>
import {computed} from 'vue';

defineProps(['jsonData']);

const totalErrors = computed(() => {
  return Object.values(jsonData.value?.files || {}).reduce(
      (total, file) => total + (file.messages?.length || 0),
      0
  );
});
</script>