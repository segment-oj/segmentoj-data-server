import { Config, fetch_config } from './config';
import serveIndex from 'serve-index';
import express from 'express';

const config = fetch_config();

const app = express();
app.use(express.static(config.testdata_path), serveIndex(config.testdata_path, { icons: true }));

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}`);
});