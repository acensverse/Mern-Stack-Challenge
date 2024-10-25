import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [barData, setBarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/bar-chart?month=${selectedMonth}`);
        const { data } = response.data;

        const labels = data.map(item => {
          
          const priceRange = item._id === '901-above' ? '901 and above' : `${item._id - 100} - ${item._id}`;
          return priceRange;
        });

        const counts = data.map(item => item.count);

        setBarData({
          labels: labels,
          datasets: [{
            label: 'Number of Products',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response ? error.response.data.message : 'Error fetching bar chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white m-8 border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Product Price Distribution for {selectedMonth}</h2>
      {loading && <p>Loading bar chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {barData.labels && (
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Products Price Ranges in ${selectedMonth}`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BarChart;
