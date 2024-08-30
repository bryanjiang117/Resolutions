import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressCircle = ({ progress, value, label, color }) => {
  const data = {
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: [color, '#333'], // Progress color and background color
        borderWidth: 0, // No border between segments
      },
    ],
  };

  const options = {
    responsive: true,
    // aspectRatio: 1,
    maintainAspectRatio: true,
    cutout: '70%', // Thickness of the circle
    circumference: 360, // Show only half the circle
    plugins: {
      tooltip: {
        enabled: true,  // Enable or disable tooltips
        callbacks: {
          label: function (tooltipItem) {
            return ` ${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,  // Animates the rotation of the chart
    },
    layout: {
      padding: 0, // Ensure there's no padding around the chart
    },
  };

  return (
    <Doughnut data={data} options={options}/>
  );
};

export default ProgressCircle;
