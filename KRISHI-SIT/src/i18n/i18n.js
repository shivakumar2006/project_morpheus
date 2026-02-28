import i18n, { init } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";
import pa from "./pa.json";

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    pa: { translation: pa },
}

const savedLng = localStorage.getItem("krishi_lang") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLng,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        react: { useSuspense: false }
    })

export default i18n;