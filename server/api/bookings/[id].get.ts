import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'pathe';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') as string);

    //Check for valid booking
    const filePath = join(process.cwd(), 'assets', 'json', `${id}.json`);
    if(!existsSync(filePath)) {
        throw createError({statusCode: 404, statusMessage: "Booking not found"})
    }

    //Return the data
    const data = await readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    return json;
})