<template>
  <div class="row justify-center col-10 q-py-md" v-if="this.$data.row !== null">
    <q-table
      :title="device"
      :rows="this.$data.row"
      :columns="columns"
      row-key="createdAt"
    />
  </div>

  <div class="justify-center col-10" v-if="this.$data.isMessageEmpty !== true">
    <DetailsChart v-bind:deviceData="this.$data.row" />
  </div>
  <div class="row justify-center col-10" v-else>
    <h4>Pas de données pour ce device</h4>
  </div>
</template>

<script>
import api from "src/api";
import DetailsChart from "src/components/DetailsChart.vue";
import moment from "moment";

const columns = [
  {
    name: "name",
    required: true,
    label: "crée le ",
    align: "left",
    field: (row) => row.createdAt,
    sortable: true,
  },
  {
    name: "temp1",
    align: "center",
    label: "temperature 1 (°C)",
    field: "temp1",
    sortable: true,
  },
  {
    name: "temp2",
    align: "center",
    label: "temperature 2 (°C)",
    field: "temp2",
    sortable: true,
  },
  {
    name: "relativeHumidity",
    align: "center",
    label: "Humidité (%)",
    field: "relativeHumidity",
    sortable: true,
  },
  {
    name: "airPressure ",
    align: "center",
    label: "Pression (hPa)",
    field: "airPressure",
    sortable: true,
  },
  {
    name: "rssi",
    align: "center",
    label: "Puissance signal (dB)",
    field: "rssi",
    sortable: true,
  },
  {
    name: "relay",
    align: "center",
    label: "relais",
    field: "relay",
    sortable: true,
  },
];

export default {
  name: "MessageDetails",
  props: {
    unit: {
      type: String,
      required: true,
    },
  },

  components: { DetailsChart },

  data() {
    return {
      row: null,
      isDevice: false,
      isMessageEmpty: true,
    };
  },

  methods: {
    fetchMessagesFromUnit() {
      api
        .service("messages")
        .find({
          query: this.isDevice
            ? {
                device: this.unit,
              }
            : {
                relay: this.unit,
              },
        })
        .then((response) => {
          if (response.data.length !== 0) {
            this.$data.isMessageEmpty = false;
            response.data.map((message) => {
              message.createdAt = moment(message.createdAt).format(
                "MM/DD/YYYY hh:mm:ss"
              );
            });
            this.$data.row = response.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    //Identify if unit is a device or a relay
    if (this.unit.includes(":")) {
      this.$data.isDevice = true;
    }
    this.fetchMessagesFromUnit();
  },

  setup() {
    return { columns };
  },
};
</script>
