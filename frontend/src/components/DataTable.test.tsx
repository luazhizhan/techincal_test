import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataTable } from "./DataTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("DataTable", () => {
  it("renders table with data", async () => {
    render(<DataTable />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
    });
  });

  it("handles search input", async () => {
    render(<DataTable />, { wrapper });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    });
  });

  it("shows pagination when not searching", async () => {
    render(<DataTable />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("hides pagination when searching", async () => {
    render(<DataTable />, { wrapper });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });

    await waitFor(() => {
      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });
  });
});
