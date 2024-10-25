// MonthSelector.jsx
import React, { useState } from 'react';

const MonthSelector = ({ onMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState("March");

  // Month mapping
  const monthMap = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  // Handle month selection and pass the selected month back to the parent component
  const handleMonthChange = (event) => {
    const newSelectedMonth = event.target.value;
    setSelectedMonth(newSelectedMonth);
    onMonthChange(newSelectedMonth, monthMap[newSelectedMonth]);
  };

  return (
    <div>
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="px-4 p-2 border border-yellow-400 bg-yellow-400 rounded-lg font-medium"
        aria-label="Select Month"
      >
        {Object.keys(monthMap).map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
