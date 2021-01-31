import fs = require('fs');
import { use_default_config } from './utilities';

export interface Config {
    port: number,
    testdata_path: string,
};

export function fetch_config(): Config {
    const default_config: Config = {
        port: 3000,
        testdata_path: './data',
    };

    const config_path = process.env.cfg || './data-server.config.json';

    if (!fs.existsSync(config_path)) { return default_config; }
    const content = fs.readFileSync(config_path);
    let config = JSON.parse(content.toString());

    return use_default_config(config, default_config);
}