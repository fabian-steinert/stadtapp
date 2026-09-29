const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const POIS_FILE = path.join(__dirname, "data", "pois.json");

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./views");

function readPois() {
  try {
    return JSON.parse(fs.readFileSync(POIS_FILE, "utf8"));
  } catch (error) {
    return [];
  }
}

function writePois(pois) {
  fs.mkdirSync(path.dirname(POIS_FILE), { recursive: true });
  fs.writeFileSync(POIS_FILE, JSON.stringify(pois, null, 2) + "\n", "utf8");
}

app.get("/", (req, res) => {
  res.render("index", {
    title: "Karlsruhe StadtApp"
  });
});

app.get("/api/pois", (req, res) => {
  res.json(readPois());
});

app.post("/api/pois", (req, res) => {
  const { title, description, address, author, latitude, longitude } = req.body;

  if (!title || !author || !address || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({ error: "Titel, Adresse, Autor:in und Koordinaten sind erforderlich." });
  }

  const pois = readPois();
  const poi = {
    id: Date.now().toString(),
    title: String(title).trim(),
    description: String(description || "").trim(),
    address: String(address).trim(),
    author: String(author).trim(),
    latitude,
    longitude
  };

  pois.push(poi);
  writePois(pois);
  res.status(201).json(poi);
});

app.put("/api/pois/:id", (req, res) => {
  const pois = readPois();
  const index = pois.findIndex((poi) => poi.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "POI nicht gefunden." });
  }

  const { title, description, address, author } = req.body;

  if (!title || !author || !address) {
    return res.status(400).json({ error: "Titel, Adresse und Autor:in sind erforderlich." });
  }

  pois[index] = {
    ...pois[index],
    title: String(title).trim(),
    description: String(description || "").trim(),
    address: String(address).trim(),
    author: String(author).trim()
  };

  writePois(pois);
  res.json(pois[index]);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
