import { Header } from "@/components/header";
import { Downloader } from "@/features/downloader/downloader";
import { Theme } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = (themeCookie?.value || "light") as Theme;

  return (
    <div
      className={`min-h-screen ${
        theme == "dark" ? "dark" : ""
      } bg-background text-foreground`}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Header theme={theme} />
        <main className="">
          <Downloader />
        </main>
      </div>
    </div>
  );
}
