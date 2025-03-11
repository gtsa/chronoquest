import { useTranslation } from "react-i18next";
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('el')}>EL</button>
    </div>
  );
};

export default LanguageSwitcher;
