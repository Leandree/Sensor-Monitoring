<template>
  <q-page class="flex flex-center">
    <p>{{ this.title }}</p>
    <div>
      <q-form class="q-gutter-md">
        <q-input
          outlined
          v-model="email"
          label="Identifiant"
          type="Identifiant"
          name="Identifiant"
          autofocus
        />
        <q-input
          outlined
          v-model="password"
          label="Mot de passe"
          type="password"
          name="email"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Se connecter"
          @click="login()"
        />
        <q-btn
          color="black"
          text-color="white"
          label="S'inscrire"
          @click="register()"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import auth from "src/auth";
import { useQuasar } from "quasar";

export default {
  data() {
    return {
      showDialog: true,
      email: null,
      password: null,
    };
  },
  computed: {},
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },
    onHide() {
      // Workaround needed because of timing issues (sequencing of 'hide' and 'ok' events) ...
      setTimeout(() => {
        this.goHome();
      }, 50);
    },
    register() {
      auth
        .register(this.email, this.password)
        .then(() => {
          this.showNotifSuccessRegister();
          this.$data.password = "";
        })
        .catch((e) => {
          if (e.className === "conflict") {
            this.showNotifErrorRegister();
          }
        });
    },
    login() {
      auth.login(this.email, this.password).catch((e) => {
        if (e.className === "not-authenticated") {
          this.showNotifErrorLogin();
        }
      });
    },
  },
  mounted() {},
  beforeUnmount() {},
  setup() {
    const $q = useQuasar();

    return {
      showNotifErrorLogin() {
        $q.notify({
          message: "Identifiant ou mot de passe incorrect",
          icon: "announcement",
          color: "red",
        });
      },
      showNotifErrorRegister() {
        $q.notify({
          message: "Identifiant déjà utilisé",
          icon: "announcement",
          color: "red",
        });
      },
      showNotifSuccessRegister() {
        $q.notify({
          message: "Inscription effectuée",
          icon: "check_circle",
          color: "green",
        });
        $q.notify({
          message: "Veuillez entrer de nouveau votre mot de passe",
          icon: "info",
          color: "black",
        });
      },
    };
  },
};
</script>

<style lang="styl"></style>
