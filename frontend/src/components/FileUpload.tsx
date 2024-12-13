import React, { useCallback, useState } from "react";
import { Button, Paper, Progress } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { csvAPI } from "../services/api";
import toast from "react-hot-toast";

export const FileUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        await csvAPI.uploadFile(file);
        toast.success("File uploaded successfully");
        queryClient.invalidateQueries({ queryKey: ["csvData"] });
      } catch {
        toast.error("Error uploading file");
      } finally {
        setUploading(false);
        setProgress(100);
      }
    },
    [queryClient]
  );

  return (
    <Paper p="md" radius="md" withBorder>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        id="csv-upload"
        data-testid="file-input"
      />
      <Button
        component="label"
        htmlFor="csv-upload"
        loading={uploading}
        fullWidth
      >
        Upload CSV File
      </Button>
      {uploading && (
        <Progress
          value={progress}
          mt="md"
          size="sm"
          data-testid="upload-progress"
        />
      )}
    </Paper>
  );
};
