import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function BarChart({ products }) {
  // Map products data to chart format
  const barChartData = {
    labels: products.map((product) => product.name), // Product names as labels
    datasets: [
      {
        label: "Top Selling Products",
        data: products.map((product) => product.sales), // Sales data
        backgroundColor: [
          "rgba(0, 128, 128, 1)",
          "rgb(15, 95, 95)",
          "rgb(0, 128, 128, 1)",
          "rgb(15, 95, 95)",
          "rgba(0, 128, 128, 1)",
        ],
        borderWidth: 1,
        borderRadius: 10, // Rounding the bars
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Sales: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove grid lines on the X-axis
        },
        barPercentage: 0.8, // Narrower bars (0 to 1 scale)
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
    },
  };

  return (
    <div>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
}

export default BarChart;
