
import { promises as fs } from "fs";

export async function find_data(base_path: string, id: number) {
    try {
        await fs.access(`${base_path}/${id}.zip`);
        return true;
    } catch (err) {
        return false;
    }
};
