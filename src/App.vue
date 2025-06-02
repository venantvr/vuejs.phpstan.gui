<template>
  <div :class="darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'" class="min-h-screen flex">
    <!-- Sidebar -->
    <sidebar v-model:open="sidebarOpen">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4">Menu</h2>
        <p>Custom sidebar content goes here.</p>
      </div>
    </sidebar>
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <div class="container mx-auto p-4">
        <header class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Vue Template</h1>
          <theme-toggle v-model:darkMode="darkMode"/>
        </header>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import Sidebar from './components/Sidebar.vue';
import ThemeToggle from './components/ThemeToggle.vue';

const darkMode = ref(localStorage.getItem('darkMode') === 'true');
const sidebarOpen = ref(false);

watch(darkMode, (newValue) => {
  localStorage.setItem('darkMode', newValue);
});
</script>