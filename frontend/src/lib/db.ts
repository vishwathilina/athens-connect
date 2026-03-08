import { neon } from "@neondatabase/serverless";

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error("VITE_DATABASE_URL is not defined in environment variables");
}

export const sql = neon(connectionString);
