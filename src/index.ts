import express from 'express';
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { Request, Response } from 'express';

dotenv.config();

const client = new Client({
    host: process.env.POSTGRES_URL,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

client.connect();

const app = express();
const port = 3000;
const db = drizzle(client);

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    try {
        const x = await db.select() ///... To be continued
        res.json();
    } catch (err) {
        console.error(err);
        res.status
    }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});





