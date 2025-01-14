<template>
  <div class="relative">
    <button
      @click="themeToggle"
      :class="[
        colorMode.value === 'dark' ? 'text-emerald-300' : 'text-emerald-600',
        'text-2xl sticky top-3 left-[97%] z-50 focus:outline-none focus:ring-1 dark:focus:ring-emerald-300 focus:ring-emerald-600 rounded-lg h-6',
      ]"
    >
      <Icon
        v-if="colorMode.value === 'dark'"
        name="line-md:sunny-filled-loop-to-moon-filled-loop-transition"
      />
      <Icon
        v-if="colorMode.value === 'light'"
        name="line-md:moon-alt-to-sunny-outline-loop-transition"
      />
    </button>
    <div class="flex justify-center">
      <h1 class="text-center text-6xl dark:text-emerald-300 text-emerald-600 mt-2">
        Posts Generator
      </h1>
    </div>
    <div class="flex justify-center mt-20">
      <Generator />
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      colorMode: useColorMode(),
    };
  },
  methods: {
    themeToggle() {
      this.colorMode.value = this.colorMode.value === "dark" ? "light" : "dark";
    },
  },
};
</script>
