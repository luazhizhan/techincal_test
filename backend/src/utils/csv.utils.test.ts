import { validateCSVFile, removeBOM } from "./csv.utils";

describe("CSV Utilities", () => {
  describe("validateCSVFile", () => {
    it("should validate CSV file extension", () => {
      expect(validateCSVFile("test.csv")).toBe(true);
      expect(validateCSVFile("test.CSV")).toBe(true);
      expect(validateCSVFile("test.txt")).toBe(false);
      expect(validateCSVFile("")).toBe(false);
    });
  });
});
