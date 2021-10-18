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
    let baseUrl = `https://cdn.ffxivteamcraft.com/assets/data`;
    if (contentName === 'extracts') {
        baseUrl = `https://cdn.ffxivteamcraft.com/assets/extracts`;
    }
    const response = await axios.get(`${baseUrl}/${contentName}.${hash}.json`);
    CACHE[key] = await response.data;
    return CACHE[key];
};

app.get('/:hash/:contentName/:ids', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    }
    try {
        const data = await getData(req.params.hash, req.params.contentName);
        res.set('Cache-control', 'public, max-age=31536000');
        const resultData = req.params.ids.split(',').reduce((acc, id) => {
            return {
                ...acc,
                [+id]: data[+id]
            }
        }, {});
        res.json(resultData);
    } catch (e) {
        res.status(404).send();
    }
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
