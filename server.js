const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Default route — load index.html automatically
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conversion factors for all supported types
const conversionFactors = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  mass: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
  },
  temperature: {}, 
  area: {
    "square meter": 1,
    "square kilometer": 1e6,
    "square centimeter": 0.0001,
    "square millimeter": 1e-6,
    hectare: 10000,
    acre: 4046.86,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    cubic_meter: 1000,
    gallon: 3.78541,
    pint: 0.473176,
  },
  "digital-storage": {
    bit: 1 / 8,
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 ** 2,
    gigabyte: 1024 ** 3,
    terabyte: 1024 ** 4,
  },
  angle: {
    degree: 1,
    radian: 57.2958,
    gradian: 0.9,
  },
};

// Route for conversion
app.post("/api/convert", (req, res) => {
  const { type, from, to, value } = req.body;

  if (type === "temperature") {
    let result;
    if (from === "celsius" && to === "fahrenheit") result = (value * 9) / 5 + 32;
    else if (from === "fahrenheit" && to === "celsius") result = ((value - 32) * 5) / 9;
    else if (from === "celsius" && to === "kelvin") result = value + 273.15;
    else if (from === "kelvin" && to === "celsius") result = value - 273.15;
    else if (from === "fahrenheit" && to === "kelvin") result = ((value - 32) * 5) / 9 + 273.15;
    else if (from === "kelvin" && to === "fahrenheit") result = ((value - 273.15) * 9) / 5 + 32;
    else result = value;
    return res.json({ result });
  }

  const factors = conversionFactors[type];
  if (!factors || !factors[from] || !factors[to]) {
    return res.status(400).json({ error: "Invalid conversion units or type" });
  }

  const result = (value * factors[from]) / factors[to];
  res.json({ result: parseFloat(result.toFixed(6)) });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


