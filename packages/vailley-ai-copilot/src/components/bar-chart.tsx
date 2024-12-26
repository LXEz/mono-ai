"use client";

import * as Models from "@/lib/models";
import ReactECharts from "echarts-for-react";
import React from "react";
import { useTranslation } from "react-i18next";

const BarChart: React.FC<Models.BarChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const options = {
    backgroundColor: "#27272a",
    title: {
      text: t("sentimentAnalysis"),
      left: "center",
      textStyle: {
        color: "#FFFFFF",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      textStyle: {
        color: "#000",
        fontSize: 14,
      },
    },
    grid: {
      left: "1%",
      right: "20%",
      bottom: "0%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.categories,
      name: t("sentiment"),
      axisLine: {
        lineStyle: {
          color: "#FFFFFF",
        },
      },
      axisLabel: {
        color: "#FFFFFF",
        rotate: 0,
        interval: 0,
        margin: 10,
        fontSize: 12,
        formatter: function (value: any) {
          const maxLength = 10;
          if (value.length > maxLength) {
            return value
              .match(new RegExp(".{1," + maxLength + "}", "g"))
              .join("\n");
          }
          return value;
        },
        rich: {
          line: {
            height: 20,
          },
        },
      },
    },
    yAxis: {
      type: "value",
      name: t("count"),
      axisLine: {
        lineStyle: {
          color: "#FFFFFF",
        },
      },
      axisLabel: {
        color: "#FFFFFF",
      },
      splitLine: {
        lineStyle: {
          color: "#333333",
        },
      },
    },
    series: [
      {
        data: data.values,
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#dbfb7e",
          //color: (params: any) => {
          //  const colors = ["#ff954e", "#dbfb7e", "#9483fe"];
          //  return colors[params.dataIndex % colors.length];
          //},
          borderColor: "#dbfb7e",
          borderWidth: 1,
        },
      },
    ],
  };

  return (
    <ReactECharts option={options} style={{ width: "100%", height: "100%" }} />
  );
};

export default BarChart;
