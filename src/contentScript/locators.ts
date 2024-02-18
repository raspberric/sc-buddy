export function isOnSc(origin: string): boolean {
  return origin.includes('soundcloud');
}

export function isOnHypeddit(origin: string): boolean {
  return origin.includes('hypeddit');
}

export function isOnSecureSc(origin: string): boolean {
  return origin.includes('secure.soundcloud');
}
