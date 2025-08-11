const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const scrapeRoutes = require("./routes/scrapeRoutes");
const queryRoutes = require("./routes/queryRoutes")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "You're sending too many requests. Please wait a minute and try again.",
    });
  },
});
app.use(limiter);

// Routes
app.use("/", scrapeRoutes);

// Start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
