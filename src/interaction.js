import { isStateNode, nodeConnections } from './data/index.js';
import { getActiveState, setActiveState, toggleState, getTargetPos } from './state.js';

/* ─── Hover state ─────────────────────────── */

let hoveredNode = null;

export function getHoveredNode() {
  return hoveredNode;
}

export function isConnectedToHovered(nodeId) {
  if (!hoveredNode) return false;
  return nodeConnections[nodeId].some(c => c.target === hoveredNode);
}

export function getConnectionStrengthBetween(a, b) {
  const c = nodeConnections[a].find(c => c.target === b);
  return c ? c.strength : 0;
}

/* ─── Drag state ─────────────────────────── */

let nodeMapRef = null;
let wordsRef = null;
let cfgRef = null;
let containerRef = null;
let dragNodeId = null;
let pointerStartX = 0;
let pointerStartY = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let dragMoved = false;
let dragActive = false;

function getContainerWidth() {
  return containerRef ? containerRef.clientWidth : window.innerWidth;
}

function getContainerHeight() {
  return containerRef ? containerRef.clientHeight : window.innerHeight;
}

function borderResistance(pxX, pxY) {
  const vw = getContainerWidth();
  const vh = getContainerHeight();
  const bzX = vw * cfgRef.border.zone;
  const bzY = vh * cfgRef.border.zone;
  let m = 1.0;
  if (pxX < bzX) m = Math.min(m, pxX / bzX);
  else if (pxX > vw - bzX) m = Math.min(m, (vw - pxX) / bzX);
  if (pxY < bzY) m = Math.min(m, pxY / bzY);
  else if (pxY > vh - bzY) m = Math.min(m, (vh - pxY) / bzY);
  return Math.max(0, m);
}

export { borderResistance };

function onNodePointerDown(e) {
  const id = e.currentTarget.dataset.word;
  if (!id) return;

  dragNodeId = id;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
  dragMoved = false;
  dragActive = false;

  document.addEventListener('pointermove', onDocPointerMove);
  document.addEventListener('pointerup', onDocPointerUp);
}

function onDocPointerMove(e) {
  if (!dragNodeId) return;

  const dx = e.clientX - pointerStartX;
  const dy = e.clientY - pointerStartY;

  if (!dragMoved && (Math.abs(dx) > cfgRef.drag.threshold || Math.abs(dy) > cfgRef.drag.threshold)) {
    dragMoved = true;
    dragActive = true;
    const w = wordsRef.find(w => w.id === dragNodeId);
    if (w) w.dragState = 'dragging';
    if (containerRef) containerRef.style.cursor = 'grabbing';
    else document.body.style.cursor = 'grabbing';
  }

  if (dragActive) {
    const w = wordsRef.find(w => w.id === dragNodeId);
    if (w) {
      const entry = nodeMapRef.get(w.id);
      const rect = entry.wrapper.getBoundingClientRect();
      const targetScreenX = rect.left + rect.width / 2 - w.dragOffset.x;
      const targetScreenY = rect.top + rect.height / 2 - w.dragOffset.y;
      w.dragOffset.x = e.clientX - targetScreenX;
      w.dragOffset.y = e.clientY - targetScreenY;
      w.velocity.x = e.clientX - lastPointerX;
      w.velocity.y = e.clientY - lastPointerY;
    }
  }

  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
}

function onDocPointerUp() {
  document.removeEventListener('pointermove', onDocPointerMove);
  document.removeEventListener('pointerup', onDocPointerUp);
  if (containerRef) containerRef.style.cursor = '';
  else document.body.style.cursor = '';

  if (!dragNodeId) return;

  const w = wordsRef.find(w => w.id === dragNodeId);

  if (!dragMoved) {
    if (dragNodeId === 'system') {
      setActiveState(null);
    } else if (isStateNode(dragNodeId)) {
      toggleState(dragNodeId);
    }
  } else if (w) {
    w.velocity.x *= cfgRef.drag.impulseFactor;
    w.velocity.y *= cfgRef.drag.impulseFactor;
    const maxVel = Math.min(getContainerWidth(), getContainerHeight()) * cfgRef.border.maxVelocityPct;
    const speed = Math.sqrt(w.velocity.x ** 2 + w.velocity.y ** 2);
    if (speed > maxVel) {
      const scale = maxVel / speed;
      w.velocity.x *= scale;
      w.velocity.y *= scale;
    }
    const finalSpeed = Math.sqrt(w.velocity.x ** 2 + w.velocity.y ** 2);
    if (finalSpeed > 0.5) {
      w.dragState = 'floating';
      w.floatTimer = 0;
    } else {
      w.dragState = 'returning';
      w.velocity.x = 0;
      w.velocity.y = 0;
    }
  }

  dragNodeId = null;
  dragActive = false;
}

/* ─── Background click ───────────────────── */

function onBgPointerDown(e) {
  if (!e.target.closest('.node-wrapper') && getActiveState()) {
    setActiveState(null);
  }
}

/* ─── Init ───────────────────────────────── */

export function initInteraction(nodeMap, words, cfg, container) {
  nodeMapRef = nodeMap;
  wordsRef = words;
  cfgRef = cfg;
  containerRef = container;

  nodeMap.forEach((entry, id) => {
    const el = entry.wrapper;
    el.dataset.word = id;
    el.addEventListener('pointerdown', onNodePointerDown);
  });

  container.addEventListener('pointerdown', onBgPointerDown);

  nodeMap.forEach((entry, id) => {
    const el = entry.wrapper;
    el.addEventListener('mouseenter', () => { hoveredNode = id; });
    el.addEventListener('mouseleave', () => { hoveredNode = null; });
  });

  container.addEventListener('mouseleave', () => { hoveredNode = null; });
}

export function destroyInteraction() {
  document.removeEventListener('pointermove', onDocPointerMove);
  document.removeEventListener('pointerup', onDocPointerUp);
  if (containerRef) containerRef.style.cursor = '';
  hoveredNode = null;
  dragNodeId = null;
  dragActive = false;
  nodeMapRef = null;
  wordsRef = null;
  cfgRef = null;
  containerRef = null;
}
