import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = "postgres://postgres:postgres@localhost:5432/expo_app";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
