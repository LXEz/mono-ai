import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    console.log(lang);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => switchLanguage("en")}>English</button>
      <button onClick={() => switchLanguage("zh")}>中文</button>
    </div>
  );
};

export default LanguageSwitcher;
