// Dashboard.jsx
import React, { useState } from "react";
import MonthSelector from "./MonthSelector";
import Transaction from "./Transaction";
import Statistics from "./Statistics";
import '../App.css'
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("03");

  const handleMonthChange = (monthName, monthCode) => {
    setSelectedMonth(monthCode); 
    
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="flex items-center justify-center border mb-8 p-5 rounded-full bg-white font-bold text-2xl">
        Transaction Dashboard
      </h1>
      <div className="">
        <MonthSelector onMonthChange={handleMonthChange} />
      </div>
      <div className="pb-10">
        <Transaction selectedMonthCode={selectedMonth} />
      </div>
      <div className="">
        <Statistics selectedMonthCode={selectedMonth} />
      </div>
      <div>
        <BarChart selectedMonth={selectedMonth} />
      </div>
      <div>
        <PieChart selectedMonth={selectedMonth} />
      </div>
    </div>

  );
};

export default Dashboard;
