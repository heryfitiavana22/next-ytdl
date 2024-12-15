"use client";

import { useTheme } from "next-themes";
import { assureClient } from "./assure-client";
import { Switch } from "./ui/switch";
import { Moon, Sun } from "lucide-react";

export const ThemeSwitcher = assureClient(() => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme == "dark"}
        onCheckedChange={() => {
          setTheme(theme == "dark" ? "light" : "dark");
        }}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
});
