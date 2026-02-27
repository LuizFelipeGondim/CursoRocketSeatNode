import knex from "knex";
import type { Knex } from "knex"; //Separacao para evitar erros em runtime
import { env } from "./env/index.js";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};

export const db = knex(config);