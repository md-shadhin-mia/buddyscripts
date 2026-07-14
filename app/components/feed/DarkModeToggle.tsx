"use client";

import { IconMoon, IconSun } from "../icons";
import { useDarkMode } from "@/lib/DarkModeContext";

export const DarkModeToggle: React.FC = () => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <div className="_layout_mode_swithing_btn">
      <button
        type="button"
        className="_layout_swithing_btn_link"
        onClick={toggleDark}
      >
        <div className="_layout_swithing_btn">
          <div className="_layout_swithing_btn_round"></div>
        </div>
        <div className="_layout_change_btn_ic1">
          <IconMoon size={11} />
        </div>
        <div className="_layout_change_btn_ic2">
          <IconSun size={24} />
        </div>
      </button>
    </div>
  );
};
