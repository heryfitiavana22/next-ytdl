import { Header } from "@/components/header";
import { Downloader } from "@/features/downloader/downloader";

export default function Home() {
  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Header />
        <main className="">
          <Downloader />
        </main>
      </div>
    </div>
  );
}
