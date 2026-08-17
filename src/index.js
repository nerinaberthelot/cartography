import { defaults } from './config.js';
import { WORDS, loadLayout, generateNoise } from './data/index.js';
import { buildDOM, startAnimation, stopAnimation } from './visual.js';
import { initInteraction, destroyInteraction } from './interaction.js';
import { initState, destroyState } from './state.js';

export function createCartography({ container, config } = {}) {
  const cfg = { ...defaults, ...config };

  loadLayout();
  initState(container);

  const { nodeMap, lineEls } = buildDOM(container, WORDS, cfg);
  initInteraction(nodeMap, WORDS, cfg, container);
  startAnimation(nodeMap, lineEls, WORDS, cfg, container);

  return {
    nodeMap,
    lineEls,
    words: WORDS,
    config: cfg,
    destroy() {
      stopAnimation();
      destroyInteraction();
      destroyState();
    },
  };
}

export { defaults } from './config.js';
export { WORDS, CONNECTIONS, STATE_NODES } from './data/index.js';
