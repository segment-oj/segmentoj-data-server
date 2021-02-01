import { fetch_config } from './config';
import serveIndex from 'serve-index';
import express from 'express';
import { find_data } from './list-data';
import { calc_size, get_disk_capacity } from './utilities';

const config = fetch_config();

const app = express();

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

app.use(express.static(config.testdata_path), serveIndex(config.testdata_path, { icons: true }));

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}`);
});
