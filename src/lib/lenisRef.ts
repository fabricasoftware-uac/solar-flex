import type Lenis from "lenis";

/**
 * Referencia compartida a la instancia de Lenis para que componentes
 * como IntroGate o BackToTop puedan detener, resetear o dirigir el
 * scroll suave sin acoplarse al hook.
 */
export const lenisRef: { current: Lenis | null } = { current: null };
