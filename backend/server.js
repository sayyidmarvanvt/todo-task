import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/tasks", taskRoutes);

app.get("/", async (req, res) => {
  try {
    res.json("hi");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
