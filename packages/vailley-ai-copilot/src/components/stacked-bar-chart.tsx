"use client";

import * as Models from "@/lib/models";

import ReactECharts from "echarts-for-react";
import React from "react";

const StackedBarChart: React.FC<Models.StackedBarChartProps> = ({
  categories,
  series,
}) => {
  const options = {
    backgroundColor: "#27272a", // Dark gray background for a sleek look
    tooltip: {
      trigger: "axis",
      textStyle: {
        color: "#000",
      },
      axisPointer: {
        type: "shadow", // Highlight bars with shadow
      },
    },
    legend: {
      top: "bottom",
      textStyle: {
        color: "#FFFFFF", // White text for legend
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    yAxis: {
      type: "category",
      data: categories, // Categories for Y-axis
      axisLabel: {
        color: "#ff954e", // Set Y-axis label color to orange (#ff954e)
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#ff954e", // Set Y-axis line color to purple (#9483fe)
        },
      },
    },
    xAxis: {
      type: "value",
      axisLabel: {
        color: "#B0BEC5", // Fluorescent blue-gray
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)", // Subtle white grid lines
        },
      },
      axisLine: {
        lineStyle: {
          color: "#4FC3F7", // Light fluorescent blue
        },
      },
    },
    series: series.map((s, idx) => ({
      ...s,
      type: "bar",
      barWidth: "40%", // Bar width for better aesthetics
      itemStyle: {
        // Apply theme colors based on index
        color:
          //orange #ff954e
          //yellow #dbfb7e
          //purple #9483fe
          idx % 3 === 0
            ? "#dbfb7e" // Orange color for the first series
            : idx % 3 === 1
              ? "#effda5" // Yellow color for the second series
              : "#ff954e", // Purple color for the third series
      },
      emphasis: {
        itemStyle: {
          color:
            idx % 3 === 0
              ? "#dbfb7e" // Orange color for the first series
              : idx % 3 === 1
                ? "#effda5" // Yellow color for the second series
                : "#ff954e", // Purple color for the third series
          //shadowBlur: 10,
          //shadowColor: "rgba(255, 255, 255, 0.8)", // White glow effect
        },
      },
    })),
  };

  return (
    <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
  );
};

export default StackedBarChart;
