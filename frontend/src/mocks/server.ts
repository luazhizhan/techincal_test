import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.post("http://localhost:3001/api/csv/upload", () => {
    return HttpResponse.json({
      message: "File uploaded successfully",
      count: 10,
    });
  }),

  http.get("http://localhost:3001/api/csv/data", () => {
    return HttpResponse.json({
      data: [
        { name: "John", age: 30, city: "New York" },
        { name: "Jane", age: 25, city: "Los Angeles" },
      ],
      total: 2,
      currentPage: 1,
      totalPages: 1,
    });
  }),

  http.get("http://localhost:3001/api/csv/search", (req) => {
    const term = req.params["term"] as string;
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Jane", age: 25, city: "Los Angeles" },
    ].filter((item) =>
      Object.values(item).some((val) =>
        val
          .toString()
          .toLowerCase()
          .includes(term?.toLowerCase() || "")
      )
    );
    return HttpResponse.json(data);
  })
);
