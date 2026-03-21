const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const Url = require("./models/urlModel");
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "Url Required" });

    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      res.json({ shortUrl: `http://localhost:3000/${existing.shortCode}` });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    res.json({ shortUrl: `http://localhost:3000/${existing.shortCode}` });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const data = await Url.findOne({ shortCode });
    if (!data) return res.status(404).json({ error: "URL not found" });

    data.clicks = +1;
    await data.save();
    res.redirect(data.originalUrl);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error });
  }
});

app.get("/stats/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const data = await Url.findOne({ shortCode });
    if (!data) return res.status(404).json({ error: "data not found" });
    res.json({ stats: data.clicks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
