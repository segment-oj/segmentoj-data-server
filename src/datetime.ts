import { promises as fs } from "fs";

let database_content: Array<string> = null;
let database_source: string = '';

export function set_database_path(p: string) {
    database_source = p;
}

async function read_database() {
    try {
        database_content = JSON.parse((await fs.readFile(database_source)).toString());
    } catch (err) {
        database_content = new Array();
        await write_database();
    }
}

function write_database() {
    return fs.writeFile(database_source, JSON.stringify(database_content));
}

export async function read_datetime(pid: number): Promise<Date> {
    if (database_content == null) {
        await read_database();
    }

    return new Date(database_content[pid.toString()]);
};

export async function write_datetime(pid: number, time: Date) {
    if (database_content == null) {
        await read_database();
    }

    database_content[pid.toString()] = time.toString();
    await write_database();
};