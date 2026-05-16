const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const EXPERIENCE_ID = process.env.EXPERIENCE_ID;
const TOPIC_NAME = "TikTokLiveEvents"; 

app.post('/webhook', async (req, res) => {
    console.log("Datos crudos de TikFinity:", req.body);

    const userData = {
        tiktokUser: req.body.nickname || req.body.username || "Usuario",
        giftName: req.body.gift_name || "Regalo"
    };

    try {
        const url = `https://apis.roblox.com/messaging-service/v1/universes/${EXPERIENCE_ID}/topics/${TOPIC_NAME}`;
        await axios.post(url, { message: JSON.stringify(userData) }, {
            headers: { 'x-api-key': ROBLOX_API_KEY, 'Content-Type': 'application/json' }
        });
        console.log(`✅ Enviado a Roblox: ${userData.tiktokUser}`);
        res.status(200).send("OK");
    } catch (e) {
        res.status(500).send("Error");
    }
});

app.listen(process.env.PORT || 8080);
