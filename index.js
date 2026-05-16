const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Ruta para que Railway vea que el servidor está vivo
app.get('/', (req, res) => {
    res.send('Servidor activo y funcionando 🚀');
});

app.post('/webhook', async (req, res) => {
    console.log("Datos de TikFinity:", req.body);
    
    const info = {
        tiktokUser: req.body.nickname || req.body.username || "Usuario",
        giftName: req.body.gift_name || "Regalo"
    };

    try {
        const url = `https://apis.roblox.com/messaging-service/v1/universes/${process.env.EXPERIENCE_ID}/topics/TikTokLiveEvents`;
        
        await axios.post(url, { message: JSON.stringify(info) }, {
            headers: { 
                'x-api-key': process.env.ROBLOX_API_KEY, 
                'Content-Type': 'application/json' 
            }
        });
        
        console.log(`✅ Enviado a Roblox: ${info.tiktokUser}`);
        res.status(200).send("OK");
    } catch (e) {
        console.log("❌ Error:", e.message);
        res.status(500).send("Error");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Puerto: ${PORT}`);
});
