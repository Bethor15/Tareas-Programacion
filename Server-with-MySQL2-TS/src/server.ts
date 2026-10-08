import express, { type Express, type Router } from "express";

interface ApiServerConfig {
  port: number;
  router: Router;
  prefix?: string;
}

export class ApiServer {
  private readonly app: Express;
  private readonly port: number;
  private readonly prefix: string;

  constructor({ port, router, prefix = "/api/v1" }: ApiServerConfig) {
    this.app = express();
    this.port = port;
    this.prefix = prefix;

    this.loadMiddlewares();
    this.app.use(this.prefix, router);
    this.loadNotFound();
  }

  private loadMiddlewares(): void {
    // Permite leer JSON en req.body
    this.app.use(express.json());
  }

  private loadNotFound(): void {
    // Cualquier ruta que no exista responde 404
    this.app.use((req, res) => {
      res.status(404).json({ ok: false, message: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`API lista en http://localhost:${this.port}${this.prefix}`);
    });
  }
}
