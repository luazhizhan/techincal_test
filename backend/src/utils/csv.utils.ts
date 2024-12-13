export const validateCSVFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith(".csv");
};
