// Re-export for backwards compatibility. The hero playback path is now
// unified between desktop and mobile, so the canonical home for these
// utilities is `useHeroReveal.ts`. This shim avoids breaking any consumer
// that still imports from the old path.
export { setHeroRevealed as setMobileHeroRevealed, useHeroRevealed as useMobileHeroRevealed } from './useHeroReveal';
