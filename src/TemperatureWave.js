// TemperatureWave.js
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TemperatureWave = ({ temperatureData }) => {
    const chartRef = useRef(null);

    // Prepare chart data
    const chartData = {
        labels: ['Morning', 'Noon', 'Afternoon', 'Evening', 'Night'], // Example labels
        datasets: [
            {
                label: 'Temperature (°C)',
                data: temperatureData,
                borderColor: 'rgba(0, 123, 255, 1)', // Line color
                backgroundColor: 'rgba(0, 123, 255, 0.3)', // Fill color
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor: 'rgba(0, 123, 255, 1)',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgba(255, 165, 0, 1)', // Orange on hover
                pointHoverBorderColor: 'rgba(0, 123, 255, 1)', // Blue border on hover
            },
        ],
    };

    // Define options for the chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `Temperature: ${tooltipItem.raw} °C`; // Display the temperature value
                    },
                },
            },
            legend: {
                labels: {
                    color: 'black',
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time of Day',
                    color: 'pink',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    color: 'pink',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    color: 'pink',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    color: 'black',
                },
            },
        },
    };

    return (
        <div style={{ height: '400px', width: '700px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center', color: 'pink' }}>Temperature Waveform</h2>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default TemperatureWave;
