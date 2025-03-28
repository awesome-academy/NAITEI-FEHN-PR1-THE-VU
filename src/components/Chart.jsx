import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import formatMoney from "../helper/FormatMoney";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Chart({ chartData, chartTitle, yScaleTitle }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: chartTitle },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yScaleTitle },
        ticks: {
          precision: 0,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return formatMoney(value);
            }
          },
        },
      },
    },
  };

  return (
    <div className="w-full sm:h-72 md:h-96 border border-gray-200 rounded-lg p-2">
      <Bar data={chartData} options={options} />
    </div>
  );
}
