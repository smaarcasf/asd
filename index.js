const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Variables de entorno
const { ROBLOX_API_KEY, EXPERIENCE_ID } = process.env;

app.post('/webhook', async (req, res) => {
    console.log("Datos recibidos:", req.body);
    
    // Capturamos el nombre de quien envía
    const info = {
        tiktokUser: req.body.nickname || req.body.username || "Usuario",
        giftName: req.body.gift_name || "Regalo"
    };

    try {
        const url = `https://apis.roblox.com/messaging-service/v1/universes/${EXPERIENCE_ID}/topics/TikTokLiveEvents`;
        await axios.post(url, { message: JSON.stringify(info) }, {
            headers: { 'x-api-key': ROBLOX_API_KEY, 'Content-Type': 'application/json' }
        });
        console.log(`✅ Enviado a Roblox: ${info.tiktokUser}`);
        res.status(200).send("OK");
    } catch (e) {
        console.log("❌ Error:", e.message);
        res.status(500).send("Error");
    }
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Servidor Online"));
