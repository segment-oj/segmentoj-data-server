import fs = require('fs');
import { use_default_config } from './utilities';

export interface Config {
    port: number,
};

export function fetch_config(): Config {
    const config_path = process.env.cfg || './data-server.config.json';
    const content = fs.readFileSync(config_path);
    let config = JSON.parse(content.toString());

    return use_default_config(config, {
        port: 3000,
    });
}