<template>
  <highcharts
    v-for="(options, index) in chartOptions"
    :key="index"
    :options="options"
    ref="highcharts"
    class="chart"
  ></highcharts>
</template>

<script>
import { defineComponent } from "vue";
import api from "src/api";
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";

exportingInit(Highcharts);

function sync(vm, event, type) {
  vm.$refs.highcharts.forEach(({ chart }) => {
    if (chart === this.series.chart) return;
    chart.series.forEach((series) => {
      series.data.forEach((point) => {
        if (point.x === this.x) {
          if (type === "over") {
            point.setState("hover");
            chart.tooltip.refresh(point);
            chart.xAxis[0].drawCrosshair(event, point);
          } else {
            point.setState();
            chart.tooltip.hide();
            chart.xAxis[0].hideCrosshair();
          }
        }
      });
    });
  });
}

export default {
  name: "DetailsChart",
  props: ["unitData"],

  components: {
    highcharts: Chart,
  },

  data() {
    return {
      row: null,
      chartOptions: [],
      formatedData: {
        xData: [],
        datasets: [
          {
            name: "Temp1",
            data: [],
            unit: "°C",
            type: "line",
            ValueDecimals: 1,
          },
          {
            name: "Temp2",
            data: [],
            unit: "°C",
            type: "line",
            ValueDecimals: 1,
          },
          {
            name: "Humidité",
            data: [],
            unit: "%",
            type: "area",
            ValueDecimals: 1,
          },
          {
            name: "Pression",
            data: [],
            unit: "hPa",
            type: "area",
            ValueDecimals: 1,
          },
          {
            name: "Puissance signal",
            data: [],
            unit: "dB",
            type: "area",
            ValueDecimals: 1,
          },
        ],
      },
    };
  },

  methods: {
    genOptions(vm, dataset, xData) {
      console.log(dataset);
      return {
        chart: {
          marginLeft: 40, // Keep all charts left aligned
          spacingTop: 20,
          spacingBottom: 20,
        },
        exporting: { enabled: false },
        title: {
          text: dataset.name,
          align: "left",
          margin: 0,
          x: 30,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          crosshair: false,
          categories: xData,
        },
        yAxis: {
          title: {
            text: null,
          },
        },
        tooltip: {
          positioner: function () {
            return {
              // right aligned
              x: this.chart.chartWidth - this.label.width,
              y: 10, // align to title
            };
          },
          borderWidth: 0,
          backgroundColor: "none",
          pointFormat: "{point.y}",
          headerFormat: "",
          shadow: false,
          style: {
            fontSize: "18px",
          },
          valueDecimals: dataset.valueDecimals,
        },
        plotOptions: {
          series: {
            point: {
              events: {
                mouseOver: function (event) {
                  sync.call(this, vm, event, "over");
                },
                mouseOut: function (event) {
                  sync.call(this, vm, event, "out");
                },
              },
            },
          },
        },
        series: [
          {
            data: dataset.data,
            name: dataset.name,
            type: dataset.type,
            color: dataset.color,
            fillOpacity: 0.3,
            tooltip: {
              valueSuffix: " " + dataset.unit,
            },
          },
        ],
      };
    },

    formatData(baseData) {
      baseData.map((data, index) => {
        this.$data.formatedData.xData[index] = data.createdAt;
        this.$data.formatedData.datasets[0].data[index] = data.temp1;
        this.$data.formatedData.datasets[1].data[index] = data.temp2;
        this.$data.formatedData.datasets[2].data[index] = data.relativeHumidity;
        this.$data.formatedData.datasets[3].data[index] = data.airPressure;
        this.$data.formatedData.datasets[4].data[index] = data.rssi;
      });

      this.chartOptions = this.$data.formatedData.datasets.map((dataset, i) => {
        dataset.data = dataset.data.map((val, j) => [
          this.$data.formatedData.xData[j],
          val,
        ]);
        dataset.color = Highcharts.getOptions().colors[i];
        return this.genOptions(this, dataset, this.$data.formatedData.xData);
      });
    },
  },

  mounted() {
    this.formatData(this.unitData);
  },
};
</script>
