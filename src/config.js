/* ─── Default configuration ──────────────── */

export const defaults = {
  anchor: { x: 52.61, y: 41.82 },

  drag: {
    threshold: 4,
    friction: 0.94,
    returnSnap: 0.15,
    returnAccel: 0.03,
    returnDamping: 0.065,
    floatAmplitude: 2.0,
    floatSpeed: 0.4,
    impulseFactor: 0.3,
  },

  border: {
    zone: 0.15,
    maxVelocityPct: 0.04,
  },

  animation: {
    lerpSpeed: 0.015,
    floatScaleActive: 0.3,
    floatScaleNeutral: 1.0,
  },

  typography: {
    1: { fontSize: 'clamp(1.6rem, 2.4vw, 2.8rem)', fontWeight: 600, letterSpacing: '0.08em' },
    2: { fontSize: 'clamp(1.3rem, 1.6vw, 1.8rem)', fontWeight: 500, letterSpacing: '0.06em' },
    3: { fontSize: 'clamp(1.1rem, 1.3vw, 1.5rem)', fontWeight: 450, letterSpacing: '0.05em' },
    4: { fontSize: 'clamp(0.95rem, 1.0vw, 1.3rem)', fontWeight: 400, letterSpacing: '0.04em' },
  },

  opacity: {
    base: { 1: 1.0, 2: 0.90, 3: 0.75, 4: 0.55 },
    amp: { 1: 0.0, 2: 0.04, 3: 0.06, 4: 0.08 },
  },

  edges: {
    1: { sw: 1.6, op: 0.45 },
    2: { sw: 1.2, op: 0.32 },
    3: { sw: 1.0, op: 0.24 },
    4: { sw: 0.8, op: 0.16 },
  },

  connectionStrength: {
    structural: ['system', 'archaeology', 'architecture'],
    articulating: ['information', 'experience', 'accessibility'],
  },
};
