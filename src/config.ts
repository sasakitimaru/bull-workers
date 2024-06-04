import dotenv from "dotenv";
dotenv.config();

export const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
};
