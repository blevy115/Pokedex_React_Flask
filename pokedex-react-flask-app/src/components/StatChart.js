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

const defaultValue = {
  hp: 0,
  attack: 0,
  defense: 0,
  "special-attack": 0,
  "special-defense": 0,
  speed: 0,
};

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
  const [level, setLevel] = useState(50);
  const [ivs, setIvs] = useState({ ...defaultValue });
  const [evs, setEvs] = useState({ ...defaultValue });
  const convertedStats = useMemo(() => convertStats(stats), [stats]);
  const calculatedStatsValues = useMemo(
    () =>
      calculateStats({
        baseStats: stats,
        nature: selectedNature,
        level,
        ivs,
        evs,
      }),
    [stats, selectedNature, level, ivs, evs]
  );
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

  function handleIvChange(event, iv) {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setIvs({ ...ivs, [iv]: 0 });
    } else if (Number(inputValue) >= 0 && Number(inputValue) <= 31) {
      setIvs({ ...ivs, [iv]: parseInt(inputValue) });
    }
  }

  function handleEvChange(event, ev) {
    const inputValue = event.target.value;
    const otherEvSum = Object.values({ ...evs, [ev]: 0 }).reduce(
      (acc, val) => acc + val,
      0
    );
    if (inputValue === "") {
      setEvs({ ...evs, [ev]: 0 });
    } else if (
      Number(inputValue) >= 0 &&
      Number(inputValue) <= 252 &&
      otherEvSum + Number(inputValue) <= 510
    ) {
      setEvs({ ...evs, [ev]: parseInt(inputValue) });
    }
  }

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
          <label htmlFor="nature-select">Nature</label>
          <select
            id="nature-select"
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
          <div>
            <label htmlFor="level-select">Level</label>
            <select
              id="level-select"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            >
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <p>Ivs</p>
          <div className="values-container">
            {Object.keys(ivs).map((iv, i) => (
              <div key={i} className="value-element">
                <label htmlFor={`${iv}-iv`}>{iv}</label>
                <input
                  id={`${iv}-iv`}
                  value={Number(ivs[iv]).toString()}
                  type="number"
                  min="0"
                  max="31"
                  onChange={(event) => handleIvChange(event, iv)}
                />
              </div>
            ))}
          </div>
          <p>Evs</p>
          <div className="values-container">
            {Object.keys(evs).map((ev, i) => (
              <div key={i} className="value-element">
                <label htmlFor={`${ev}-ev`}>{ev}</label>
                <input
                  id={`${ev}-ev`}
                  value={Number(evs[ev]).toString()}
                  type="number"
                  min="0"
                  max="252"
                  onChange={(event) => handleEvChange(event, ev)}
                />
              </div>
            ))}
          </div>
        </>
      ) : undefined}
    </>
  );
}
