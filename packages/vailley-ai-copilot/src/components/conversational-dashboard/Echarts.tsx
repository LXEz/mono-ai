import { useChatStore } from "@/lib/conversational-dashboard/models/chatStore";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

interface EchartsProps {
  data: {
    option: echarts.EChartsOption;
    style?: React.CSSProperties;
  };
}

export default function Echarts({ data }: EchartsProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { fold } = useChatStore();
  useEffect(() => {
    // Initialize the chart
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Cleanup function
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // Update chart configuration
    if (chartInstance.current) {
      chartInstance.current.setOption(data.option);
    }
  }, [data.option]);

  const handleResize = () => {
    chartInstance.current?.resize();
  };
  // Handle window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleResize();
    }, 200);
  }, [fold]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        minHeight: "400px",
        ...data.style,
      }}
    />
  );
}
