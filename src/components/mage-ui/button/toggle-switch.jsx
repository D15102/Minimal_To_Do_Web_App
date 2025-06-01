"use client";
import { useState } from "react";
import useTheme from "../../../contexts/ThemeContext";

const ToggleSwitch = ({ onChange, className }) => {
  const { themeMode, lightMode, darkMode } = useTheme();
  const handleCheckboxChange = (e) => {
    const darkModeStatus = e.currentTarget.checked;
    console.log(darkModeStatus);
    darkModeStatus ? darkMode() : lightMode();

  };

  return (
    <>
      <div className={`${className}`}>
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              type="checkbox"
              checked={themeMode === "dark"}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <div
              className={`box block h-8 w-14 bg-zinc-300 rounded-full ${
                themeMode === "dark" ? "bg-muted" : "bg-muted"
              }`}
            />
            <div
              className={`absolute left-1 top-1 flex h-6 w-6  items-center justify-center rounded-full transition ${
                themeMode === "dark"
                  ? " bg-indigo-600 translate-x-full bg-foreground/75"
                  : "bg-zinc-800 bg-foreground/50"
              }`}
            />
          </div>
        </label>
      </div>
    </>
  );
};

export default ToggleSwitch;
