import React, { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";

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

import { GET_NATURES } from "../../api/queries/backend";
import { backEndClient } from "../../api/clients";

import { modifyStats } from "../../helpers/modifyForTable";
import {
  convertStats,
  calculateStats,
  calculateStatsTotal,
} from "../../helpers/statModifier";
import { formatName } from "../../helpers/format";

import { Table } from "../";

import "./StatChart.scss";

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
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      bodyAlign: "center",
      titleFont: {
        size: 15,
      },
      bodyFont: {
        size: 16,
      },
    },
    datalabels: {
      color: "black",
      anchor: "end",
      align: "end",
      offset: -10,
      font: {
        size: 14,
        weight: 600,
      },
      formatter: function (value) {
        return value;
      },
    },
  },
};

const StatChart = ({ baseStats, isAFavourite }) => {
  const { data: natureData, loading: natureDataLoading } = useQuery(
    GET_NATURES,
    {
      client: backEndClient,
    }
  );
  const [nature, setNature] = useState({});
  const [level, setLevel] = useState(10);
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

  const baseStatTotal = useMemo(
    () => calculateStatsTotal(baseStats),
    [baseStats]
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
        ? Object.keys(calculatedStatsValues).map((val) =>
            formatName(val)
          )
        : Object.keys(convertedStats).map((val) => formatName(val)),
      datasets: [
        {
          data: isAFavourite
            ? Object.values(calculatedStatsValues)
            : Object.values(convertedStats),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          pointHoverRadius: 7,
          pointRadius: 5,
        },
      ],
    };
  }, [convertedStats, calculatedStatsValues, isAFavourite]);

  const scales = useMemo(() => {
    return {
      r: {
        suggestedMin: 0,
        suggestedMax: (140 * level) / 100,
        stepSize: (40 * level) / 100,
        ticks: {
          display: false,
          beginAtZero: true,
          precision: 0,
        },
      },
    };
  }, [level]);

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

  const { tableData, columns } = modifyStats({
    headers: Object.keys(defaultValue),
    ivs,
    evs,
    StatComponent,
  });

  return (
    <div className="app__stats">
      <h3 className="text-center">
        {isAFavourite ? "Calculated" : "Base"} Stats
      </h3>

      <div className="app__stats-chart">
        <Radar
          data={data}
          options={{ ...options, scales }}
          plugins={[ChartDataLabels]}
          redraw={false}
        />
      </div>
      <p className="text-center">Base Stats Total: {baseStatTotal}</p>
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
    </div>
  );
};

export default StatChart;
