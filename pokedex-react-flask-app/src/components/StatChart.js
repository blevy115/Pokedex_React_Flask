import React, { useMemo, useState, useEffect } from "react";
import { convertStats, calculateStats } from "../helpers/statModifier";
import { useQuery } from "@apollo/client";
import { GET_NATURES } from "../api/backend";
import { backEndClient } from "../api/clients";

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

const levelOptions = Array.from({ length: 100 }, (_, index) => index + 1);

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

export default function StatChart({ stats, isAFavourite }) {
  const { data: natureData, loading: natureDataLoading } = useQuery(
    GET_NATURES,
    {
      client: backEndClient,
    }
  );
  const [selectedNature, setSelectedNature] = useState({});
  const [level, setLevel] = useState(50)
  const convertedStats = useMemo(() => convertStats(stats), [stats]);
  const calculatedStatsValues = useMemo(() => calculateStats({baseStats: stats, nature: selectedNature, level}), [stats, selectedNature, level]);
  useEffect(() => {
    if (natureDataLoading || !isAFavourite) return;
    setSelectedNature(natureData.natures[0]);
  }, [natureData, isAFavourite, stats]);

  const data = useMemo(() => {
    return {
      labels: isAFavourite
        ? Object.keys(calculatedStatsValues)
        : Object.keys(convertedStats),
      datasets: [
        {
          label: "Stats",
          data: isAFavourite
            ? Object.values(calculatedStatsValues)
            : Object.values(convertedStats),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [convertedStats, calculatedStatsValues]);

  return (
    <>
      <div className="stat-container">
        <Radar
          data={data}
          options={options}
          plugins={[ChartDataLabels]}
          redraw={true}
        />
      </div>
      {!natureDataLoading && isAFavourite ? (
        <>
        <select
          value={selectedNature.name}
          onChange={(e) =>
            setSelectedNature(
              natureData.natures.find(
                (nature) => nature.name === e.target.value
              )
            )
          }
        >
          {natureData.natures.map((nature, i) => (
            <option key={i} value={nature.name}>
              {nature.name}
            </option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))}>
        {levelOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
        </>
      ) : undefined}
    </>
  );
}
