const express = require('express');
const axios = require('axios');

const app = express();

/**
 * { hash: contentName: content}
 */
const CACHE = {};

const getData = async (hash, contentName) => {
    const key = `${contentName}:${hash}`;
    if (CACHE[key]) {
        return CACHE[key];
    }
    try {
        let baseUrl = `https://cdn.ffxivteamcraft.com/assets/data`;
        if (contentName === 'extracts') {
            baseUrl = `https://cdn.ffxivteamcraft.com/assets/extracts`;
        }
        const response = await axios.get(`${baseUrl}/${contentName}.${hash}.json`);
        CACHE[key] = await response.data;
        return CACHE[key];
    } catch (error) {
        console.log(error);
    }
};

app.get('/:hash/:contentName/:id', async (req, res) => {
    const data = await getData(req.params.hash, req.params.contentName);
    res.json(data[+req.params.id]);
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
