import { fetch_config } from './config';
import serveIndex from 'serve-index';
import express from 'express';
import { find_data } from './list-data';
import { calc_size, get_disk_capacity } from './utilities';
import axios from 'axios';
import { promises as fs } from "fs";
import { set_database_path, write_datetime, read_datetime } from './datetime'

const config = fetch_config();
set_database_path(config.database_path);

const app = express();

app.use(express.json());

async function init(retry_left) {
    if (retry_left <= 0) {
        throw Error('Cannot connect');
    }
    try {
        await axios.post(`${config.leader_url}/api/data-server`, {
            port: config.port
        });
    } catch (err) {
        console.error(`Failed to connect the Judge Leader: ${err} [retry left ${retry_left - 1}]`);
        await init(retry_left - 1);
    }
}

app.get('/api/data/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).end();
        return;
    }

    if (find_data(config.testdata_path, id)) {
        res.json({ exist: true, time: await read_datetime(id) }).end();
    } else {
        res.json({ exist: false }).end();
    }
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
    const { pid, testdata_url, callback_uid, time } = data;
    const last_change_time = new Date(time);
    axios.get(testdata_url).then(async res => {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('status code is not OK.');
        }
        await fs.writeFile(`${config.testdata_path}/${pid}.zip`, res.data.toString());
        await Promise.all([
            write_datetime(pid, last_change_time),
            axios.get(`${config.leader_url}/api/data-ready/${callback_uid}`),
        ]);
    }).catch(err => {
        console.error(`Failed to get ${testdata_url}: ${err}`);
    });
    res.send('OK').end();
});

app.use(express.static(config.testdata_path), serveIndex(config.testdata_path, { icons: true }));

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}.`);
});

init(5).catch((err) => {
    console.error(err);
});
