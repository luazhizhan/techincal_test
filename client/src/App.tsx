import { useEffect, useState } from "react";
import "./App.css";
import Card, { Data } from "./Card";
import useDebounce from "./useDebounce";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // paginated data
  const [data, setData] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // Number of items per page

  // search data
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  //#region upload file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await fetch("http://localhost:3001/api/csv/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "File upload failed.");
      }

      await response.json();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsUploading(false);
    }
  };
  //#endregion

  //#region Pagination
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3001/api/csv/data?page=${currentPage}&limit=${limit}&term=${debouncedSearchTerm.trim()}`
      );
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      if (result.totalPages > 0 && currentPage > result.totalPages) {
        setCurrentPage(1);
      }
    };
    if (currentPage === 0) return;
    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  //#endregion

  return (
    <>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <input
        type="file"
        accept=".csv" // Restrict to CSV files
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
      <>
        <div className="paginated-cards">
          {currentPage > 0 && (
            <>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
          <div className="cards-container">
            {data.map((item) => (
              <Card key={item.id} data={item} />
            ))}
          </div>
        </div>
      </>
    </>
  );
}

export default App;
