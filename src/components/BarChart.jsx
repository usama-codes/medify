import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const barChartData = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
  datasets: [
    {
      label: '',
      data: [120, 150, 180, 100, 80],
      backgroundColor: [
        '#f8295b', // Red
        '#1a85ff', // Blue
        '#7338ea', // Purple
        '#f0c459', // Yellow
        '#d80829', // Red
      ],
      borderColor: [
        '#f8295b',
        '#1a85ff',
        '#7338ea',
        '#f0c459',
        '#d80829',
      ],
      borderWidth: 1,
      borderRadius: 15, // Rounding the bars
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
    }
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
  elements: {
    bar: {
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowColor: 'rgba(0, 0, 0, 0.1)', // Common shadow color
      shadowBlur: 5,
    },
  },
};

function BarChart() {
  return (
    <div>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
}

export default BarChart;