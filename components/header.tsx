import { Theme } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

export function Header({}: HeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">next-ytdl</h1>
      <ThemeSwitcher />
    </div>
  );
}

type HeaderProps = {
  theme?: Theme;
};
