<template>
  <div :class="darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'" class="min-h-screen">
    <div class="container mx-auto p-4">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">PHPStan JSON Viewer</h1>
        <theme-toggle :dark-mode="darkMode" @toggle-theme="toggleDarkMode"/>
      </header>
      <file-uploader @file-loaded="handleFileLoaded"/>
      <div v-if="jsonData" class="mb-6">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-1/3">
              <input v-model="searchQuery" class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700" placeholder="Search errors or files (regex, e.g., error1, error2)" type="text" @input="saveFilters">
              <p v-if="searchRegexError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ searchRegexError }}</p>
            </div>
            <select v-model="filterType" class="p-2 border rounded w-full md:w-1/3 dark:bg-gray-800 dark:border-gray-700" @change="saveFilters">
              <option value="">All Error Types</option>
              <option v-for="type in errorTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <select v-model="filterFile" class="p-2 border rounded w-full md:w-1/3 dark:bg-gray-800 dark:border-gray-700" @change="saveFilters">
              <option value="">All Files</option>
              <option v-for="file in fileOptions" :key="file.fullPath" :value="file.fullPath">{{ file.displayPath }}</option>
            </select>
          </div>
          <div>
            <label class="block mb-2 text-lg font-semibold">Exclude Directories (Regex, comma-separated)</label>
            <textarea v-model="excludeRegex" class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700" placeholder="e.g., ^src/, tests/.*, vendor/" rows="3" @input="saveFilters"></textarea>
            <p v-if="regexError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ regexError }}</p>
          </div>
        </div>
      </div>
      <error-list :json-data="filteredData"/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import FileUploader from './components/FileUploader.vue';
import ErrorList from './components/ErrorList.vue';
import ThemeToggle from './components/ThemeToggle.vue';

const jsonData = ref(null);
const searchQuery = ref('');
const filterType = ref('');
const filterFile = ref('');
const excludeRegex = ref('');
const regexError = ref('');
const searchRegexError = ref('');
const darkMode = ref(localStorage.getItem('darkMode') === 'true');

// Load saved filters
const savedFilters = JSON.parse(localStorage.getItem('filters') || '{}');
searchQuery.value = savedFilters.searchQuery || '';
filterType.value = savedFilters.filterType || '';
filterFile.value = savedFilters.filterFile || '';
excludeRegex.value = savedFilters.excludeRegex || '';

const errorTypes = computed(() => {
  const types = new Set();
  if (jsonData.value?.files) {
    Object.values(jsonData.value.files).forEach(file => {
      file.messages?.forEach(error => {
        if (error.message) {
          const type = error.message.split(' ').slice(0, 2).join(' ');
          types.add(type);
        }
      });
    });
  }
  return Array.from(types).sort(); // Sort alphabetically
});

// Compute common prefix for file paths
const commonPrefix = computed(() => {
  if (!jsonData.value?.files) return '';
  const paths = Object.keys(jsonData.value.files);
  if (paths.length === 0) return '';

  // Find the shortest path to limit the prefix length
  const shortestPath = paths.reduce((a, b) => a.length <= b.length ? a : b);
  let prefix = '';
  for (let i = 0; i < shortestPath.length; i++) {
    const char = shortestPath[i];
    if (paths.every(path => path[i] === char)) {
      prefix += char;
    } else {
      break;
    }
  }
  // Ensure prefix ends at a directory boundary
  const lastSlash = prefix.lastIndexOf('/');
  return lastSlash >= 0 ? prefix.substring(0, lastSlash + 1) : '';
});

// File options for the dropdown
const fileOptions = computed(() => {
  if (!jsonData.value?.files) return [];
  const prefix = commonPrefix.value;
  return Object.keys(jsonData.value.files)
      .map(fullPath => ({
        fullPath,
        displayPath: prefix ? fullPath.substring(prefix.length) : fullPath
      }))
      .sort((a, b) => a.displayPath.localeCompare(b.displayPath)); // Optional: sort files alphabetically
});

const filteredData = computed(() => {
  if (!jsonData.value) return null;
  const filtered = {...jsonData.value, files: {}};

  // Parse exclude regex patterns
  let excludePatterns = [];
  try {
    excludePatterns = excludeRegex.value
        .split(',')
        .map(pattern => pattern.trim())
        .filter(pattern => pattern)
        .map(pattern => new RegExp(pattern));
    regexError.value = '';
  } catch (error) {
    regexError.value = 'Invalid exclude regex pattern(s). Some patterns may be ignored.';
  }

  // Parse search regex patterns
  let searchPatterns = [];
  try {
    searchPatterns = searchQuery.value
        .split(',')
        .map(pattern => pattern.trim())
        .filter(pattern => pattern)
        .map(pattern => new RegExp(pattern, 'i')); // Case-insensitive
    searchRegexError.value = '';
  } catch (error) {
    searchRegexError.value = 'Invalid search regex pattern(s). Some patterns may be ignored.';
  }

  Object.entries(jsonData.value.files).forEach(([fileName, fileData]) => {
    // Skip files matching any exclude regex
    if (excludePatterns.some(regex => regex.test(fileName))) {
      return;
    }

    let messages = fileData.messages || [];

    // Apply type filter
    if (filterType.value) {
      messages = messages.filter(error => error.message.includes(filterType.value));
    }

    // Apply search regex filter (OR condition)
    if (searchPatterns.length > 0) {
      messages = messages.filter(error =>
          searchPatterns.some(regex =>
              regex.test(error.message) || regex.test(fileName)
          )
      );
    }

    // Apply file filter
    if (filterFile.value && fileName !== filterFile.value) {
      return;
    }

    if (messages.length > 0) {
      filtered.files[fileName] = {...fileData, messages};
    }
  });

  return filtered;
});

const handleFileLoaded = file => {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      jsonData.value = JSON.parse(e.target.result);
    } catch (error) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
};

const saveFilters = () => {
  localStorage.setItem(
      'filters',
      JSON.stringify({
        searchQuery: searchQuery.value,
        filterType: filterType.value,
        filterFile: filterFile.value,
        excludeRegex: excludeRegex.value,
      })
  );
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('darkMode', darkMode.value);
};
</script>