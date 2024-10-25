import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedMonth }) => {
  const [pieData, setPieData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/pie-chart?month=${selectedMonth}`);
        const { data } = response.data;

        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);

        setPieData({
          labels: labels,
          datasets: [{
            label: 'Number of Products by Category',
            data: counts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response ? error.response.data.message : 'Error fetching pie chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [selectedMonth]); 

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Product Distribution by Category for {selectedMonth}</h2>
      {loading && <p>Loading pie chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {pieData.labels && (
        <Pie
          data={pieData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Products by Category in ${selectedMonth}`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default PieChart;
