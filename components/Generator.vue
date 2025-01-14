<template>
  <div class="flex flex-col w-full items-center z-50">
    <div
      class="drop-shadow-xl rounded-xl p-6 w-[70%] max-lg:w-[90%] dark:shadow-lg dark:shadow-emerald-950 dark:bg-gray-800 bg-gray-100"
    >
      <h2 class="text-center text-3xl dark:text-white">
        Générer une série de posts
      </h2>
      <hr class="mt-4 dark:border-emerald-300 border-emerald-600" />
      <div class="flex flex-col items-center mt-8">
        <div class="flex flex-row items-center mb-4">
          <label for="postsCount" class="font-bold dark:text-white text-xl"
            >Nombre de posts :
            <span
              class="dark:text-emerald-300 text-emerald-600 ml-2 text-2xl"
              >{{ postsCount }}</span
            ></label
          >
          <button
            @click="postsCount > 1 ? postsCount-- : null"
            class="dark:bg-gray-700 bg-gray-200 rounded-lg ml-2 p-1 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600"
          >
            <Icon
              name="ic:round-minus"
              class="text-2xl dark:text-emerald-300 text-emerald-600"
            />
          </button>
          <button
            @click="postsCount++"
            class="dark:bg-gray-700 bg-gray-200 rounded-lg ml-2 p-1 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600"
          >
            <Icon
              name="ic:round-plus"
              class="text-2xl dark:text-emerald-300 text-emerald-600"
            />
          </button>
        </div>
        <div class="flex flex-col mt-4 lg:w-96">
          <label for="postsIdeas" class="font-bold dark:text-white text-xl"
            >Idées 💡:</label
          >
          <div class="flex">
            <input
              type="text"
              v-model="themeIdea"
              placeholder="Vuejs"
              class="ml-2 rounded-lg dark:bg-gray-700 bg-gray-200 dark:text-white p-2 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600"
            />
            <button
              v-if="!isLoadingIdeas"
              @click="generatePostsIdeas"
              class="ml-4 w-32 h-10 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Générer
            </button>
            <button
              v-if="isLoadingIdeas"
              class="ml-4 w-32 h-10 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Icon name="eos-icons:three-dots-loading" class="text-3xl" />
            </button>
          </div>
        </div>
        <div class="flex flex-col mt-4">
          <label for="themes" class="font-bold dark:text-white text-xl"
            >{{ postsCount > 1 ? "Thèmes" : "Thème" }} :</label
          >
          <div
            v-for="(post, index) in postsCount"
            :key="index"
            class="flex items-center mt-2"
          >
            <textarea
              v-model="tempThemes[index]"
              class="p-2 shadow rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 h-20 lg:w-96 w-80 dark:bg-gray-700 bg-gray-200 dark:text-white"
              placeholder="L'impact d'une landing page sur votre entreprise"
            ></textarea>
          </div>
        </div>
        <button
          v-if="!isLoading"
          @click="generatePosts"
          :disabled="isLoadingIdeas || isLoading"
          class="mt-4 w-32 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-xl transition duration-200"
        >
          Générer
        </button>
        <button
          v-if="isLoading"
          class="mt-4 max-w-32 min-w-32 min-h-10 max-h-10 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow flex justify-center items-center"
        >
          <Icon name="eos-icons:three-dots-loading" class="text-3xl" />
        </button>
      </div>
      <Toast
        :modelValue="toastVisible"
        :title="toastType === 'error' ? 'Erreur' : 'Information'"
        :message="toastMessage"
        :type="toastType"
        @update:modelValue="toastVisible = false"
      />
    </div>

    <div class="w-[70%] max-lg:w-[90%] mt-4">
      <GeneratedPosts
        :posts="generatedPosts"
        :themes="tempThemes"
        :isLoadingEdit="isLoadingEdit"
        :endLoading="endLoading"
        @edit-post="handleEditPost"
      />
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
      isLoadingIdeas: false,
      isLoadingEdit: false,
      endLoading: false,
      toastVisible: false,
      toastMessage: "",
      toastType: "",
      themeIdea: "",
    };
  },
  methods: {
    async generatePosts() {
      this.themes = this.tempThemes.filter((theme) => theme);

      if (this.themes.length === 0) {
        this.showToast(
          "Veuillez entrer au moins un thème avant de générer des posts.",
          "error"
        );
        return;
      }

      this.generatedPosts = [];
      this.isLoading = true;
      for (let theme of this.themes) {
        const prompt = `Rédige un post LinkedIn captivant sur le thème : ${theme}. Adopte un ton professionnel mais accessible. Termine par une question pour encourager les commentaires.`;
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
      this.isLoadingIdeas = true;
      const prompt = `Génére ${this.postsCount} idées de posts ${this.themeIdea} pour LinkedIn sous forme de phrases courtes, séparées par un point-virgule, sans introduction ni conclusion.`;
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

      if (this.tempThemes.every((theme) => !theme)) {
        this.tempThemes = postContent
          .split(";")
          .map((idea) => idea.trim())
          .slice(0, this.postsCount);
      }

      this.isLoadingIdeas = false;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastVisible = true;
    },
    handleEditPost(editPrompt, index) {
      const postToEdit = this.generatedPosts[index];
      const prompt = `Reformule ce post pour qu'il corresponde aux critères suivants : ${editPrompt}. Post original : ${postToEdit}`;

      this.reformulatePost(prompt, index);
    },
    async reformulatePost(prompt, index) {
      this.endLoading = false;
      this.isLoadingEdit = true;
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
        const reformulatedPost = data.choices[0].message.content.trim();

        this.generatedPosts[index] = reformulatedPost;
        this.isLoadingEdit = false;
        this.endLoading = true;
      } catch (error) {
        console.error("Erreur lors de la reformulation du post:", error);
      }
    },
  },
};
</script>
