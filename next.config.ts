import type { NextConfig } from "next";
import { cleanupTempFiles } from "./lib/cleanup";

if (typeof process !== "undefined") {
  cleanupTempFiles();
}
const nextConfig: NextConfig = {
  output: "standalone"
};

export default nextConfig;
