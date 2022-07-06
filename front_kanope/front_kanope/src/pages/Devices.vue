<template>
  <q-page class="">
    <div class="row items-center justify-center">
      <h1 class="col-6">DEVICE</h1>
      <q-btn
        class="col-2"
        label="Ajouter un device"
        color="primary"
        @click="isDialogopen = true"
      />
    </div>
    <div class="row justify-center q-py-md">
      <div class="col-10" v-if="this.$data.devices !== []">
        <q-card
          class="my-card float-left q-ma-sm"
          v-for="(device, index) in this.$data.devices"
          :key="index"
        >
          <q-card-section
            v-bind:class="[
              this.selectedCard === index
                ? 'bg-primary text-white'
                : 'bg-grey-8 text-white',
            ]"
          >
            <div class="text-h6">{{ device }}</div>
            <div class="text-subtitle2">Device {{ index + 1 }}</div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn @click="selectDevice(device, index)" flat
              >Selectionner</q-btn
            >
            <q-btn @click="removeDevice(device)" flat>Supprimer</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-if="this.$data.selectedDevice != null">
      <MessageDetails
        :key="this.$data.selectedDevice"
        v-bind:unit="this.$data.selectedDevice"
      />
    </div>

    <q-dialog v-model="isDialogopen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adresse MAC du device :</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="deviceToAdd"
            autofocus
            @keyup.enter="addDevice()"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Ajouter" @click="addDevice()" v-close-popup />
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
      deviceToAdd: null,
      isDialogopen: false,
      devices: null,
      selectedDevice: null,
      selectedCard: null,
    };
  },

  methods: {
    selectDevice(device, index) {
      this.$data.selectedDevice = device;
      this.$data.selectedCard = index;
    },
    addDevice() {
      this.$data.isDialogopen = false;
      const newTable = auth.user.devices.concat(this.$data.deviceToAdd);
      //ajout du device dans la BDD
      api
        .service("users")
        .patch(auth.user._id, {
          devices: newTable,
        })
        .then(() => {
          auth.user.devices = newTable;
          this.$data.devices = newTable;
          this.$data.deviceToAdd = "";
        })
        .catch((e) => {});
    },
    removeDevice(deviceToRemove) {
      const filteredTable = this.$data.devices.filter(
        (element) => element !== deviceToRemove
      );
      // suppression du device dans la BDD
      api
        .service("users")
        .patch(auth.user._id, {
          devices: filteredTable,
        })
        .then(() => {
          auth.user.devices = filteredTable;
          this.$data.devices = filteredTable;
        })
        .catch((e) => {});
    },
  },

  mounted() {
    this.$data.devices = auth.user.devices;
    const users = api.service("users");
  },

  setup() {
    return {};
  },
});
</script>
