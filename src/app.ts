import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes";
import walletRoutes from "./routes/walletRoutes";
import tradeRoutes from "./routes/tradeRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Gold Trading API is running"
  });
});

export default app;