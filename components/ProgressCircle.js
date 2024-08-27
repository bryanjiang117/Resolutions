import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressCircle = ({ percentage, label, subLabel, color }) => {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, '#333'], // Progress color and background color
        borderWidth: 0, // No border between segments
      },
    ],
  };

  const options = {
    responsive: true,
    aspectRatio: 1,
    maintainAspectRatio: true,
    cutout: '80%', // Thickness of the circle
    circumference: 360, // Show only half the circle
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips
    },
  };

  return (
    <Doughnut data={data} options={options} />
  );
};

export default ProgressCircle;
