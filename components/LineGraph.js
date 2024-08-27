import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns'; 
import { Colors } from '@/util/constants'

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = () => {
  const dailyData = [
    { date: '2024-01-01', tasksCompleted: 2 },
    { date: '2024-01-02', tasksCompleted: 4 },
    { date: '2024-01-03', tasksCompleted: 3 },
    { date: '2024-01-04', tasksCompleted: 5 },
    { date: '2024-01-05', tasksCompleted: 1 },
    { date: '2024-01-07', tasksCompleted: 2 },
    { date: '2024-01-08', tasksCompleted: 3 },
    { date: '2024-01-09', tasksCompleted: 6 },
    { date: '2024-01-10', tasksCompleted: 4 },
    { date: '2024-01-11', tasksCompleted: 1 },
    { date: '2024-01-18', tasksCompleted: 5 },
    { date: '2024-01-19', tasksCompleted: 7 },
    { date: '2024-01-20', tasksCompleted: 1 },
    { date: '2024-01-21', tasksCompleted: 4 },
    { date: '2024-01-22', tasksCompleted: 2 },
    { date: '2024-01-23', tasksCompleted: 6 },
    { date: '2024-01-25', tasksCompleted: 3 },
    { date: '2024-01-27', tasksCompleted: 2 },
    { date: '2024-01-28', tasksCompleted: 4 },
    { date: '2024-01-29', tasksCompleted: 3 },
    { date: '2024-01-30', tasksCompleted: 6 },
    { date: '2024-02-01', tasksCompleted: 2 },
    { date: '2024-02-02', tasksCompleted: 4 },
    { date: '2024-02-03', tasksCompleted: 3 },
    { date: '2024-02-04', tasksCompleted: 5 },
    { date: '2024-02-05', tasksCompleted: 1 },
    { date: '2024-02-06', tasksCompleted: 0 },
    { date: '2024-02-08', tasksCompleted: 3 },
    { date: '2024-02-09', tasksCompleted: 6 },
    { date: '2024-02-12', tasksCompleted: 3 },
    { date: '2024-02-13', tasksCompleted: 5 },
    { date: '2024-02-14', tasksCompleted: 6 },
    { date: '2024-02-15', tasksCompleted: 2 },
    { date: '2024-02-16', tasksCompleted: 4 },
    { date: '2024-02-17', tasksCompleted: 3 },
    { date: '2024-02-18', tasksCompleted: 5 },
    { date: '2024-02-19', tasksCompleted: 7 },
    { date: '2024-02-20', tasksCompleted: 1 },
    { date: '2024-02-21', tasksCompleted: 4 },
    { date: '2024-02-22', tasksCompleted: 2 },
    { date: '2024-02-23', tasksCompleted: 6 },
    { date: '2024-02-24', tasksCompleted: 5 },
    { date: '2024-02-25', tasksCompleted: 3 },
    { date: '2024-02-26', tasksCompleted: 7 },
    { date: '2024-02-27', tasksCompleted: 2 },
    { date: '2024-02-28', tasksCompleted: 4 },
  ];

  let cumulativeData = [];
  dailyData.reduce((acc, { date, tasksCompleted }) => {
    cumulativeData.push({ x: date, y: acc + tasksCompleted });
    return acc + tasksCompleted;
  }, 0);

  const data = {
    labels: cumulativeData.map(item => item.x),
    datasets: [
      {
        label: 'Cumulative Tasks Completed',
        data: cumulativeData,
        fill: false,
        borderColor: Colors.primary,
        borderWidth: 2, // Thinner line
        tension: 0.1,
        pointRadius: 0,
        hoverRadius: 8,
        hitRadius: 8.
      },
    ],
  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,  
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
            tooltipFormat: 'MMM d, yyyy',
          },
          title: {
            display: true,
          },
          ticks: {
            callback: function(val) {
              return new Date(val).toLocaleString('en-US', { month: 'short' });
            }
          },
          grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.1)',
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
          },
          ticks: {
            stepSize: 5,
          },
          grid: {
            display: false,
          }
        },
      },
      plugins: {
        legend: {
          display: false,
          position: 'top',
          align: 'end',
          labels: {
            font: {
              size: 10,
            }
          },
        },
      },
    };

  return <Line data={data} options={options} />;
}

export default LineGraph;