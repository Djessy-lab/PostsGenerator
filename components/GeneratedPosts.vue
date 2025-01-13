<template>
  <div v-if="posts.length" class="shadow-lg rounded-xl p-6 border border-lime-300 bg-gray-800 relative">
  <button @click="exportPosts" class="absolute right-3 top-3 w-32 h-10 bg-gray-900 hover:bg-gray-950 text-white rounded-lg">Exporter</button>
    <h3 class="font-bold text-gray-300">Posts générés :</h3>
    <table class="min-w-full border-collapse border border-gray-600 rounded-lg mt-4">
      <thead>
        <tr>
          <th class="border border-gray-600 p-2 text-left text-white">Thème</th>
          <th class="border border-gray-600 p-2 text-left text-white">Contenu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="index" class="border-b border-gray-600">
          <td class="border border-gray-600 p-2 text-white">{{ themes[index] }}</td>
          <td class="border border-gray-600 p-2 text-white">{{ post }}</td>
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
