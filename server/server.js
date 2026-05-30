const express = require("express");
const sellerRoutes = require("./Routes/sellerRoutes");
const webhookRoutes = require("./Routes/webhook");
const adminRoutes = require("./Routes/adminRoutes");
const userRoutes = require("./Routes/userRoutes");
require("dotenv").config();
const connectDB = require("./Configurations/mongoDBConfig");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require("./Utils/corn");
const PORT = process.env.PORT || 3000;

// ✅ Built-in JSON parser
// app.use("/webhook",express.raw({ type: "application/json" }));
app.use("/api/webhook", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));
app.use(cookieParser());

// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));

// ✅ Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
// app.use("/api/webhook",webhookRoutes);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// ✅ Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
