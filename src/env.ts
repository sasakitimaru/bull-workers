import dotenv from "dotenv";
dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT!);
