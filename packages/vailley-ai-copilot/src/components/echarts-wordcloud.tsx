// components/EChartsWordCloud.tsx
import * as Models from "@/lib/models";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const EChartsWordCloud: React.FC<Models.EChartsWordCloudProps> = ({ data }) => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use dynamic import inside useEffect to ensure this runs on client side only
    (async () => {
      // Import ECharts
      const echarts = await import("echarts");

      // Import wordcloud plugin
      await import("echarts-wordcloud");

      // Merge duplicate words
      const mergedData = mergeData(data);

      if (chartRef.current) {
        const chart = echarts.init(chartRef.current);

        // Find the minimum and maximum frequency
        const maxFrequency = Math.max(...mergedData.map((item) => item.value));
        const minFrequency = Math.min(...mergedData.map((item) => item.value));

        // Define size range based on the frequency
        const sizeRange = [12, 100]; // Min and Max font size
        const scaleSize = (value: number) => {
          return (
            ((value - minFrequency) / (maxFrequency - minFrequency)) *
              (sizeRange[1] - sizeRange[0]) +
            sizeRange[0]
          );
        };

        const option = {
          title: {
            text: t("topics"),
            left: "center",
            textStyle: {
              color: "#fff",
              fontSize: 14,
            },
          },
          tooltip: {
            textStyle: {
              color: "#000",
            },
          },
          //shape: "circle",
          //shape: "cardioid",
          //shape: "diamond",
          //shape: "triangle",
          //shape: "triangle-forward",
          //shape: "pentagon",
          //shape: "star",
          series: [
            {
              type: "wordCloud",
              shape: "circle",
              left: "center",
              top: "center",
              width: "100%", // Increase width to provide more space
              height: "100%", // Increase height to provide more space
              rotationRange: [-45, 45], // Allow word rotation
              sizeRange: [12, 36], // Larger max size
              textStyle: {
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: () => {
                  const colors = [
                    "#ff954e", // orange
                    "#dbfb7e", // yellow
                    "#9483fe", // purple
                  ];
                  return colors[Math.floor(Math.random() * colors.length)];
                },
              },
              // Apply size based on frequency
              data: mergedData.map((item) => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                  normal: {
                    fontSize: scaleSize(item.value),
                  },
                },
              })),
            },
          ],
        };

        chart.setOption(option);

        // Cleanup on component unmount
        return () => {
          chart.dispose();
        };
      }
    })();
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

// Function to merge data for repeated terms
const mergeData = (data: { name: string; value: number }[]) => {
  const merged: { [key: string]: number } = {};

  // Merge duplicate words
  data.forEach(({ name, value }) => {
    if (merged[name]) {
      merged[name] += value; // If the word already exists, accumulate the value
    } else {
      merged[name] = value;
    }
  });

  // Convert merged data back to an array
  return Object.keys(merged).map((key) => ({
    name: key,
    value: merged[key],
  }));
};

export default EChartsWordCloud;
