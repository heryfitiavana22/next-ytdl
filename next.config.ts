import type { NextConfig } from "next";
import { cleanupTempFiles } from "./lib/cleanup";

if (typeof process !== "undefined") {
  cleanupTempFiles();
}
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
