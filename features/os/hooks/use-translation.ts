
import { useOSStore } from '../stores/os-store';
import { TRANSLATIONS } from '../../../config/translations';

export const useTranslation = () => {
    const { language } = useOSStore();

    const t = (key: string): string => {
        const langDict = TRANSLATIONS[language];
        return langDict[key] || key;
    };

    return { t, language };
};
