import { Config, fetch_config } from './config';
import serveIndex from 'serve-index';
import express from 'express';
import { find_data } from './list-data';

const config = fetch_config();

const app = express();

app.get('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).end();
        return;
    }
    
    res.type('application/json').send(JSON.stringify({ res: find_data(config.testdata_path, id) })).end();
});

app.use(express.static(config.testdata_path), serveIndex(config.testdata_path, { icons: true }));

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}`);
});
