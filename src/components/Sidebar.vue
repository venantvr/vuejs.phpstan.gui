<template>
  <div>
    <!-- Sidebar -->
    <div
        :class="['fixed inset-y-0 left-0 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-20 w-64', open ? 'translate-x-0' : '-translate-x-full']"
    >
      <div class="p-4">
        <button class="text-white mb-4" @click="closeSidebar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </button>
        <slot></slot>
      </div>
    </div>
    <!-- Overlay for mobile -->
    <div
        v-if="open"
        class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        @click="closeSidebar"
    ></div>
    <!-- Open Sidebar Button -->
    <button
        v-if="!open"
        class="fixed top-4 left-4 z-30 p-2 bg-gray-700 text-white rounded"
        @click="openSidebar"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const localOpen = ref(props.open);

watch(() => props.open, (newValue) => {
  localOpen.value = newValue;
});

const openSidebar = () => {
  console.log('Opening sidebar');
  localOpen.value = true;
  emit('update:open', true);
};

const closeSidebar = () => {
  console.log('Closing sidebar');
  localOpen.value = false;
  emit('update:open', false);
};
</script>