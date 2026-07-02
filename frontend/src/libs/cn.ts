type ClassValue = string | number | boolean | null | undefined | ClassValue[];

function resolveClassValue(value: ClassValue): string {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value))
    return value.map(resolveClassValue).filter(Boolean).join(" ");
  return "";
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(resolveClassValue).filter(Boolean).join(" ");
}
