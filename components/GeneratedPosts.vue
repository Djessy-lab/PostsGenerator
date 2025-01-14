<template>
  <div
    v-if="posts.length"
    class="drop-shadow-xl dark:shadow-lg dark:shadow-emerald-950 rounded-xl p-6 dark:bg-gray-800 bg-gray-100 relative z-50 my-20"
  >
    <h3 class="font-bold dark:text-gray-300">Posts générés :</h3>
    <button
      @click="exportPosts"
      class="absolute right-3 top-3 w-32 h-10 bg-gray-900 hover:bg-gray-950 text-white rounded-lg"
    >
      Exporter
    </button>
    <div>
      <table class="min-w-full border-collapse border border-gray-600 mt-4">
        <thead>
          <tr>
            <th class="border border-gray-600 p-2 text-left dark:text-white">
              Thème
            </th>
            <th class="border border-gray-600 p-2 text-left dark:text-white">
              Contenu
            </th>
            <th class="border border-gray-600 p-2 text-left dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(post, index) in posts"
            :key="index"
            class="border-b border-gray-600"
          >
            <td class="border border-gray-600 p-2 dark:text-white">
              {{ themes[index] }}
            </td>
            <td class="border border-gray-600 p-2 dark:text-white">
              <div v-if="editMode[index]" class="flex w-full mb-2">
                <input
                  type="text"
                  class="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 mr-2 shadow focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600"
                  placeholder="Reformule ce post pour ..."
                  v-model="editPrompt"
                /><button
                  v-if="!isLoadingEdit"
                  @click="editPost(index)"
                  class="max-w-32 min-w-32 min-h-10 max-h-10 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow flex justify-center items-center"
                >
                  Valider
                </button>
                <button
                  v-if="isLoadingEdit"
                  class="max-w-32 min-w-32 min-h-10 max-h-10 bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 dark:focus:ring-emerald-300 focus:ring-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow flex justify-center items-center"
                >
                  <Icon name="eos-icons:three-dots-loading" class="text-3xl" />
                </button>
              </div>
              <div
                :class="[
                  'overflow-y-scroll max-lg:max-h-[20rem]',
                  isLoadingEdit && editMode[index] ? 'opacity-30 relative' : '',
                ]"
              >
                <p class="font-serif text-sm">{{ post }}</p>
              </div>
              <Icon
                v-if="isLoadingEdit && editMode[index]"
                name="eos-icons:three-dots-loading"
                class="absolute top-[50%] right-[50%] text-7xl text-black opacity-none"
              />
            </td>
            <td class="border border-gray-600 p-2 dark:text-white">
              <div class="flex flex-col">
                <button @click="toggleEditMode(index)">
                  <Icon
                    class="text-2xl"
                    :title="!editMode[index] ? 'Éditer le post' : 'Annuler'"
                    :name="
                      editMode[index]
                        ? 'material-symbols:close-small-outline-rounded'
                        : 'material-symbols:edit-square-outline-rounded'
                    "
                  />
                </button>
                <button @click="deletePost(index)">
                  <Icon
                    class="text-2xl"
                    title="Supprimer le post"
                    name="material-symbols:delete-outline-rounded"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "GeneratedPosts",
  data() {
    return {
      editMode: [],
      editPrompt: "",
    };
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    themes: {
      type: Array,
      required: true,
    },
    isLoadingEdit: {
      type: Boolean,
      default: false,
    },
    endLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isLoadingEdit() {
      if (this.endLoading) {
        this.editMode = [];
        this.editPrompt = "";
      }
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
    deletePost(index) {
      this.posts.splice(index, 1);
    },
    toggleEditMode(index) {
      this.editMode[index] = !this.editMode[index];
    },
    editPost(index) {
      this.$emit("edit-post", this.editPrompt, index);
    },
  },
};
</script>
