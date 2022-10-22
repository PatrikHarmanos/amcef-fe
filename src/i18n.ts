import {initReactI18next} from "react-i18next";
import i18n from "i18next";
import english from './i18n/english.json';
import slovak from './i18n/slovak.json';

export const getInit = () => {
    return {
        en: { translation: english },
        sk: { translation: slovak }
    }
}

const storedLanguage = localStorage.getItem("language")
const language = storedLanguage && ['en', 'sk'].includes(storedLanguage) ? storedLanguage : 'en';

i18n.use(initReactI18next)
    .init({
        resources: getInit(),
        lng: language,
        fallbackLng: "en"
    });
