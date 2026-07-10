/**
 * Velo monocromo de marca. Colocado sobre una imagen (contenedor
 * relative + isolate + overflow-hidden + clase "light-parent"),
 * la desatura por completo via mix-blend-saturation. Al pasar el
 * mouse por el contenedor, el velo se disuelve y la imagen recupera
 * TODO su color; al salir, vuelve al blanco y negro. En touch no hay
 * hover: monocromo puro. Reglas CSS en styles/index.css.
 */
export function LightMask() {
  return (
    <div
      aria-hidden="true"
      className="light-veil pointer-events-none absolute inset-0 mix-blend-saturation"
    />
  );
}
