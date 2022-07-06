<template>
  <q-page class="">
    <div class="row items-center justify-center">
      <h1 class="col-6">RELAIS</h1>
      <q-btn
        class="col-2"
        label="Ajouter un relais"
        color="primary"
        @click="isDialogopen = true"
      />
    </div>
    <div class="row justify-center q-py-md">
      <div class="col-10" v-if="this.$data.relays !== []">
        <q-card
          class="my-card float-left q-ma-sm"
          v-for="(relay, index) in this.$data.relays"
          :key="index"
        >
          <q-card-section
            v-bind:class="[
              this.selectedCard === index
                ? 'bg-primary text-white'
                : 'bg-grey-8 text-white',
            ]"
          >
            <div class="text-h6">{{ relay }}</div>
            <div class="text-subtitle2">Relais {{ index + 1 }}</div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn @click="selectRelay(relay, index)" flat>Selectionner</q-btn>
            <q-btn @click="removeRelay(relay)" flat>Supprimer</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-if="this.$data.selectedRelay != null">
      <MessageDetails
        :key="this.$data.selectedRelay"
        v-bind:unit="this.$data.selectedRelay"
      />
    </div>

    <q-dialog v-model="isDialogopen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Identifient du relais :</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="relayToAdd"
            autofocus
            @keyup.enter="addRelay()"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Ajouter" @click="addRelay()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import api from "src/api";
import auth from "src/auth";
import MessageDetails from "src/components/MessageDetails.vue";

export default defineComponent({
  components: { MessageDetails },
  name: "IndexPage",
  data() {
    return {
      relayToAdd: null,
      isDialogopen: false,
      relays: null,
      selectedRelay: null,
      selected: 1,
    };
  },

  methods: {
    selectRelay(relay, index) {
      this.$data.selectedRelay = relay;
      this.selected = index;
    },
    addRelay() {
      this.$data.isDialogopen = false;
      const newTable = auth.user.relays.concat(this.$data.relayToAdd);
      //ajout du device dans la BDD
      api
        .service("users")
        .patch(auth.user._id, {
          relays: newTable,
        })
        .then(() => {
          auth.user.relays = newTable;
          this.$data.relays = newTable;
          this.$data.relayToAdd = "";
        })
        .catch((e) => {});
    },
    removeRelay(relayToRemove) {
      const filteredTable = this.$data.relays.filter(
        (element) => element !== relayToRemove
      );
      // suppression du device dans la BDD
      api
        .service("users")
        .patch(auth.user._id, {
          relays: filteredTable,
        })
        .then(() => {
          auth.user.relays = filteredTable;
          this.$data.relays = filteredTable;
        })
        .catch((e) => {});
    },
  },

  mounted() {
    this.$data.relays = auth.user.relays;
    const users = api.service("users");
  },

  setup() {
    return {};
  },
});
</script>
