import fs = require('fs');
import path = require('path');
import diskusage = require('diskusage');

export function use_default_config(a, d) {
    for (let i in d) {
        if (a[i] === undefined) { a[i] = d[i]; }
    }
    return a;
};

export async function calc_size(target: string) {
    let size = 0;
    const dir = await fs.promises.opendir(target);
    for await (const dirent of dir) {
        if (path.extname(dirent.name) == '.zip') {
            size += fs.statSync(`${target}/${dirent.name}`).size;
        }
    }
    return Math.ceil(size / (1024 * 1024));
};

export async function get_disk_capacity(path: string) {
    try {
        const { available } = await diskusage.check(path);
        return Math.ceil(available / (1024 * 1024)) - 5000;
    } catch (err) {
        console.error(err);
        return 0;
    }
}