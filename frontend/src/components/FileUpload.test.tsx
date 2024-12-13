import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FileUpload } from "./FileUpload";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("FileUpload", () => {
  it("renders upload button", () => {
    render(<FileUpload />, { wrapper });
    expect(screen.getByText(/Upload CSV File/i)).toBeInTheDocument();
  });

  it("handles file upload", async () => {
    render(<FileUpload />, { wrapper });

    const file = new File(["test,data"], "test.csv", { type: "text/csv" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Upload CSV File/i)).toBeInTheDocument();
    });
  });

  it("shows error for non-CSV files", async () => {
    render(<FileUpload />, { wrapper });

    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument();
    });
  });
});
