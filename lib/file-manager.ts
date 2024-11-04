import { existsSync, unlinkSync } from "fs";

export function removeIfExists(path: string) {
  if (existsSync(path)) {
    try {
      unlinkSync(path);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
  return false;
}
