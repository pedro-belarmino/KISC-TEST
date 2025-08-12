import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'pathe';

export default defineEventHandler(async (event) => {
    const filePath = join(process.cwd(), 'assets', 'json', `codes.json`);
    if (!existsSync(filePath)) {
        throw createError({ statusCode: 404, statusMessage: "Codes not found" })
    }

    const data = await readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    return json;
})