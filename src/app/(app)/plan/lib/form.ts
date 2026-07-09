/** Parsing compartido de los formularios de los sheets (inputs de texto). */

export function toInt(raw: FormDataEntryValue | null): number | null {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.round(n);
}

export function toDecimal(raw: FormDataEntryValue | null): number | null {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function toText(raw: FormDataEntryValue | null): string | null {
  const trimmed = String(raw ?? "").trim();
  return trimmed || null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "titulo-requerido": "El título es obligatorio.",
  "plan-activo": "Ya tienes un plan activo.",
  "label-requerido": "El nombre es obligatorio.",
  "tiene-historial":
    "No se puede eliminar: tiene comidas registradas en tu historial.",
  "componente-requerido": "Agrega al menos un componente.",
};

export function errorMessage(code: string): string {
  return (
    ERROR_MESSAGES[code] ??
    "Hubo un error al guardar. Revisa los datos e intenta de nuevo."
  );
}
