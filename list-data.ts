import fs = require('fs');

export function find_data(base_path: string, id: number): boolean {
    return fs.existsSync(`${base_path}/${id}.zip`);
};
