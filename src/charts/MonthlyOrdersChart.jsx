import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import styles from "../styles/MonthlyOrdersChart.module.css";

export default function MonthlyOrdersChart() {
  const [chartData, setChartData] = useState([]);

  // Fetch monthly orders for chart
  async function fetchMonthlyOrders() {
    const response = await fetch("http://localhost:8080/ordersPerMonth");
    const data = await response.json();
    setChartData(
      data.map((row) => ({
        month: new Date(row.month).toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        count: row.count,
      }))
    );
  }

  useEffect(() => {
    fetchMonthlyOrders(); // Fetch data when component mounts
  }, []);

  return (
    <div className={styles.ordersChart}>
      <BarChart
        width={1200}
        height={500}
        data={chartData}
        margin={{ left: 20 }}
      >
        <CartesianGrid strokeDasharray="3" fill="#f1e1e1" />
        <XAxis dataKey="month">
          {/* <Label value="Month" angle={0} position="insideBottom" offset={-10} /> */}
        </XAxis>
        <YAxis domain={[0, "dataMax + 20"]} tickCount={10}>
          <Label
            value="Number of Orders"
            angle={-90}
            position="insideLeft"
            offset={5}
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey="count" fill="#8d6d6d" name="Number of Orders" />
      </BarChart>
    </div>
  );
}
