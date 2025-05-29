<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-4">Preset Manager</h2>
    <!-- Save Preset -->
    <div class="mb-4">
      <label class="block mb-2 text-sm font-medium">Preset Name</label>
      <input
          v-model="presetName"
          class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Enter preset name..."
          type="text"
      >
      <button
          :disabled="!presetName"
          class="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          @click="savePreset"
      >
        Save Preset
      </button>
    </div>
    <!-- Load Preset -->
    <div>
      <label class="block mb-2 text-sm font-medium">Load Preset</label>
      <input
          ref="fileInput"
          accept=".json"
          class="hidden"
          type="file"
          @change="loadPreset"
      >
      <button
          class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          @click="$refs.fileInput.click()"
      >
        Choose Preset File
      </button>
    </div>
    <p v-if="error" class="text-red-500 dark:text-red-400 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['save-preset', 'load-preset']);

const presetName = ref('');
const error = ref('');
const fileInput = ref(null);

// Save preset as JSON file
const savePreset = () => {
  if (!presetName.value) {
    error.value = 'Preset name is required';
    return;
  }
  const preset = {
    name: presetName.value,
    filters: props.filters,
  };
  const json = JSON.stringify(preset, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${presetName.value}.json`;
  a.click();
  URL.revokeObjectURL(url);
  presetName.value = '';
  error.value = '';
  emit('save-preset', preset);
};

// Load preset from JSON file
const loadPreset = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const preset = JSON.parse(e.target.result);
      if (!preset.name || !preset.filters) {
        throw new Error('Invalid preset format');
      }
      emit('load-preset', preset.filters);
      error.value = '';
    } catch (err) {
      error.value = 'Failed to load preset: ' + err.message;
    }
    // Reset file input
    event.target.value = '';
  };
  reader.onerror = () => {
    error.value = 'Error reading file';
    event.target.value = '';
  };
  reader.readAsText(file);
};
</script>