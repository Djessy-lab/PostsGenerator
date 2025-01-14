<template>
  <div class="dark:bg-gray-950 bg-white relative">
    <button
      @click="themeToggle"
      :class="[
        colorMode.value === 'dark' ? 'text-lime-300' : 'text-lime-600',
        'text-2xl absolute top-3 right-3 focus:outline-none focus:ring-2 dark:focus:ring-lime-300 focus:ring-lime-600 rounded-lg',
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
      <h1 class="text-center text-6xl dark:text-lime-300 text-lime-600 mt-2">
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
