const express = require("express");
const noblox = require("noblox.js");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID;
const TOPIC_NAME = process.env.TOPIC_NAME;

app.post("/webhook", async (req, res) => {
    const tiktokUser = req.body.value1 || "Usuario";
    const robloxName = (req.body.value2 || "").replace(/\s+/g, "");
    const coins = parseInt(req.body.coins) || 0;

    try {
        let userId = 1;
        let finalName = "FALLBACK_NPC";

        if (robloxName.length >= 3 && robloxName.length <= 20) {
            const userData = await noblox.getUsers([robloxName]);
            if (userData.length > 0) {
                userId = userData[0].id;
                finalName = robloxName;
            }
        }

        const url = `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${TOPIC_NAME}`;
        await fetch(url, {
            method: 'POST',
            headers: { 
                'x-api-key': ROBLOX_API_KEY, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ message: JSON.stringify({ tiktokUser, robloxUser: finalName, userId, coins }) })
        });

        console.log(`✅ Enviado a Roblox: ${tiktokUser} -> ${finalName}`);
        res.json({ success: true });
    } catch (e) {
        console.log("❌ Error:", e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 PROXY ONLINE EN PUERTO ${PORT}`));