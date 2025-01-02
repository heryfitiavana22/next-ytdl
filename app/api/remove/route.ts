import { NextResponse } from "next/server";
import { normalizeFilename } from "@/lib/utils";
import { join } from "path";
import { tmpdir } from "os";
import { removeIfExists } from "@/lib/file-manager";
import { withFilename } from "../with-filename";

export const GET = withFilename(
  async ({ params: { filename: filenameParams } }) => {
    const tempFilename = decodeURIComponent(filenameParams);
    const filename = normalizeFilename(tempFilename);

    try {
      const filePath = join(tmpdir(), filename);
      removeIfExists(filePath);
      return NextResponse.json(
        { message: "File removed successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("File not found:", error);
      return new Response("File not found", { status: 404 });
    }
  }
);
