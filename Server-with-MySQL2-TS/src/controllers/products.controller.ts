import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../conf/dbConnection.js";
import { isValidPrice, missingFields, parseId } from "../utils/validators.js";

const REQUIRED = ["name", "price", "stock", "description"];

function serverError(res: Response, error: unknown): void {
  console.error("[products]", error);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
}

export class ProductsController {
  // GET /products/getAll -> solo productos activos
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const [products] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE active = TRUE ORDER BY id"
      );
      res.json({ ok: true, total: products.length, data: products });
    } catch (error) {
      serverError(res, error);
    }
  }

  // GET /products/getById/:id
  async getById(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ ok: false, message: "El id debe ser un número entero positivo" });
      return;
    }

    try {
      const [rows] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ? AND active = TRUE",
        [id]
      );
      if (!rows.length) {
        res.status(404).json({ ok: false, message: `No existe un producto activo con id ${id}` });
        return;
      }
      res.json({ ok: true, data: rows[0] });
    } catch (error) {
      serverError(res, error);
    }
  }

  // POST /products/create
  async create(req: Request, res: Response): Promise<void> {
    const body = req.body ?? {};
    const faltantes = missingFields(body, REQUIRED);
    if (faltantes.length) {
      res.status(400).json({ ok: false, message: `Faltan campos: ${faltantes.join(", ")}` });
      return;
    }
    if (!isValidPrice(body.price)) {
      res.status(400).json({ ok: false, message: "El precio debe ser un número mayor a 0" });
      return;
    }

    try {
      const { name, price, stock, description, brand, img } = body;
      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO products (name, price, stock, description, brand, img)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, price, stock, description, brand ?? null, img ?? null]
      );
      res.status(201).json({ ok: true, message: "Producto registrado", id: result.insertId });
    } catch (error) {
      serverError(res, error);
    }
  }

  // PUT /products/update/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const body = req.body ?? {};

    if (id === null) {
      res.status(400).json({ ok: false, message: "Id inválido" });
      return;
    }
    const faltantes = missingFields(body, REQUIRED);
    if (faltantes.length) {
      res.status(400).json({ ok: false, message: `Faltan campos: ${faltantes.join(", ")}` });
      return;
    }
    if (!isValidPrice(body.price)) {
      res.status(400).json({ ok: false, message: "El precio debe ser un número mayor a 0" });
      return;
    }

    try {
      const { name, price, stock, description, brand, img } = body;
      const [result] = await db.execute<ResultSetHeader>(
        `UPDATE products
         SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ?
         WHERE id = ? AND active = TRUE`,
        [name, price, stock, description, brand ?? null, img ?? null, id]
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ ok: false, message: `No existe un producto activo con id ${id}` });
        return;
      }
      res.json({ ok: true, message: "Producto actualizado" });
    } catch (error) {
      serverError(res, error);
    }
  }

  // DELETE /products/delete/:id -> baja lógica (active = FALSE)
  async remove(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ ok: false, message: "Id inválido" });
      return;
    }

    try {
      const [result] = await db.execute<ResultSetHeader>(
        "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE",
        [id]
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ ok: false, message: "El producto no existe o ya estaba dado de baja" });
        return;
      }
      res.json({ ok: true, message: "Producto dado de baja" });
    } catch (error) {
      serverError(res, error);
    }
  }

  // PATCH /products/change-price/:id
  async changePrice(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const { price } = req.body ?? {};

    if (id === null) {
      res.status(400).json({ ok: false, message: "Id inválido" });
      return;
    }
    if (!isValidPrice(price)) {
      res.status(400).json({ ok: false, message: "El precio debe ser un número mayor a 0" });
      return;
    }

    try {
      const [result] = await db.execute<ResultSetHeader>(
        "UPDATE products SET price = ? WHERE id = ? AND active = TRUE",
        [price, id]
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ ok: false, message: `No existe un producto activo con id ${id}` });
        return;
      }
      res.json({ ok: true, message: "Precio actualizado", price });
    } catch (error) {
      serverError(res, error);
    }
  }
}
