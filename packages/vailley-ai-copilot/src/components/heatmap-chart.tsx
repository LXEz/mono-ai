"use client";

import * as Models from "@/lib/models";
import ReactECharts from "echarts-for-react";
import React from "react";
import { useTranslation } from "react-i18next";

const HeatmapChart: React.FC<Models.HeatmapChartProps> = ({
  xAxis,
  yAxis,
  data,
}) => {
  const { t } = useTranslation();
  // Configure heatmap options
  const options = {
    backgroundColor: "#27272a", // Black background for contrast
    tooltip: {
      position: "top",
      textStyle: {
        color: "#000",
      },
    },
    title: {
      text: t("sentimentTop10"),
      left: "center",
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    grid: {
      left: "1%",
      right: "15%",
      bottom: "5%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxis,
      axisLabel: {
        color: "#fff",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#888",
        },
      },
    },
    yAxis: {
      type: "category",
      data: yAxis,
      axisLabel: {
        color: "#fff",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#888",
        },
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((item) => item[2])), // Max value in data
      calculable: true,
      orient: "vertical",
      left: "right",
      top: "center",
      inRange: {
        color: [
          "#dbfb7e", // Yellow (low heat)
          "#ff954e", // Orange (high heat)
        ],
      },
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: t("sentimentByTopics"),
        type: "heatmap",
        data,
        label: {
          show: true,
          formatter: "{@[2]}", // Show value
          color: "#a1a1aa",
          fontSize: 12,
        },
        emphasis: {
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: "rgba(255, 255, 255, 0.8)",
          },
        },
        itemStyle: {
          borderColor: "rgba(0, 0, 0, 0.3)",
          borderWidth: 1,
        },
      },
    ],
  };

  return (
    <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
  );
};

export default HeatmapChart;
