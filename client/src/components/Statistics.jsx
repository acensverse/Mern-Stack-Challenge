import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Statistics = ({ selectedMonthCode }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    unsoldItems: 0,
    month: "march",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/statistics?month=${selectedMonthCode}`
        );
        console.log(response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error.response
            ? error.response.data.message
            : "Error fetching statistics. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonthCode]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-yellow-400">
      <h2 className="text-2xl font-bold mb-4">
        Statistics for Month {selectedMonthCode}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <p>Total sale: {stats.totalSaleAmount}</p>
          <p>Total sold items: {stats.soldItems}</p>
          <p>Total not sold items: {stats.unsoldItems}</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
