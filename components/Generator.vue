<template>
  <div class="flex flex-col w-full items-center">
    <div class="shadow-lg rounded-xl p-6 w-[70%] border border-lime-300 bg-gray-800">
      <h2 class="text-center text-3xl text-white">Générer une série de posts</h2>
      <hr class="mt-4 border-lime-300">
      <div class="flex flex-col items-center mt-8">
        <div class="flex flex-row items-center mb-4">
          <label for="postsCount" class="font-bold text-white text-xl">Nombre de posts : <span
              class="text-lime-300 ml-2 text-2xl">{{ postsCount }}</span></label>
          <button @click="postsCount > 1 ? postsCount-- : null" class="bg-gray-700 rounded-lg ml-2 p-1">
            <Icon name="ic:round-minus" class="text-2xl text-lime-300" />
          </button>
          <button @click="postsCount++" class="bg-gray-700 rounded-lg ml-2 p-1">
            <Icon name="ic:round-plus" class="text-2xl text-lime-300" />
          </button>
        </div>
        <div class="flex mt-4">
          <label for="postsIdeas" class="font-bold text-white text-xl">Générer des idées de posts :</label>
          <button @click="generatePostsIdeas"
            class="ml-4 w-32 bg-gray-900 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded-lg shadow-xl transition duration-200">Générer</button>
        </div>
        <div class="flex flex-col mt-4">
          <label for="themes" class="font-bold text-white text-xl">{{ postsCount > 1 ? "Thèmes" : "Thème" }} :</label>
          <div v-for="(post, index) in postsCount" :key="index" class="flex items-center mt-2">
            <textarea v-model="tempThemes[index]"
              class="p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300 h-20 w-96 bg-gray-700 text-white"
              placeholder="L'impact d'une landing page sur votre entreprise"></textarea>
          </div>
        </div>
        <button v-if="!isLoading" @click="generatePosts"
          class="mt-4 w-32 bg-gray-900 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded-lg shadow-xl transition duration-200">
          Générer
        </button>
        <button v-if="isLoading"
          class="mt-4 max-w-32 min-w-32 min-h-10 max-h-10 bg-gray-900 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded-lg shadow flex justify-center items-center">
          <Icon name="eos-icons:three-dots-loading" class="text-3xl" />
        </button>
      </div>
      <Toast :modelValue="toastVisible" :title="toastType === 'error' ? 'Erreur' : 'Information'"
        :message="toastMessage" :type="toastType" @update:modelValue="toastVisible = false" />
    </div>

    <div class="w-[70%] mt-4">
      <GeneratedPosts :posts="generatedPosts" :themes="tempThemes" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Generator",
  data() {
    return {
      postsCount: 1,
      tempThemes: Array(1).fill(""),
      themes: [],
      generatedPosts: [],
      isLoading: false,
      toastVisible: false,
      toastMessage: '',
      toastType: '',
    };
  },
  methods: {
    async generatePosts() {
      this.themes = this.tempThemes.filter(theme => theme);

      if (this.themes.length === 0) {
        this.showToast("Veuillez entrer au moins un thème avant de générer des posts.", "error");
        return;
      }

      console.log(this.themes);
      this.generatedPosts = [];
      this.isLoading = true;
      for (let theme of this.themes) {
        const prompt = `Rédige un post LinkedIn captivant sur le thème : ${theme}. Adopte un ton professionnel mais accessible. Termine par une question pour encourager les commentaires. Ajoute ma signature : Djessy Coiffé`;
        try {
          const response = await fetch(
            "https://api.mistral.ai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${useRuntimeConfig().public.API_KEY}`,
              },
              body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
                model: "mistral-large-latest",
              }),
            }
          );
          const data = await response.json();
          const postContent = data.choices[0].message.content.trim();
          this.generatedPosts.push(postContent);
        } catch (error) {
          console.error("Erreur lors de la génération du post:", error);
        }
      }
      this.isLoading = false;
    },
    async generatePostsIdeas() {
      this.isLoading = true;
      const prompt = `Génére ${this.postsCount} idées de posts pour LinkedIn sous forme de phrases courtes, séparées par un point-virgule, sans introduction ni conclusion. Les idées doivent être liées au développement web, particulièrement l'ecosysteme javascript Vuejs, les landing pages et la conversion clients`;
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useRuntimeConfig().public.API_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            model: "mistral-large-latest",
          }),
        }
      );
      const data = await response.json();
      const postContent = data.choices[0].message.content.trim();

      if (this.tempThemes.every(theme => !theme)) {
        this.tempThemes = postContent.split(';').map(idea => idea.trim()).slice(0, this.postsCount);
      }

      this.isLoading = false;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastVisible = true;
    },
  },
};
</script>
