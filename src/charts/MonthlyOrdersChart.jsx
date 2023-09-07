import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';

export default function MonthlyOrdersChart() {
  const [chartData, setChartData] = useState([]);

  // Fetch monthly orders for chart
  async function fetchMonthlyOrders() {
    const response = await fetch("http://localhost:8080/ordersPerMonth");
    const data = await response.json();
    setChartData(
      data.map((row) => ({
        month: new Date(row.month).toLocaleString('default', { month: 'long', year: 'numeric' }),
        count: row.count,
      }))
    );
  }

  useEffect(() => {
    fetchMonthlyOrders(); // Fetch data when component mounts
  }, []);

  return (
    <div>
      <BarChart width={1000} height={500} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" >
        {/* <Label value="Month" angle={0} position="insideBottom" offset={-10} /> */}
        </XAxis>
        <YAxis domain={[0, 'dataMax + 20']} tickCount={10}>
        <Label value="Number of Orders" angle={-90} position="insideLef" offset={10} />
        </YAxis>
        <Tooltip />
        <Bar dataKey="count" fill="#8d6d6d" />
      </BarChart>
    </div>
  );
}
