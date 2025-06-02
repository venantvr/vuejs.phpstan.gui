<template>
  <div class="mb-6">
    <h2 class="text-xl font-semibold mb-4">PHPStan JSON Viewer</h2>
    <file-uploader @file-loaded="handleFileLoaded"/>
    <div v-if="jsonData" class="mb-6">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/3">
            <input v-model="searchQuery" class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700" placeholder="Search errors or files (regex, e.g., error1, error2)" type="text" @input="saveFilters">
            <p v-if="searchRegexError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ searchRegexError }}</p>
          </div>
          <div class="w-full md:w-1/3">
            <input v-model="searchTypeQuery" class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700" placeholder="Search error types..." type="text">
            <select v-model="filterType" class="p-2 border rounded w-full mt-2 dark:bg-gray-800 dark:border-gray-700" @change="saveFilters">
              <option value="">All Error Types</option>
              <option v-for="type in filteredErrorTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="w-full md:w-1/3">
            <input v-model="searchFileQuery" class="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700" placeholder="Search files..." type="text">
            <select v-model="filterFile" class="p-2 border rounded w-full mt-2 dark:bg-gray-800 dark:border-gray-700" @change="saveFilters">
              <option value="">All Files</option>
              <option v-for="file in filteredFileOptions" :key="file.fullPath" :value="file.fullPath">{{ file.displayPath }}</option>
            </select>
          </div>
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
</template>

<script setup>
import {computed, ref} from 'vue';
import FileUploader from './FileUploader.vue';
import ErrorList from './ErrorList.vue';

const jsonData = ref(null);
const searchQuery = ref('');
const filterType = ref('');
const filterFile = ref('');
const excludeRegex = ref('');
const regexError = ref('');
const searchRegexError = ref('');
const searchTypeQuery = ref('');
const searchFileQuery = ref('');

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
  return Array.from(types).sort();
});

const filteredErrorTypes = computed(() => {
  if (!searchTypeQuery.value) return errorTypes.value;
  const query = searchTypeQuery.value.toLowerCase();
  return errorTypes.value.filter(type => type.toLowerCase().includes(query));
});

const commonPrefix = computed(() => {
  if (!jsonData.value?.files) return '';
  const paths = Object.keys(jsonData.value.files);
  if (paths.length === 0) return '';
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
  const lastSlash = prefix.lastIndexOf('/');
  return lastSlash >= 0 ? prefix.substring(0, lastSlash + 1) : '';
});

const fileOptions = computed(() => {
  if (!jsonData.value?.files) return [];
  const prefix = commonPrefix.value;
  return Object.keys(jsonData.value.files)
      .map(fullPath => ({
        fullPath,
        displayPath: prefix ? fullPath.substring(prefix.length) : fullPath
      }))
      .sort((a, b) => a.displayPath.localeCompare(b.displayPath));
});

const filteredFileOptions = computed(() => {
  if (!searchFileQuery.value) return fileOptions.value;
  const query = searchFileQuery.value.toLowerCase();
  return fileOptions.value.filter(file => file.displayPath.toLowerCase().includes(query));
});

const filteredData = computed(() => {
  if (!jsonData.value) return null;
  const filtered = {...jsonData.value, files: {}};
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
  let searchPatterns = [];
  try {
    searchPatterns = searchQuery.value
        .split(',')
        .map(pattern => pattern.trim())
        .filter(pattern => pattern)
        .map(pattern => new RegExp(pattern, 'i'));
    searchRegexError.value = '';
  } catch (error) {
    searchRegexError.value = 'Invalid search regex pattern(s). Some patterns may be ignored.';
  }
  Object.entries(jsonData.value.files).forEach(([fileName, fileData]) => {
    if (excludePatterns.some(regex => regex.test(fileName))) {
      return;
    }
    let messages = fileData.messages || [];
    if (filterType.value) {
      messages = messages.filter(error => error.message.includes(filterType.value));
    }
    if (searchPatterns.length > 0) {
      messages = messages.filter(error =>
          searchPatterns.some(regex =>
              regex.test(error.message) || regex.test(fileName)
          )
      );
    }
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
  if (!file) {
    alert('Please select a file');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      jsonData.value = JSON.parse(e.target.result);
    } catch (error) {
      alert('Invalid JSON file: ' + error.message);
    }
  };
  reader.onerror = error => {
    alert('Error reading file: ' + error.message);
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

const currentFilters = computed(() => ({
  searchQuery: searchQuery.value,
  filterType: filterType.value,
  filterFile: filterFile.value,
  excludeRegex: excludeRegex.value,
}));

const handleSavePreset = (preset) => {
  console.log('Preset saved:', preset);
};

const handleLoadPreset = (filters) => {
  searchQuery.value = filters.searchQuery || '';
  filterType.value = filters.filterType || '';
  filterFile.value = filters.filterFile || '';
  excludeRegex.value = filters.excludeRegex || '';
  saveFilters();
};
</script>