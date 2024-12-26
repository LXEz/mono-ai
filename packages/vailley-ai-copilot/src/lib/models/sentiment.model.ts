export type SentimentLayout = {
  titleLevel: number;
};

export type ChatAPIResponse = {
  messages?: ChatAPIMessage[]
  //"sourceDocument": null,
  error?: string
}

export type ChatAPIMessage = {
  question: string;
  answer: string;
  id: number;
}

export type ChatAPIBody = {
  question: string;
  ruleSets?: {
    [key: string]: string;
  }
}

export type MVC = {
  mission: string;
  vac?: string;
  country?: string;
}

export interface WordDataItem {
  name: string;
  value: number;
}

export interface EChartsWordCloudProps {
  data: WordDataItem[];
}

export interface SentimentDataItem {
  content: string;
  mission: string;
  vac: string;
  country: string;
  sentiment: string;
  severity: number;
  topics: string[];
  platform: string;
}

//export interface StackedBarChartProps {
//  data: SentimentDataItem[];
//}

export interface StackedBarChartProps {
  categories: string[]; // Y-axis categories
  series: { name: string; type: string; stack: string; data: number[] }[]; // Series data
}

export interface BarChartData {
  categories: string[];
  values: unknown[];
}

export interface BarChartProps {
  data: BarChartData;
}

export interface PieChartData { name: string; value: number }

export interface PieChartProps {
  data: PieChartData[];
}

export interface HeatmapChartProps {
  xAxis: string[];
  yAxis: string[];
  data: [number, number, number][]; // [x, y, value]
}

export interface GaugeChartProps {
  title: string;
  percentage: number; // Severity 3 percentage
  total: number; // Total count
  isReversed?: boolean; // Reverse the gauge for 180° rotation
}
