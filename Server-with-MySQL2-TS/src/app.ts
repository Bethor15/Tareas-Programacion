import "dotenv/config";
import { ApiServer } from "./server.js";
import apiRouter from "./routes/index.js";

const PORT = Number(process.env.PORT ?? 4000);

const app = new ApiServer({ port: PORT, router: apiRouter });
app.listen();
