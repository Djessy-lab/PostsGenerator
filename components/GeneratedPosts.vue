<template>
  <div v-if="posts.length" class="shadow-lg rounded-xl p-6 dark:border dark:border-lime-300 dark:bg-gray-800 bg-gray-100 relative">
  <button @click="exportPosts" class="absolute right-3 top-3 w-32 h-10 bg-gray-900 hover:bg-gray-950 text-white rounded-lg">Exporter</button>
    <h3 class="font-bold dark:text-gray-300">Posts générés :</h3>
    <table class="min-w-full border-collapse border border-gray-600 mt-4">
      <thead>
        <tr>
          <th class="border border-gray-600 p-2 text-left dark:text-white">Thème</th>
          <th class="border border-gray-600 p-2 text-left dark:text-white">Contenu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="index" class="border-b border-gray-600">
          <td class="border border-gray-600 p-2 dark:text-white">{{ themes[index] }}</td>
          <td class="border border-gray-600 p-2 dark:text-white">{{ post }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "GeneratedPosts",
  props: {
    posts: {
      type: Array,
      required: true,
    },
    themes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    exportPosts() {
      let csvContent = "Date de publication,Thème,Contenu\n";
      this.posts.forEach((post, index) => {
        const theme = this.themes[index] || "";
        csvContent += `,"${theme}","${post.replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "posts.csv";
      link.click();
    },
  },
};
</script>
