function uuidv4() {
  // Usamos la API Web Crypto disponible en navegadores
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Ajustes para formato RFC 4122 versión 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Versión 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variante

  // Convertimos a string con guiones
  const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
  return (
    hex.slice(0, 8) + "-" +
    hex.slice(8, 12) + "-" +
    hex.slice(12, 16) + "-" +
    hex.slice(16, 20) + "-" +
    hex.slice(20)
  );
}