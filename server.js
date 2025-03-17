const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        res.set('Access-Control-Allow-Origin', '*');
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => console.log(`CORS Proxy running on port ${PORT}`));
