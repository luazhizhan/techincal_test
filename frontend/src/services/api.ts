import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CSVRecord {
  [key: string]: string | number;
}

export const csvAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ message: string; count: number }>(
      "/csv/upload",
      formData
    );
    return response.data;
  },

  getData: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<PaginatedResponse<CSVRecord>>("/csv/data", {
      params: { page, limit },
    });
    return response.data;
  },

  searchData: async (term: string) => {
    const response = await api.get<CSVRecord[]>("/csv/search", {
      params: { term },
    });
    return response.data;
  },
};
