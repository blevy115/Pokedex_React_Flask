import React, { useMemo, useState, useEffect, useRef } from "react";
import { convertStats, calculateStats } from "../helpers/statModifier";
import { useQuery } from "@apollo/client";
import { GET_NATURES } from "../api/backend";
import { backEndClient } from "../api/clients";
import { modifyStatsForTable } from "../helpers/modifyForTable";
import Table from "./Table";

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

export default function StatChart({ baseStats, isAFavourite }) {
  const { data: natureData, loading: natureDataLoading } = useQuery(
    GET_NATURES,
    {
      client: backEndClient,
    }
  );
  const [nature, setNature] = useState({});
  const [level, setLevel] = useState(50);
  const [ivs, setIvs] = useState({ ...defaultValue });
  const [evs, setEvs] = useState({ ...defaultValue });

  const [lastUpdatedCell, setLastUpdatedCell] = useState({
    row: null,
    column: null,
  });

  const convertedStats = useMemo(() => convertStats(baseStats), [baseStats]);
  const calculatedStatsValues = useMemo(
    () =>
      calculateStats({
        baseStats,
        nature,
        level,
        ivs,
        evs,
      }),
    [baseStats, nature, level, ivs, evs]
  );
  useEffect(() => {
    if (natureDataLoading || !isAFavourite) return;
    setNature(natureData.natures[0]);
  }, [natureData, isAFavourite, baseStats]);

  useEffect(() => {
    setLastUpdatedCell({
      row: null,
      column: null,
    });
  }, [nature, level]);

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

  const StatComponent = ({ row, value, column }) => {
    const max = row.original.rowType === "iv" ? "31" : "252";
    const inputRef = useRef(null);

    useEffect(() => {
      if (
        inputRef.current &&
        lastUpdatedCell.column === column.id &&
        lastUpdatedCell.row === row.original.rowType
      ) {
        inputRef.current.focus();
      }
    }, [lastUpdatedCell, row, column]);

    const handleChange = async (event) => {
      if (row.original.rowType === "iv") {
        await handleIvChange(event, column.id);
      }
      if (row.original.rowType === "ev") {
        await handleEvChange(event, column.id);
      }
      setLastUpdatedCell({ row: row.original.rowType, column: column.id });
    };
    return (
      <div className="stat-table-cell">
        <input
          className="stat-table-input"
          type="text"
          value={Number(value).toString()}
          min="0"
          max={max}
          onChange={handleChange}
          ref={inputRef}
          onMouseDown={(e) => {
            e.preventDefault();
            const { target } = e;
            target.focus();
            const length = target.value.length;
            target.setSelectionRange(length, length);
          }}
        />
      </div>
    );
  };

  const { tableData, columns } = modifyStatsForTable({
    headers: Object.keys(defaultValue),
    ivs,
    evs,
    StatComponent,
  });

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
          <div className="select-input">
            <label htmlFor="nature-select">Nature:</label>
            <select
              id="nature-select"
              value={nature.name}
              onChange={(e) =>
                setNature(
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
          </div>
          <div className="select-input">
            <label htmlFor="level-select">Level:</label>
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
          <Table data={tableData} columns={columns} columnsEqualSize={true} />
        </>
      ) : undefined}
    </>
  );
}
