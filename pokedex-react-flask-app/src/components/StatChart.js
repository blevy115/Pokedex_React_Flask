import React, { useMemo } from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  maintainAspectRatio: false,
  scales: {
    r: {
      suggestedMin: 0, // Set the minimum value of the scale to 0
      suggestedMax: 140, // Set the maximum value of the scale to 200
      stepSize: 40, // Set the step size of the scale to 50
      ticks: {
        display: false,
        beginAtZero: true, // Start the ticks at zero
        precision: 0, // Set the precision of the ticks to 0
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "black",
      anchor: "end",
      align: "start",
      offset: 10,
      formatter: function (value) {
        return value;
      },
    },
  },
};

export default function StatChart({ stats }) {
  const data = useMemo(() => {
    return {
      labels: stats.map((stat) => stat.pokemon_v2_stat.name),
      datasets: [
        {
          label: "Stats",
          data: stats.map((stat) => stat.base_stat),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, []);
  return (
    <div className="stat-container">
    <Radar
      data={data}
      options={options}
      plugins={[ChartDataLabels]}
      redraw={true}
    />
    </div>
  );
}
