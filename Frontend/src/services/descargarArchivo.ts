import { fetchConAuth } from "./BaseService";

export async function descargarArchivo(url: string, nombreArchivo: string): Promise<void> {
  const response = await fetchConAuth(url);
  if (!response.ok) {
    throw new Error("No se pudo descargar el archivo");
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
