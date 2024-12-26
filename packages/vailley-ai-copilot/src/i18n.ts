import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      "file": "File",
      "source": "Source",
      "vac": "VAC",
      "mission": "Mission",
      "country": "Country",
      "content": "Content",
      "uploadNewFile": "Upload New File",
      "appendToList": "Append To List",
      "viewFullList": "Click to View Full List",
      "download": "Download",
      "sentimentAnalysis": "Sentiment Analysis",
      "sentiment": "Sentiment",
      "severity": "Severity",
      "topics": "Topics",
      "chatbotLog": "Chatbot Log",
      "socialMedia": "Social Media",
      "vacPlaceholder": "Enter a VAC",
      "missionPlaceholder": "Enter a Mission",
      "countryPlaceholder": "Enter a Country",
      "fullList": "Click to View Full List",
      "dataList": "Data List",
      "count": "Count",
      "negativeChart": "Negative w/ Severity ≥ 2",
      "positiveChart": "Positive w/ Severity ≥ 2",
      "sentimentByVac": "Sentiment by VAC",
      "sentimentByCountry": "Sentiment by Country",
      "sentimentByMission": "Sentiment by Mission",
      "sentimentTop10": "Sentiment by Top 10 Topics",
      "sentimentByTopics": "Sentiment by Topics",
      "sourceDistribution": "Source Distribution",
      "sentimentAnalysisResult": "Sentiment Analysis Result",
      // Add other translations as needed
    }
  },
  zh: {
    translation: {
      "file": "文件",
      "source": "来源",
      "vac": "签证中心",
      "mission": "抵达国家",
      "country": "国家",
      "uploadNewFile": "上传新文件",
      "appendToList": "追加到列表",
      "viewFullList": "点击查看完整列表",
      "download": "下载",
      "sentimentAnalysis": "情感分析",
      "chatbotLog": "对话记录",
      "socialMedia": "社交媒体",
      "vacPlaceholder": "输入一个签证中心",
      "missionPlaceholder": "输入一个抵达国家",
      "countryPlaceholder": "输入一个国家",
      "content": "内容",
      "sentiment": "情感",
      "severity": "程度",
      "topics": "话题",
      "fullList": "点击查看全列表",
      "dataList": "数据列表",
      "count": "数量",
      "negativeChart": "消极且中等以上程度",
      "positiveChart": "积极且中等以上程度",
      "sentimentByVac": "按签证中心分析情感",
      "sentimentByCountry": "按国家分析情感",
      "sentimentByMission": "按抵达国家分析情感",
      "sentimentTop10": "前10话题的情感分析",
      "sentimentByTopics": "按话题的分析情感",
      "sourceDistribution": "平台分布",
      "sentimentAnalysisResult": "情感分析结果",
      // Add other translations as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    keySeparator: false, // We use content as keys
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
