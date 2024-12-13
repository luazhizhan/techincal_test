import express from "express";
import cors from "cors";
import { csvRouter } from "./routes/csv.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/csv", csvRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is running on port ${PORT}`);
  }
});

export default app;
