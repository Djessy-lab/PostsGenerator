<template>
  <div class="min-h-[100vh] relative">
    <div
      class="absolute inset-0 h-full w-full dark:bg-gray-950 dark:bg-[linear-gradient(to_right,#022c22,transparent_1px),linear-gradient(to_bottom,#022c22,transparent_1px)] bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] z-0"
    ></div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
* {
  font-family: "Jersey 15", sans-serif;
}
</style>
