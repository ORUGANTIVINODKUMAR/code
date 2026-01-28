const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// 👇 LOAD ROOT .env FILE
dotenv.config();


const connectDB = require("./config/db");
const budgetRoutes = require("./routes/budget.routes");
const authRoutes = require("./routes/auth.routes");
const townshipRoutes = require("./routes/township.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://code-3-0m74.onrender.com/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// ✅ CONNECT DB AFTER dotenv
connectDB();

app.use("/api/budgets", budgetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/townships", require("./routes/township.routes"));


app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);

});
