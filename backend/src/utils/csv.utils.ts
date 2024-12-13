import fs from "fs";
export const validateCSVFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith(".csv");
};

export const removeBOM = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
  const cleanedContent = fileContent.replace(/^\uFEFF/, ""); // Remove BOM if present
  fs.writeFileSync(filePath, cleanedContent, { encoding: "utf8" });
};

// Remove quotes from the header
export const cleanHeader = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
  const lines = fileContent.split("\n");
  if (lines.length > 0) {
    lines[0] = lines[0].replace(/(^"|"$)/g, "").replace(/","/g, ","); // Remove quotes from the header
  }
  fs.writeFileSync(filePath, lines.join("\n"), { encoding: "utf8" });
};
