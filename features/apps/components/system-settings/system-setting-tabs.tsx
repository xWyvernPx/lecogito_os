import { SystemConfigurationTab } from "@/types";
import { CategoriesSettingTab } from "./tabs/categories-setting-tab";
import { SeriesSettingTab } from "./tabs/series-setting-tab";
import { UserSettingTab } from "./tabs/user-settings-tab";

type Props = {
  activeTab: SystemConfigurationTab;
};

export const SystemSettingTabs = ({ activeTab }: Props) => {
  switch (activeTab) {
    case "CATEGORIES":
      return <CategoriesSettingTab />;
    case "SERIES":
      return <SeriesSettingTab />;
    default:
      return <UserSettingTab />;
  }
};
