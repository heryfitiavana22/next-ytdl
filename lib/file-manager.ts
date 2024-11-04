import { existsSync, unlinkSync } from "fs";

export function removeIfExists(path: string) {
  if (existsSync(path)) {
    try {
      unlinkSync(path);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}
