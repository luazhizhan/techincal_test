import { Request, Response } from "express";
import { parse } from "csv-parse";
import fs from "fs";
import { validateCSVFile } from "../utils/csv.utils";

interface CSVData {
  [key: string]: string | number;
}

// Hold memory of uploaded CSV data
let csvData: CSVData[] = [];

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!validateCSVFile(req.file.originalname)) {
      return res
        .status(400)
        .json({ error: "Invalid file format. Only CSV files are allowed." });
    }

    const results: CSVData[] = [];
    fs.createReadStream(req.file.path)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        csvData = results;
        fs.unlinkSync(req.file!.path); // Clean up uploaded file
        res.json({
          message: "File uploaded successfully",
          count: results.length,
        });
      })
      .on("error", (error) => {
        res.status(500).json({ error: "Error parsing CSV file" });
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getData = (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
      data: csvData.slice(startIndex, endIndex),
      total: csvData.length,
      currentPage: page,
      totalPages: Math.ceil(csvData.length / limit),
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const searchData = (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.term as string;
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const results = csvData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
