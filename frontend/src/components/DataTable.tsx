import React from "react";
import { Table, Pagination, TextInput, Paper, Text } from "@mantine/core";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { csvAPI, CSVRecord, PaginatedResponse } from "../services/api";
import { useDebouncedValue } from "@mantine/hooks";

export const DataTable: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const { data: tableData, isLoading } = useQuery<
    CSVRecord[] | PaginatedResponse<CSVRecord>
  >({
    queryKey: ["csvData", page, debouncedSearch],
    queryFn: () => {
      if (debouncedSearch) {
        return csvAPI.searchData(debouncedSearch);
      }
      return csvAPI.getData(page, 10);
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const headers = (tableData as PaginatedResponse<CSVRecord>)?.data?.[0]
    ? Object.keys((tableData as PaginatedResponse<CSVRecord>).data[0])
    : [];

  return (
    <Paper p="md" radius="md" withBorder>
      <TextInput
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="md"
        data-testid="search-input"
      />

      <Table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(tableData as PaginatedResponse<CSVRecord>)?.data?.map(
            (row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`}>{row[header]}</td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </Table>

      {!debouncedSearch && tableData && "totalPages" in tableData && (
        <Pagination
          total={tableData.totalPages}
          value={page}
          onChange={setPage}
          mt="md"
          data-testid="pagination"
        />
      )}
    </Paper>
  );
};
