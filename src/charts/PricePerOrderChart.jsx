import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";
import { useStore } from "../components/StoreContext";
import styles from "../styles/pricePerOrderChart.module.css";

export default function PricePerOrderChart() {
  const [priceData, setPriceData] = useState([]);
  const { store } = useStore();

  // Fetch price per order
  async function fetchPricePerOrder() {
    const response = await fetch(
      `http://localhost:8080/pricePerOrder?storeId=${store.id}`
    );
    const data = await response.json();

    // Initialize variables for running total and enriched data array
    let runningTotal = 0;
    let enrichedData = [];

    // Calculate running average and enrich the data
    data.forEach((point, index) => {
      runningTotal += point.order_total;
      const runningAverage = (runningTotal / (index + 1)).toFixed(2);
      enrichedData.push({ ...point, runningAverage });
    });

    setPriceData(enrichedData);
  }

  useEffect(() => {
    fetchPricePerOrder(); // Fetch data when the component mounts
  }, []);

  return (
    <div className={styles.ppoChartContainer}>
      <LineChart
        width={1200}
        height={500}
        data={priceData}
        margin={{ left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" fill="#f1e1e1" />
        <XAxis dataKey="order_id">
          {/* <Label value="Order Number" angle={0} position="insideBottom" offset={0} /> */}
        </XAxis>
        <YAxis dataKey="order_total">
          <Label
            value="Price in $"
            angle={-90}
            position="insideLeft"
            offset={10}
          />
        </YAxis>
        <Tooltip
          formatter={(value, name) => {
            if (name === "Order Total" || name === "Running Average Price") {
              return [`$${Number(value).toFixed(2)}`, name];
            }
            return [value, name];
          }}
        />
        <Line
          type="monotone"
          dataKey="order_total"
          stroke="#8d6d6d"
          name="Order Total"
        />
        <Line
          type="monotone"
          dataKey="runningAverage"
          stroke="#0000ff"
          name="Running Average Price"
          dot={false}
        />
        <Legend />
      </LineChart>
    </div>
  );
}
