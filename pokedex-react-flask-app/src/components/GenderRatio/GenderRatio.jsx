import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

import { getGenderRate } from "../../helpers/getGenderRate";

import "./GenderRatio.scss";

ChartJS.register(ArcElement, Tooltip);

const RatioPieChart = ({ value1, value2 }) => {
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [value1, value2],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        displayColors: false,
        bodyAlign: "center",
        callbacks: {
          label: function (context) {
            if (context.parsed.y !== null) {
              context.formattedValue += "%";
            }
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return <Pie data={data} options={options} />;
};

const GenderRatio = ({ hasDifference, rate }) => {
  const genderRatio = useMemo(() => {
    return getGenderRate(rate);
  }, [rate]);

  return (
    <div className="app__gender-ratio">
      {genderRatio.alt ? (
        <p>{genderRatio.alt}</p>
      ) : (
        <>
          <h4>Gender Rate</h4>
          <div className="gender-ratio-container">
            <RatioPieChart
              value1={genderRatio.male}
              value2={genderRatio.female}
            />
          </div>
        </>
      )}
      {hasDifference && <p className="text-center">Has Gender Differences</p>}
    </div>
  );
};

export default GenderRatio;
