"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Theme } from "@/lib/utils";

export function Header({ theme }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(theme == "dark");

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">next-ytdl</h1>
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4" />
        <Switch
          checked={darkMode}
          onCheckedChange={() => {
            setDarkMode(!darkMode);
          }}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4" />
      </div>
    </div>
  );
}

type HeaderProps = {
  theme: Theme;
};
