const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 10000;

// Replace these with your actual values
const SWITCHBOT_TOKEN = "c0IaZV8PfGRV1WVfun1K9h"; // Your key (confirm)
const DEVICE_ID = "DA:7C:CB:C0:5E:31";

app.get("/", (req, res) => {
  res.send("✅ SwitchBot Webhook Server is running!");
});

app.get("/gate", async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.switch-bot.com/v1.0/devices/${DEVICE_ID}/commands`,
      {
        command: "press",
        parameter: "default",
        commandType: "command",
      },
      {
        headers: {
          Authorization: SWITCHBOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.send("✅ Gate triggered successfully!");
  } catch (err) {
    console.error("❌ Error triggering SwitchBot:", err.response?.data || err.message);
    res.status(500).send("❌ Failed to trigger gate");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
