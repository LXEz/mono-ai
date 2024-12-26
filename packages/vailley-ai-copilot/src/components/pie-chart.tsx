import * as Models from "@/lib/models";
import ReactECharts from "echarts-for-react";
import React from "react";
import { useTranslation } from "react-i18next";

const PieChart: React.FC<Models.PieChartProps> = ({ data }) => {
  // Configure the pie chart options
  // ... [previous code remains unchanged]
  const { t } = useTranslation();
  const options = {
    backgroundColor: "#27272a",
    title: {
      text: t("sourceDistribution"),
      left: "center",
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "item",
      textStyle: {
        color: "#000",
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#fff",
      },
      // 如果标签过多，可以启用滚动
      // type: 'scroll',
    },
    series: [
      {
        name: "Platform",
        type: "pie",
        radius: ["40%", "70%"], // 根据需要调整半径
        avoidLabelOverlap: true, // 启用避免标签重叠
        data: data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: ["#dbfb7e", "#9483fe", "#ff954e"][index % 3], // 循环颜色
            shadowBlur: 20,
            shadowColor: "rgba(255, 255, 255, 0.5)",
          },
        })),
        label: {
          color: "#fff",
          formatter: "{b}: {d}%",
          fontSize: 10, // 减小字体大小
          position: "outside", // 标签在饼图外部显示
          overflow: "break", // 允许换行
          // 可以使用回调函数进一步自定义标签显示
          // formatter: function(params) {
          //   let name = params.name;
          //   if (name.length > 10) {
          //     name = name.substring(0, 10) + '...';
          //   }
          //   return `${name}: ${params.percent}%`;
          // },
        },
        labelLine: {
          length: 15, // 增加标签线的长度
          length2: 10,
          lineStyle: {
            color: "#fff",
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowColor: "rgba(255, 255, 255, 1)",
          },
        },
      },
    ],
  };

  //// After setting the option
  //chart.setOption(option);

  //// Make the chart responsive
  //window.addEventListener("resize", () => {
  //  chart.resize();
  //});

  // ... [rest of the code remains unchanged]

  return (
    <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
  );
};

export default PieChart;
