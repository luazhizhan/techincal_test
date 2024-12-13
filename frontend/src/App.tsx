import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { FileUpload } from "./components/FileUpload";
import { DataTable } from "./components/DataTable";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalClasses>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">CSV Data Manager</h1>
          <FileUpload />
          <div className="mt-4">
            <DataTable />
          </div>
        </div>
        <Toaster position="top-right" />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
