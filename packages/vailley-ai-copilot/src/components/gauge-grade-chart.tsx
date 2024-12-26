"use client";

import * as Models from "@/lib/models";
import ReactECharts from "echarts-for-react";
import React from "react";
import { useTranslation } from "react-i18next";

const GaugeChart: React.FC<Models.GaugeChartProps> = ({
  title,
  percentage,
  total,
  isReversed,
}) => {
  // Configure gauge options
  const { t } = useTranslation();
  let options = {
    backgroundColor: "#27272a", // Black background for contrast
    title: {
      text: title,
      left: "center",
      textStyle: {
        color: "#FFF", // Core color for the title
        fontSize: 14,
      },
    },
    series: [
      // Background circle
      {
        type: "pie", // Pie chart to create the circular background
        radius: ["90%", "100%"], // Thin ring for the background circle
        center: ["50%", "50%"], // Centered
        silent: true, // Disable interactions
        data: [
          {
            value: 1,
            itemStyle: {
              color: "rgba(146, 128, 253, 0.2)", // Semi-transparent core color for the background
            },
          },
        ],
        label: {
          show: false, // Hide labels for the background
        },
      },
      // Gauge chart
      {
        name: title,
        type: "gauge",
        radius: "80%", // Gauge size relative to the background
        startAngle: isReversed ? 180 : 0, // 0° or 270° based on reversed mode
        endAngle: isReversed ? 0 : 180, // 180° or 90° based on reversed mode
        axisLine: {
          lineStyle: {
            width: 20, // Gauge thickness
            color: [
              [percentage / 100, "rgba(146, 128, 253, 1)"], // Core color for the value section
              [1, "rgba(146, 128, 253, 0.4)"], // Lighter core color for the remainder
            ],
          },
        },
        axisTick: {
          show: false, // Hide ticks
        },
        splitLine: {
          show: false, // Hide split lines
        },
        axisLabel: {
          show: false, // Hide axis labels
        },
        pointer: {
          show: true, // Enable pointer
          length: "80%", // Pointer length relative to the radius
          width: 5, // Pointer width
          itemStyle: {
            color: "rgba(146, 128, 253, 1)", // Core color for the pointer
            shadowBlur: 15,
            shadowColor: "rgba(146, 128, 253, 0.8)", // Glow effect for the pointer
          },
        },
        detail: {
          formatter: `${percentage.toFixed(0)}% of ${total} records`, // Display percentage value
          color: "rgba(146, 128, 253, 1)", // Lime-yellow for the detail text
          fontSize: 18,
          offsetCenter: [0, "50%"], // Move the detail text up to the top
        },
        data: [
          {
            value: percentage.toFixed(2),
            name: "",
            //name: `${percentage.toFixed(0)}% of ${total} records`, // Dynamic description
          },
        ],
        //detail: {
        //  formatter: `{value}%`, // Display the percentage
        //  color: "rgba(146, 128, 253, 1)", // Core color for the detail text
        //  fontSize: 18,
        //  offsetCenter: [0, "50%"], // Adjust text position
        //},
        //data: [
        //  {
        //    value: percentage.toFixed(2),
        //    name: `${percentage.toFixed(0)}% of ${total} records`, // Dynamic label for the data
        //  },
        //],
      },
    ],
  };

  if (!isReversed) {
    options = {
      backgroundColor: "#27272a", // Black background to highlight fluorescent colors
      title: {
        text: title,
        left: "center",
        textStyle: {
          color: "#FFF", // Fluorescent lime-yellow for the title
          fontSize: 14,
        },
      },
      series: [
        // Background circle
        {
          type: "pie",
          radius: ["90%", "100%"], // Thin ring for the background
          center: ["50%", "50%"], // Centered
          silent: true, // Disable mouse events for the background
          data: [
            {
              value: 1,
              itemStyle: {
                color: "rgba(218, 255, 122, 0.2)", // Semi-transparent lime-yellow for the background
              },
            },
          ],
          label: {
            show: false, // No labels for the background circle
          },
        },
        // Gauge chart
        {
          name: title,
          type: "gauge",
          radius: "80%", // Slightly smaller than the background circle
          startAngle: isReversed ? 180 : 0, // Start at 9 o'clock if reversed
          endAngle: isReversed ? 0 : 180, // End at 3 o'clock if reversed
          axisLine: {
            lineStyle: {
              width: 20, // Thickness of the gauge line
              color: [
                [percentage / 100, "rgba(218, 255, 122, 1)"], // Core lime-yellow for the value section
                [1, "rgba(218, 255, 122, 0.2)"], // Semi-transparent lime-yellow for the remainder
              ],
            },
          },
          axisTick: {
            show: false, // Hide axis ticks
          },
          splitLine: {
            show: false, // Hide split lines
          },
          axisLabel: {
            show: false, // Hide axis labels
          },
          pointer: {
            show: true, // Display the pointer
            length: "80%", // Pointer length relative to the gauge radius
            width: 5, // Pointer width
            itemStyle: {
              color: "rgba(218, 255, 122, 1)", // Lime-yellow for the pointer
              shadowBlur: 10,
              shadowColor: "rgba(218, 255, 122, 0.8)", // Glow effect for the pointer
            },
          },
          detail: {
            formatter: `${percentage.toFixed(0)}% of ${total} records`, // Display percentage value
            color: "rgba(218, 255, 122, 1)", // Lime-yellow for the detail text
            fontSize: 18,
            offsetCenter: [0, "-40%"], // Move the detail text up to the top
          },
          data: [
            {
              value: percentage.toFixed(2),
              name: "",
              //name: `${percentage.toFixed(0)}% of ${total} records`, // Dynamic description
            },
          ],
        },
      ],
    };
  }

  return (
    <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
  );
};

export default GaugeChart;
