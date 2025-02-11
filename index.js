import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express(); // main app
const PORT = process.env.PORT || 4000;

app.use(express.static("public"));

app.use(
  cors({
    origin: "https://mellow-dev.webflow.io",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working, go to /api/data for getting data.");
});

app.get("/ping-supabase", async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;

  try {
    const response = await fetch(supabaseUrl);
    res.status(response.status).send("Supabase доступен!");
  } catch (error) {
    console.error("Ошибка подключения к Supabase:", error);
    res.status(500).send("Нет доступа к Supabase");
  }
});

app.get("/api/data", async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_API_KEY;

  try {
    const response = await fetch(`${supabaseUrl}?select=*`, {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from Supabase" });
  }
});

app.listen(PORT, () => {
  console.log(`Server has been started on http://localhost:${PORT}`);
});
