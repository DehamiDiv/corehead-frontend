"use server";

import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "bindings.json");

export async function saveBindings(mode: string, selected: Record<string, boolean>) {
  try {
    // Ensure data directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });

    const data = {
      mode,
      selected,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Failed to save bindings:", error);
    return { success: false, error: "Failed to save bindings" };
  }
}

export async function getBindings() {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // Return null if file doesn't exist or error reading
    return null;
  }
}
