import { defaults } from '../config.js';
import { WORDS } from './nodes.js';

/* ─── Connections ──────────────────────────── */

export const CONNECTIONS = [
  { from: 'system', to: 'archaeology', central: true },
  { from: 'system', to: 'architecture', central: true },
  { from: 'archaeology', to: 'narrative' },
  { from: 'archaeology', to: 'research' },
  { from: 'archaeology', to: 'context' },
  { from: 'archaeology', to: 'community' },
  { from: 'archaeology', to: 'user' },
  { from: 'archaeology', to: 'information' },
  { from: 'architecture', to: 'information' },
  { from: 'architecture', to: 'flow' },
  { from: 'architecture', to: 'interface' },
  { from: 'architecture', to: 'quality' },
  { from: 'architecture', to: 'design' },
  { from: 'information', to: 'research' },
  { from: 'information', to: 'context' },
  { from: 'information', to: 'user' },
  { from: 'information', to: 'interface' },
  { from: 'flow', to: 'user' },
  { from: 'flow', to: 'quality' },
  { from: 'flow', to: 'experience' },
  { from: 'flow', to: 'interface' },
  { from: 'flow', to: 'design' },
  { from: 'community', to: 'narrative' },
  { from: 'community', to: 'context' },
  { from: 'community', to: 'user' },
  { from: 'narrative', to: 'context' },
  { from: 'experience', to: 'design' },
  { from: 'quality', to: 'experience' },
  { from: 'design', to: 'accessibility' },
  { from: 'design', to: 'interface' },
  { from: 'interface', to: 'user' },
  { from: 'interface', to: 'narrative' },
  { from: 'experience', to: 'user' },
  { from: 'experience', to: 'context' },
  { from: 'research', to: 'user' },
  { from: 'research', to: 'experience' },
  { from: 'research', to: 'context' },
  { from: 'experience', to: 'narrative' },
  { from: 'accessibility', to: 'user' },
  { from: 'accessibility', to: 'context' },
  { from: 'accessibility', to: 'information' },
  { from: 'accessibility', to: 'interface' },
  { from: 'accessibility', to: 'experience' },
  { from: 'accessibility', to: 'quality' },
  { from: 'accessibility', to: 'community' },
];

/* ─── Connection strength ─────────────────── */

export function getConnectionStrength(from, to) {
  const structural = new Set(defaults.connectionStrength.structural);
  const articulating = new Set(defaults.connectionStrength.articulating);
  if (structural.has(from) || structural.has(to)) return 1.0;
  if (articulating.has(from) || articulating.has(to)) return 0.8;
  return 0.6;
}

/* ─── Edge styles ─────────────────────────── */

export const edgeStyles = defaults.edges;

/* ─── Node connections (adjacency list) ──── */

export const nodeConnections = {};
WORDS.forEach(w => { nodeConnections[w.id] = []; });
CONNECTIONS.forEach(conn => {
  conn.strength = getConnectionStrength(conn.from, conn.to);
  nodeConnections[conn.from].push({ target: conn.to, strength: conn.strength });
  nodeConnections[conn.to].push({ target: conn.from, strength: conn.strength });
});
