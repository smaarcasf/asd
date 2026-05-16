const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
    // Si TikFinity manda datos, los usamos. Si no, ponemos unos de prueba.
    const usuario = req.body.nickname || req.body.username || "Seguidor_TikTok";
    const regalo = req.body.gift_name || req.body.gift || "Regalo_Sorpresa";

    console.log(`Recibido: ${usuario} envió ${regalo}`);

    const payload = {
        tiktokUser: usuario,
        giftName: regalo
    };

    try {
        const url = `https://apis.roblox.com/messaging-service/v1/universes/${process.env.EXPERIENCE_ID}/topics/TikTokLiveEvents`;
        
        await axios.post(url, { message: JSON.stringify(payload) }, {
            headers: { 
                'x-api-key': process.env.ROBLOX_API_KEY, 
                'Content-Type': 'application/json' 
            }
        });

        console.log("✅ ¡Enviado a Roblox con éxito!");
        res.status(200).send("OK");
    } catch (e) {
        console.log("❌ Error de Roblox:", e.response ? e.response.data : e.message);
        // Respondemos 200 para que TikFinity no piense que falló el servidor
        res.status(200).send("Error atrapado");
    }
});

app.get('/', (req, res) => res.send("Servidor Funcionando 🚀"));

app.listen(process.env.PORT || 8080);
