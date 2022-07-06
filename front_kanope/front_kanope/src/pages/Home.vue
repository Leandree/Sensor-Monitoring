<template>
  <q-page class="flex flex-center">
    <h1>TEST TECHNIQUE KANOPE</h1>
    <!-- <h2>compte connecté : {{ this.$data.username }}</h2> -->
    <h3>LEANDRE CARPENTIER</h3>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import auth from "src/auth.js";

export default defineComponent({
  name: "IndexPage",
  // data() {
  //   return { username: auth.user.email };
  // },
});
</script>
