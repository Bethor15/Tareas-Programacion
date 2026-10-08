import "dotenv/config";
import { createPool } from "mysql2/promise";

const env = process.env;

// Pool de conexiones reutilizable para toda la API
export const db = createPool({
  host: env.DB_HOST ?? "localhost",
  port: Number(env.DB_PORT ?? 3306),
  user: env.DB_USER ?? "root",
  password: env.DB_PASSWORD ?? "",
  database: env.DB_NAME ?? "inventario_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});
