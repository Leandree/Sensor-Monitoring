<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Test Technique </q-toolbar-title>

        <q-btn flat to="/"> Home </q-btn>
        <q-btn flat to="/signinRegister" v-show="!authenticated">
          Sign In / Register
        </q-btn>
        <q-btn flat to="/relays" v-show="authenticated"> Relays </q-btn>
        <q-btn flat to="/devices" v-show="authenticated"> Devices </q-btn>
        <q-btn flat @click="signout()" v-show="authenticated"> Sign Out </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :user="user" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import auth from "src/auth";

export default defineComponent({
  name: "MainLayout",

  components: {
    // EssentialLink,
  },

  data() {
    return {
      user: null,
    };
  },
  computed: {
    authenticated() {
      return this.$data.user !== null;
    },
  },
  methods: {
    signout() {
      auth.signout().catch(() => {});
    },
    setUser(user) {
      this.$data.user = user;
    },
  },

  mounted() {
    auth
      .authenticate()
      .then((user) => {
        this.setUser(user);
      })
      .catch((e) => {
        this.setUser(null);
        this.$router.push({ path: "/" });
      });

    // On successful login
    auth.onAuthenticated((user) => {
      this.setUser(user);
      this.$router.push({ path: "/" });
    });

    // On logout
    auth.onLogout(() => {
      this.setUser(null);
      this.$router.push({ path: "/" });
    });
  },
  beforeUnmount() {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
