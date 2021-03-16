import { fetch_config } from './config';
import serveIndex from 'serve-index';
import express from 'express';
import { find_data } from './list-data';
import { calc_size, get_disk_capacity } from './utilities';
import axios from 'axios';
import fs = require('fs');

const config = fetch_config();

const app = express();

app.use(express.json());

app.get('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).end();
        return;
    }

    res.json({ res: find_data(config.testdata_path, id) }).end();
});

app.get('/api/size', async (req, res) => {
    res.json({ res: await calc_size(config.testdata_path) }).end();
});

app.get('/api/capacity', async (req, res) => {
    res.json({ res: await get_disk_capacity(config.testdata_path) }).end();
});

app.get('/api/alive', (req, res) => {
    res.send('true').end();
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    const {pid, testdata_url, callback_uid} = data;
    axios.get(testdata_url).then(async res => {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('status code is not OK.');
        }
        fs.writeFileSync(`${config.testdata_path}/${pid}.zip`, res.data.toString());
        await axios.get(`${config.leader_url}/api/data-ready/${callback_uid}`);
    }).catch(err => {
        console.error(`Failed to get ${testdata_url}: ${err}`);
    });
    res.send('OK').end();
});

app.use(express.static(config.testdata_path), serveIndex(config.testdata_path, { icons: true }));

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}.`);
});
