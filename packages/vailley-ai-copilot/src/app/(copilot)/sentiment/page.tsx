"use client";

import Fold from "@/assets/fold.svg";
import Unfold from "@/assets/unfold.svg";
import BarChart from "@/components/bar-chart";
import UploadExcel from "@/components/excel-uploader";
import GaugeChart from "@/components/gauge-grade-chart";
import HeatmapChart from "@/components/heatmap-chart";
import { useLoading } from "@/components/loading";
import { useNotification } from "@/components/notification";
import StackedBarChart from "@/components/stacked-bar-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import i18n from "@/i18n";
import * as Models from "@/lib/models";
import { getChatAnswer } from "@/lib/services/chat";
import { saveAs } from "file-saver";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

const EChartsWordCloud = dynamic(
  () => import("@/components/echarts-wordcloud").then((mod) => mod.default),
  { ssr: false },
);

const PieChart = dynamic(
  () => import("@/components/pie-chart").then((mod) => mod.default),
  { ssr: false },
);

export default function SentimentPage() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { addNotification } = useNotification();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState(i18n.language);

  const emailString = "Email";
  const chatlogString = "Chatbot Log";
  const socialString = "Social Media";

  const [tagMVC, setTagMVC] = useState<Models.MVC>({
    mission: "",
    vac: "",
    country: "",
  });

  const [platform, setPlatform] = useState<string>(emailString);
  const [isApplied, setIsApplied] = useState(false);
  const [masterData, setMasterData] = useState<Models.SentimentDataItem[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [wordCloudData, setWordCloudData] = useState<Models.WordDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<Models.BarChartData>();
  const [platformPieData, setPlatformPieData] = useState<Models.PieChartData[]>(
    [],
  );
  const [heatmapData, setHeatmapData] = useState<{
    xAxis: string[];
    yAxis: string[];
    heatmapData: [number, number, number][];
  }>();
  const [gaugeDataA, setGaugeDataA] = useState<{
    percentage: number;
    total: number;
  }>({
    percentage: 0,
    total: 0,
  });
  const [gaugeDataB, setGaugeDataB] = useState<{
    percentage: number;
    total: number;
  }>({
    percentage: 0,
    total: 0,
  });
  const [stackedBarData, setStackedBarData] =
    useState<Models.StackedBarChartProps>();
  const [groupBy, setGroupBy] = useState<"vac" | "country" | "mission">("vac");

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle group-by selection
  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroupBy = e.target.value as "vac" | "country" | "mission";
    setGroupBy(selectedGroupBy);

    // Dynamically update the StackedBarChart data
    const stackedData = processStackedBarData(masterData, selectedGroupBy);
    setStackedBarData(stackedData);
  };

  // Handle changes in user input for MVC tags
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTagMVC((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Export masterData as Excel file
  const exportToExcel = (
    data: Models.SentimentDataItem[],
    filename: string,
  ) => {
    if (data.length === 0) {
      addNotification("No data available to export.", "error");
      return;
    }

    // Preprocess data: convert arrays to strings
    const processedData = data.map((item) => ({
      ...item,
      topics: item.topics.join(", "), // Convert topics array to a comma-separated string
    }));

    // Convert processed data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(processedData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sentiment Analysis Result",
    );

    // Write workbook to binary string
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${filename}.xlsx`);
  };

  // Apply the configuration
  const handleApply = (append: boolean) => {
    //if (!platform || !tagMVC.mission || !tagMVC.vac || !tagMVC.country) {
    //  addNotification("Please fill in all fields before applying.", "error");
    //  return;
    //}
    if (!platform) {
      addNotification("Please select source before applying.", "error");
      return;
    }
    handleDataExtracted(excelData, append);
    setIsApplied(true);
    setExcelData([]);
    //addNotification(
    //  "Configuration applied. You can now upload an Excel file.",
    //  "success",
    //);
  };

  const handleLanguage = () => {
    const newLanguage = defaultLanguage === "zh" ? "en" : "zh";
    setDefaultLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    console.log(newLanguage);
  };

  const handleSwitch = () => {
    if (!isFlipped) {
      // Process data updates first
      handleDashboard(() => {
        // Switch state after data updates are complete
        setIsFlipped(true);
      });
    } else {
      setIsFlipped(false); // Switch back to table view
    }
  };

  // Handle the uploaded Excel file
  const handleDataExtracted = (data: any[], append: boolean = true) => {
    if (data.length === 0) {
      addNotification("No data found in the uploaded Excel file.", "error");
      return;
    }

    // Ensure that each object in newEntries conforms to SentimentDataItem type
    const newEntries: Models.SentimentDataItem[] = data.map((row) => ({
      content: row[Object.keys(row)[0]] || "",
      platform: platform || "",
      mission: tagMVC.mission || "",
      vac: tagMVC.vac || "",
      country: tagMVC.country || "",
      sentiment: "", // Initial sentiment is empty
      severity: 0, // Initial severity is 0
      topics: [], // Initial topics is an empty array
    }));

    // Merge data
    if (append) {
      setMasterData((prev) => [...newEntries, ...prev]);
    } else {
      setMasterData(newEntries);
    }

    setIsAnalyzed(false);

    addNotification("Excel data successfully added.", "success");
  };

  //heatmap
  //const processHeatmapData = (data: Models.SentimentDataItem[]) => {
  //  // Initialize a map to count occurrences
  //  const heatmapMap: Record<string, Record<string, number>> = {};

  //  data.forEach((item) => {
  //    item.topics.forEach((topic) => {
  //      if (!heatmapMap[topic]) {
  //        heatmapMap[topic] = {};
  //      }
  //      if (!heatmapMap[topic][item.sentiment]) {
  //        heatmapMap[topic][item.sentiment] = 0;
  //      }
  //      heatmapMap[topic][item.sentiment]++;
  //    });
  //  });

  //  // Extract x-axis (topics) and y-axis (sentiments) labels
  //  const xAxis = Object.keys(heatmapMap);
  //  const yAxis = Array.from(
  //    new Set(
  //      data.flatMap((item) => item.sentiment), // Unique sentiments
  //    ),
  //  );

  //  // Generate heatmap data
  //  const heatmapData: [number, number, number][] = [];
  //  xAxis.forEach((topic, i) => {
  //    yAxis.forEach((sentiment, j) => {
  //      heatmapData.push([i, j, heatmapMap[topic][sentiment] || 0]); // [x, y, value]
  //    });
  //  });

  //  return { xAxis, yAxis, heatmapData };
  //};
  const processHeatmapData = (data: Models.SentimentDataItem[]) => {
    // Initialize a map to count occurrences
    const heatmapMap: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      item.topics.forEach((topic) => {
        if (!heatmapMap[topic]) {
          heatmapMap[topic] = {};
        }
        if (!heatmapMap[topic][item.sentiment]) {
          heatmapMap[topic][item.sentiment] = 0;
        }
        heatmapMap[topic][item.sentiment]++;
      });
    });

    // Sort topics by frequency of appearance and get the top 10 topics
    const sortedTopics = Object.keys(heatmapMap)
      .sort((a, b) => {
        // Sort topics by the total number of sentiment occurrences
        const totalA = Object.values(heatmapMap[a]).reduce(
          (sum, count) => sum + count,
          0,
        );
        const totalB = Object.values(heatmapMap[b]).reduce(
          (sum, count) => sum + count,
          0,
        );
        return totalB - totalA; // Descending order
      })
      .slice(0, 10); // Take the top 10 topics

    // Extract y-axis (sentiments) labels
    const yAxis = Array.from(
      new Set(data.flatMap((item) => item.sentiment)), // Unique sentiments
    );

    // Generate heatmap data for top 10 topics
    const heatmapData: [number, number, number][] = [];
    sortedTopics.forEach((topic, i) => {
      yAxis.forEach((sentiment, j) => {
        heatmapData.push([i, j, heatmapMap[topic][sentiment] || 0]); // [x, y, value]
      });
    });

    return { xAxis: sortedTopics, yAxis, heatmapData };
  };

  const processGaugeData = (
    data: Models.SentimentDataItem[],
    sentiment: string,
  ) => {
    const filteredData = data.filter((item) => item.sentiment === sentiment);
    const total = filteredData.length;
    //for 3
    //const severity3Count = filteredData.filter(
    //  (item) => item.severity === 3,
    //).length;
    //const percentage = total > 0 ? (severity3Count / total) * 100 : 0;
    const severity3Count = filteredData.filter(
      (item) => item.severity >= 2,
    ).length;
    const percentage = total > 0 ? (severity3Count / total) * 100 : 0;

    return { total, percentage };
  };

  const processStackedBarData = (
    data: Models.SentimentDataItem[],
    groupBy: "vac" | "country" | "mission",
  ) => {
    // Group data by the selected field
    const groupedData: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      const groupValue = item[groupBy] || "Unknown";
      if (!groupedData[groupValue]) {
        groupedData[groupValue] = {};
      }
      if (!groupedData[groupValue][item.sentiment]) {
        groupedData[groupValue][item.sentiment] = 0;
      }
      groupedData[groupValue][item.sentiment]++;
    });

    // Extract categories (Y-axis) and series data
    const categories = Object.keys(groupedData); // Group names
    const sentiments = Array.from(
      new Set(data.map((item) => item.sentiment)), // Unique sentiments
    );

    const series = sentiments.map((sentiment) => ({
      name: sentiment,
      type: "bar",
      stack: "total",
      data: categories.map((category) => groupedData[category][sentiment] || 0),
    }));

    return { categories, series };
  };

  // Perform sentiment analysis
  const handleSentimentAnalysis = async () => {
    setLoading(true);

    try {
      const promises = masterData.map((item) =>
        getChatAnswer(item.content).then((response: Models.ChatAPIResponse) => {
          let parsedAnswer: {
            sentiment?: string;
            severity?: number;
            topics?: string[];
          } = {};

          if (response.messages && response.messages[0]?.answer) {
            try {
              const cleanedAnswer = response.messages[0].answer
                .replace(/```json|```/g, "")
                .trim();
              parsedAnswer = JSON.parse(cleanedAnswer || "{}");
            } catch (error) {
              console.error("Error parsing sentiment analysis result:", error);
            }
          }
          console.log(parsedAnswer);
          return {
            ...item,
            sentiment: parsedAnswer.sentiment || "",
            severity: parsedAnswer.severity || 0,
            topics: parsedAnswer.topics || [],
          };
        }),
      );

      const updatedData = await Promise.all(promises);
      setMasterData(updatedData);
      setIsAnalyzed(true);
      addNotification("Sentiment analysis completed.", "success");
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
      addNotification("Failed to analyze sentiment for some entries.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update handleDashboard to support callback functions
  const handleDashboard = (callback?: () => void) => {
    if (masterData.length === 0) {
      addNotification("No data available for generating charts.", "error");
      return;
    }
    if (!isAnalyzed) {
      addNotification("Please analysis data first.", "error");
      return;
    }

    setLoading(true);

    // Delay processing to ensure data is ready
    setTimeout(() => {
      const sentimentCounts = masterData.reduce(
        (acc, item) => {
          acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      setBarChartData({
        categories: Object.keys(sentimentCounts),
        values: Object.values(sentimentCounts),
      });

      const topicFrequency: Record<string, number> = {};
      masterData.forEach((item) => {
        if (Array.isArray(item.topics)) {
          item.topics.forEach((topic) => {
            topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
          });
        }
      });
      setWordCloudData(
        Object.entries(topicFrequency).map(([name, value]) => ({
          name,
          value,
        })),
      );
      // Calculate platform distribution
      const platformCounts = masterData.reduce(
        (acc, item) => {
          acc[item.platform] = (acc[item.platform] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      setPlatformPieData(
        Object.entries(platformCounts).map(([name, value]) => ({
          name,
          value,
        })),
      );

      // Process heatmap data
      const heatmapResult = processHeatmapData(masterData);
      setHeatmapData(heatmapResult);

      const dataA = processGaugeData(masterData, "negative");
      const dataB = processGaugeData(masterData, "positive");

      setGaugeDataA(dataA);
      setGaugeDataB(dataB);

      // Generate default StackedBarChart data
      const stackedData = processStackedBarData(masterData, groupBy);
      setStackedBarData(stackedData);

      setLoading(false);

      if (callback) callback();
    }, 500);
  };

  // useEffect to trigger after isAnalyzed changes to true
  useEffect(() => {
    if (isAnalyzed) {
      handleSwitch();
    }
  }, [isAnalyzed]); // Dependency array ensures it runs only when isAnalyzed changes

  return (
    <div className="flex min-h-screen">
      {/* config */}
      <div
        className={`p-4 relative transition-all duration-1000 ease-in-out ${isCollapsed ? "w-[0%]" : "w-[12%]"}`}
      >
        <button
          className="absolute top-2 right-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed ? (
            <Fold className="w-5 h-5" />
          ) : (
            <Unfold className="w-5 h-5" />
          )}
        </button>
        <div
          className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "w-[0%] overflow-hidden blur-3xl" : "mt-3"}`}
        >
          <div>
            <Label className="text-white">{t("file")}</Label>
            {/*<Label className="text-white">File</Label>*/}
            <UploadExcel onDataExtracted={setExcelData} />
          </div>
          <div>
            <Label htmlFor="type">{t("source")}</Label>
            <Select
              name="type"
              id="type"
              onChange={(e) => setPlatform(e.target.value)}
              defaultValue="Email"
            >
              <option value="Email">{t("email")}</option>
              <option value="Chatbot Log">{t("chatbotLog")}</option>
              <option value="Social Media">{t("socialMedia")}</option>
            </Select>
          </div>
          <div className="mt-4">
            <Label htmlFor="vac">{t("vac")}</Label>
            <Input
              name="vac"
              id="vac"
              onChange={handleTagChange}
              placeholder={t("vacPlaceholder")}
              value={tagMVC.vac}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="mission">{t("mission")}</Label>
            <Input
              name="mission"
              id="mission"
              onChange={handleTagChange}
              placeholder={t("missionPlaceholder")}
              value={tagMVC.mission}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="country">{t("country")}</Label>
            <Input
              name="country"
              id="country"
              onChange={handleTagChange}
              placeholder={t("countryPlaceholder")}
              value={tagMVC.country}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* UPLOAD */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition"
                    onClick={() => handleApply(false)}
                  >
                    <span className="icon-upload"></span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side={"bottom"}>
                  <p>{t("uploadNewFile")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* APPEND */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition"
                    onClick={() => handleApply(true)}
                  >
                    <span className="icon-list-plus"></span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side={"bottom"}>
                  <p>{t("appendToList")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* Language Switcher */}
        <button
          className="absolute bottom-5 left-5 p-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition self-start"
          onClick={handleLanguage}
        >
          <span className="icon-languages"></span>
        </button>
      </div>

      {/* main */}
      <div
        className={`p-0 relative shadow-md shadow-zinc-300/50 rounded-xl flex flex-col h-[99vh] perspective-1000 border-box transition-all duration-1000 ease-in-out ${
          isCollapsed ? "w-[99%]" : "w-[88%]"
        }`}
      >
        {/* flipper */}
        <div
          className={`relative flex-1 transform-style-preserve-3d transition-transform duration-1500 ease-in-out ${
            isFlipped ? "rotateY-180" : "rotateY-0"
          }`}
        >
          {/* table */}
          <div className="absolute inset-0 backface-hidden p-6 overflow-y-auto flex flex-col">
            {/* switch */}

            <button
              className="absolute top-0 p-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition self-start"
              onClick={handleSwitch}
            >
              <span className="icon-repeat"></span>
            </button>

            {/* data */}
            {/*<div className="flex-1 overflow-y-auto">*/}
            <Table className="w-full">
              <TableHeader className="uppercase">
                <TableRow>
                  <TableHead>
                    No.{" "}
                    <div className="icon-arrow-down-1-0 text-sm inline"></div>
                  </TableHead>
                  <TableHead>{t("content")}</TableHead>
                  <TableHead>{t("source")}</TableHead>
                  <TableHead>{t("mission")}</TableHead>
                  <TableHead>{t("vac")}</TableHead>
                  <TableHead>{t("country")}</TableHead>
                  <TableHead>{t("sentiment")}</TableHead>
                  <TableHead>{t("severity")}</TableHead>
                  <TableHead>{t("topics")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Display only the first 3 items */}
                {masterData.slice(0, 3).map((item, index) => (
                  <TableRow key={index} className="h-16">
                    <TableCell className="w-1/12 max-w-[3vw] whitespace-break-spaces break-words text-ellipsis">
                      {masterData.length - index}
                    </TableCell>
                    <TableCell className="max-w-[30vw] block max-h-[25vh] overflow-auto whitespace-break-spaces break-words text-ellipsis">
                      {item.content}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.platform}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.mission}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.vac}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.country}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.sentiment}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.severity}
                    </TableCell>
                    <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                      {item.topics.join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Message row */}
                {masterData.length > 3 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-white">
                      <button
                        className="p-2 text-white text-xl bg-zinc-950 hover:bg-zinc-800 rounded transition"
                        onClick={() => setIsOpen(true)}
                      >
                        {t("fullList")}
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/*</div>*/}

            {/* download */}
            <button
              className={`fixed bottom-4 right-12 p-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition ${
                masterData.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                exportToExcel(masterData, t("sentimentAnalysisResult"))
              }
              disabled={masterData.length === 0}
            >
              <span className="icon-download"></span>
            </button>

            {/* fixed analysis */}
            <button
              className={`fixed bottom-4 right-4 p-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition ${
                masterData.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSentimentAnalysis}
              disabled={masterData.length === 0}
            >
              <span className="icon-chart-column-stacked"></span>
            </button>
          </div>

          {/* echarts */}
          <div className="absolute inset-0 backface-hidden rotateY-180 pt-8 pl-6 pr-6 pb-0 overflow-y-auto flex flex-col">
            {/* switch */}
            <button
              className="absolute top-0 p-1 text-white text-xl bg-zinc-950 hover:text-violet-300 rounded transition self-start"
              onClick={handleSwitch}
            >
              <span className="icon-repeat"></span>
            </button>

            {/* dashboard */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div
                  id="sentimentCounts"
                  className="chart bg-zinc-800 rounded-lg h-[45vh]"
                >
                  {barChartData ? (
                    <BarChart data={barChartData} />
                  ) : (
                    <p className="text-white">Loading Bar Chart...</p>
                  )}
                </div>

                <div id="wordCloudChart" className="chart bg-zinc-800 h-[45vh]">
                  {wordCloudData.length > 0 ? (
                    <EChartsWordCloud data={wordCloudData} />
                  ) : (
                    <p className="text-white">Loading Word Cloud...</p>
                  )}
                </div>
                <div className="chart bg-zinc-800 rounded-lg h-[45vh] grid grid-cols-2 gap-1">
                  {/* Negative Gauge */}
                  <div className="chart bg-zinc-800 rounded-lg h-[45vh]">
                    <GaugeChart
                      title={t("negativeChart")}
                      percentage={gaugeDataA.percentage}
                      total={gaugeDataA.total}
                      isReversed
                    />
                  </div>

                  {/* Positive Gauge */}
                  <div className="chart bg-zinc-800 rounded-lg h-[45vh]">
                    <GaugeChart
                      title={t("positiveChart")}
                      percentage={gaugeDataB.percentage}
                      total={gaugeDataB.total}
                    />
                  </div>
                </div>

                <div
                  id="stackedBarChart"
                  className="chart  bg-zinc-800 h-[45vh]"
                >
                  <div className="p-1" style={{ height: "44px" }}>
                    <Select
                      id="groupBy"
                      name="groupBy"
                      onChange={handleGroupByChange}
                      className="text-[14px] font-sans text-center bg-transparent"
                    >
                      <option
                        value="vac"
                        className="font-sans text-[14px] bg-transparent"
                      >
                        {t("sentimentByVac")}
                      </option>
                      <option
                        value="country"
                        className="font-sans text-[14px] bg-transparent"
                      >
                        {t("sentimentByCountry")}
                      </option>
                      <option
                        value="mission"
                        className="font-sans text-[14px] bg-transparent"
                      >
                        {t("sentimentByMission")}
                      </option>
                    </Select>
                  </div>
                  <div
                    className=" box-border "
                    style={{ height: "calc(45vh - 44px)" }}
                  >
                    {stackedBarData ? (
                      <StackedBarChart
                        categories={stackedBarData.categories}
                        series={stackedBarData.series}
                      />
                    ) : (
                      <p className="text-white">Loading Stacked Bar Chart...</p>
                    )}
                  </div>
                </div>

                <div className="chart rounded-lg bg-zinc-800 h-[45vh]">
                  {heatmapData ? (
                    <HeatmapChart
                      xAxis={heatmapData.xAxis}
                      yAxis={heatmapData.yAxis}
                      data={heatmapData.heatmapData}
                    />
                  ) : (
                    <p className="text-white">Loading Heatmap...</p>
                  )}
                </div>

                <div className="chart bg-zinc-800 rounded-lg h-[45vh]">
                  {platformPieData.length > 0 ? (
                    <PieChart data={platformPieData} />
                  ) : (
                    <p className="text-white">Loading Platform Pie Chart...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* data popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/*<DialogOverlay className="bg-black opacity-50" />*/}
        <DialogContent className="w-screen full-screen-dialog">
          <DialogHeader>
            <DialogTitle>{t("dataList")}</DialogTitle>
          </DialogHeader>
          <Table className="w-full">
            <TableHeader className="uppercase">
              <TableRow>
                <TableHead>
                  No. <div className="icon-arrow-down-1-0 text-sm inline"></div>
                </TableHead>
                <TableHead>{t("content")}</TableHead>
                <TableHead>{t("source")}</TableHead>
                <TableHead>{t("mission")}</TableHead>
                <TableHead>{t("vac")}</TableHead>
                <TableHead>{t("country")}</TableHead>
                <TableHead>{t("sentiment")}</TableHead>
                <TableHead>{t("severity")}</TableHead>
                <TableHead>{t("topics")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="w-1/12 max-w-[3vw] whitespace-break-spaces break-words text-ellipsis">
                    {masterData.length - index}
                  </TableCell>
                  <TableCell className="w-4/12 max-w-[30vw] whitespace-break-spaces break-words text-ellipsis">
                    {item.content}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.platform}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.mission}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.vac}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.country}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.sentiment}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.severity}
                  </TableCell>
                  <TableCell className="w-1/12 whitespace-break-spaces break-words text-ellipsis">
                    {item.topics}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
