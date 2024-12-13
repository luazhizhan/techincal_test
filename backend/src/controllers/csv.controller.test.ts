import request from "supertest";
import path from "path";
import app from "../index";
import fs from "fs";

describe("CSV Controller Tests", () => {
  // Helper function to create a temporary CSV file
  const createTempCSVFile = (content: string): string => {
    const tempPath = path.join(__dirname, "../../temp-test.csv");
    fs.writeFileSync(tempPath, content);
    return tempPath;
  };

  // createtempTxtFile
  const createTempTxtFile = (content: string): string => {
    const tempPath = path.join(__dirname, "../../temp-test.txt");
    fs.writeFileSync(tempPath, content);
    return tempPath;
  };

  // Clean up after tests
  afterEach(() => {
    const tempCSVPath = path.join(__dirname, "../../temp-test.csv");
    if (fs.existsSync(tempCSVPath)) {
      fs.unlinkSync(tempCSVPath);
    }
    const tempTxtPath = path.join(__dirname, "../../temp-test.txt");
    if (fs.existsSync(tempTxtPath)) {
      fs.unlinkSync(tempTxtPath);
    }
  });

  describe("POST /api/csv/upload", () => {
    it("should successfully upload a valid CSV file", async () => {
      const csvContent = "name,age,city\nJohn,30,New York\nJane,25,Los Angeles";
      const tempFilePath = createTempCSVFile(csvContent);

      const response = await request(app)
        .post("/api/csv/upload")
        .attach("file", tempFilePath);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "File uploaded successfully"
      );
      expect(response.body).toHaveProperty("count", 2);
    });

    it("should return 400 when no file is uploaded", async () => {
      const response = await request(app).post("/api/csv/upload");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "No file uploaded");
    });

    // upload non csv file
    it("should return 400 when non-CSV file is uploaded", async () => {
      const tempFilePath = createTempTxtFile("This is not a CSV file");

      const response = await request(app)
        .post("/api/csv/upload")
        .attach("file", tempFilePath);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Invalid file format. Only CSV files are allowed."
      );
    });

    it("should handle invalid CSV format", async () => {
      const invalidCSV = "invalid,csv\nformat,,missing,columns\n";
      const tempFilePath = createTempCSVFile(invalidCSV);

      const response = await request(app)
        .post("/api/csv/upload")
        .attach("file", tempFilePath);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Error parsing CSV file");
    });

    it("should handle empty CSV file", async () => {
      const emptyCSV = "";
      const tempFilePath = createTempCSVFile(emptyCSV);

      const response = await request(app)
        .post("/api/csv/upload")
        .attach("file", tempFilePath);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });
  });

  describe("GET /api/csv/data", () => {
    beforeEach(async () => {
      // Upload test data before each test
      const csvContent =
        "name,age,city\nJohn,30,New York\nJane,25,Los Angeles\nBob,35,Chicago";
      const tempFilePath = createTempCSVFile(csvContent);
      await request(app).post("/api/csv/upload").attach("file", tempFilePath);
    });

    it("should return paginated data with default pagination", async () => {
      const response = await request(app).get("/api/csv/data");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("currentPage");
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body.data.length).toBeLessThanOrEqual(10); // Default limit
    });

    it("should return correct page with custom pagination", async () => {
      const response = await request(app)
        .get("/api/csv/data")
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.currentPage).toBe(1);
    });

    it("should handle invalid pagination parameters", async () => {
      const response = await request(app)
        .get("/api/csv/data")
        .query({ page: "invalid", limit: "invalid" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      // Should use default pagination
      expect(response.body.currentPage).toBe(1);
    });
  });

  describe("GET /api/csv/search", () => {
    beforeEach(async () => {
      // Upload test data before each test
      const csvContent =
        "name,age,city\nJohn,30,New York\nJane,25,Los Angeles\nBob,35,Chicago";
      const tempFilePath = createTempCSVFile(csvContent);
      await request(app).post("/api/csv/upload").attach("file", tempFilePath);
    });

    it("should return matching results for valid search term", async () => {
      const response = await request(app)
        .get("/api/csv/search")
        .query({ term: "John" });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("name", "John");
    });

    it("should return empty array for non-matching search term", async () => {
      const response = await request(app)
        .get("/api/csv/search")
        .query({ term: "NonExistent" });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it("should handle case-insensitive search", async () => {
      const response = await request(app)
        .get("/api/csv/search")
        .query({ term: "john" });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("name", "John");
    });

    it("should return 400 when no search term is provided", async () => {
      const response = await request(app).get("/api/csv/search");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Search term is required");
    });
  });
});
