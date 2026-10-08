// Convierte el parámetro :id a número; regresa null si no es un entero positivo
export function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// El precio debe ser número y mayor a 0
export function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// Revisa que vengan los campos obligatorios del producto
export function missingFields(body: Record<string, unknown>, fields: string[]): string[] {
  return fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === "");
}
