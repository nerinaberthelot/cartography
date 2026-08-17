import { CONNECTIONS, generateNoise, edgeStyles } from './data/index.js';
import { getActiveState, getIsMobile, getTargetPos } from './state.js';
import {
  borderResistance, getHoveredNode, isConnectedToHovered, getConnectionStrengthBetween,
} from './interaction.js';

/* ─── Build DOM ──────────────────────────── */

export function buildDOM(container, words, cfg) {
  const noiseData = generateNoise();
  const noiseEl = document.createElement('div');
  noiseEl.className = 'noise-overlay';
  noiseEl.style.cssText = `background-image: url(${noiseData});`;
  container.appendChild(noiseEl);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('id', 'connections');
  svg.setAttribute('aria-hidden', 'true');
  container.appendChild(svg);

  const nodeMap = new Map();

  words.forEach(w => {
    const wrapper = document.createElement('span');
    wrapper.className = 'node-wrapper';
    wrapper.style.setProperty('--x', w.displayX + '%');
    wrapper.style.setProperty('--y', w.displayY + '%');

    const inner = document.createElement('span');
    inner.className = 'node';
    inner.dataset.word = w.id;
    inner.textContent = w.text;
    inner.style.fontSize = w.fontSize;
    inner.style.fontWeight = w.fontWeight;
    inner.style.letterSpacing = w.letterSpacing;
    inner.style.color = w.color;

    wrapper.appendChild(inner);
    container.appendChild(wrapper);
    nodeMap.set(w.id, { wrapper, inner, data: w });
  });

  const lineEls = [];

  CONNECTIONS.forEach(conn => {
    const fromLayer = words.find(w => w.id === conn.from)?.layer ?? 4;
    const toLayer = words.find(w => w.id === conn.to)?.layer ?? 4;
    const l = Math.min(fromLayer, toLayer);
    const style = edgeStyles[l] || edgeStyles[4];
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('stroke-width', String(style.sw));
    line.setAttribute('opacity', String(style.op));
    svg.appendChild(line);
    lineEls.push({
      line, from: conn.from, to: conn.to,
      strength: conn.strength, baseOp: style.op, central: !!conn.central,
    });
  });

  return { nodeMap, lineEls, noiseEl, svg };
}

/* ─── Update SVG lines ───────────────────── */

function updateLines(nodeMap, lineEls, container) {
  const containerRect = container.getBoundingClientRect();
  const cx = containerRect.left;
  const cy = containerRect.top;
  const len = lineEls.length;
  for (let i = 0; i < len; i++) {
    const { line, from, to } = lineEls[i];
    const f = nodeMap.get(from);
    const t = nodeMap.get(to);
    if (!f || !t) continue;

    const fr = f.wrapper.getBoundingClientRect();
    const tr = t.wrapper.getBoundingClientRect();

    line.setAttribute('x1', (fr.left + fr.width / 2 - cx).toFixed(1));
    line.setAttribute('y1', (fr.top + fr.height / 2 - cy).toFixed(1));
    line.setAttribute('x2', (tr.left + tr.width / 2 - cx).toFixed(1));
    line.setAttribute('y2', (tr.top + tr.height / 2 - cy).toFixed(1));
  }
}

/* ─── Animation loop ─────────────────────── */

let frameId = null;

function animate(timestamp, nodeMap, lineEls, words, cfg, container) {
  const t = timestamp / 1000;
  const dt = 1 / 60;
  const activeState = getActiveState();
  const isMobile = getIsMobile();
  const lerpSpeed = cfg.animation.lerpSpeed;
  const floatScale = activeState ? cfg.animation.floatScaleActive : cfg.animation.floatScaleNeutral;
  const hoveredNode = getHoveredNode();
  const vw = container.clientWidth;
  const vh = container.clientHeight;

  for (const w of words) {
    const entry = nodeMap.get(w.id);
    const target = getTargetPos(w);

    if (w.dragState === 'dragging') {
      w.displayX = target.x + (w.dragOffset.x / vw) * 100;
      w.displayY = target.y + (w.dragOffset.y / vh) * 100;
      entry.wrapper.style.setProperty('--x', w.displayX + '%');
      entry.wrapper.style.setProperty('--y', w.displayY + '%');
      entry.wrapper.style.setProperty('--dx', '0px');
      entry.wrapper.style.setProperty('--dy', '0px');
    } else {
      w.displayX += (target.x - w.displayX) * lerpSpeed;
      w.displayY += (target.y - w.displayY) * lerpSpeed;

      if (w.dragState === 'floating') {
        const screenX = ((target.x + (w.dragOffset.x / vw) * 100) / 100) * vw;
        const screenY = ((target.y + (w.dragOffset.y / vh) * 100) / 100) * vh;
        const br = borderResistance(screenX, screenY);
        w.velocity.x *= br;
        w.velocity.y *= br;
        w.dragOffset.x += w.velocity.x * dt * 60;
        w.dragOffset.y += w.velocity.y * dt * 60;
        w.velocity.x *= cfg.drag.friction;
        w.velocity.y *= cfg.drag.friction;
        w.dragOffset.x += Math.sin(t * cfg.drag.floatSpeed + w.floatPhase) * cfg.drag.floatAmplitude * 0.1;
        w.dragOffset.y += Math.cos(t * cfg.drag.floatSpeed * 0.7 + w.floatPhase) * cfg.drag.floatAmplitude * 0.1;
        const postScreenX = ((target.x + (w.dragOffset.x / vw) * 100) / 100) * vw;
        const postScreenY = ((target.y + (w.dragOffset.y / vh) * 100) / 100) * vh;
        const brPost = borderResistance(postScreenX, postScreenY);
        if (brPost < 1) {
          w.dragOffset.x *= brPost;
          w.dragOffset.y *= brPost;
          w.velocity.x *= brPost;
          w.velocity.y *= brPost;
        }
        w.floatTimer += dt;
        const offMag = Math.sqrt(w.dragOffset.x ** 2 + w.dragOffset.y ** 2);
        const velMag = Math.sqrt(w.velocity.x ** 2 + w.velocity.y ** 2);
        if (offMag < 0.5 && velMag < 0.1 && w.floatTimer > 1.0) {
          w.dragState = 'returning';
          w.velocity.x = 0;
          w.velocity.y = 0;
        }
      } else if (w.dragState === 'returning') {
        w.velocity.x += (0 - w.dragOffset.x) * cfg.drag.returnAccel;
        w.velocity.y += (0 - w.dragOffset.y) * cfg.drag.returnAccel;
        w.velocity.x *= (1 - cfg.drag.returnDamping);
        w.velocity.y *= (1 - cfg.drag.returnDamping);
        w.dragOffset.x += w.velocity.x;
        w.dragOffset.y += w.velocity.y;
        if (Math.abs(w.dragOffset.x) < cfg.drag.returnSnap && Math.abs(w.dragOffset.y) < cfg.drag.returnSnap &&
            Math.abs(w.velocity.x) < 0.05 && Math.abs(w.velocity.y) < 0.05) {
          w.dragState = 'resting';
          w.dragOffset.x = 0;
          w.dragOffset.y = 0;
          w.velocity.x = 0;
          w.velocity.y = 0;
        }
      }

      const f = w.float;
      const dx = floatScale * f.ax * Math.sin(t * f.fx + f.px);
      const dy = floatScale * f.ay * Math.sin(t * f.fy + f.py);

      const offX = (w.dragOffset.x / vw) * 100;
      const offY = (w.dragOffset.y / vh) * 100;

      entry.wrapper.style.setProperty('--x', (w.displayX + offX) + '%');
      entry.wrapper.style.setProperty('--y', (w.displayY + offY) + '%');
      entry.wrapper.style.setProperty('--dx', dx + 'px');
      entry.wrapper.style.setProperty('--dy', dy + 'px');
    }

    let opacity;
    if (isMobile) {
      if (w.layer <= 2) {
        opacity = 0.85 + 0.10 * Math.sin(t * 0.3 + w.opacityPhase);
      } else {
        const s = 0.5 + 0.5 * Math.sin(t * 0.06 + w.opacityPhase * 3);
        opacity = 0.12 + 0.48 * s;
      }
    } else if (hoveredNode && !activeState) {
      if (w.id === hoveredNode) {
        opacity = 1;
      } else if (isConnectedToHovered(w.id)) {
        const s = getConnectionStrengthBetween(w.id, hoveredNode);
        const base = w.opacityBase + w.opacityAmp * Math.sin(t * w.opacityFreq + w.opacityPhase);
        opacity = Math.min(1, base * (1 + 0.35 * s));
      } else {
        opacity = w.opacityBase * 0.25;
      }
    } else {
      opacity = w.opacityBase + w.opacityAmp * Math.sin(t * w.opacityFreq + w.opacityPhase);
    }
    entry.inner.style.opacity = Math.max(0.02, Math.min(1, opacity));
  }

  {
    const len = lineEls.length;
    const isHovering = hoveredNode && !activeState;
    for (let i = 0; i < len; i++) {
      const { line, from, to, strength, baseOp } = lineEls[i];
      if (isHovering) {
        const connected = from === hoveredNode || to === hoveredNode;
        line.setAttribute('opacity', String(connected ? Math.min(0.9, baseOp + 0.35 * strength) : baseOp * 0.2));
      } else {
        line.setAttribute('opacity', String(baseOp));
      }
    }
  }

  updateLines(nodeMap, lineEls, container);
  frameId = requestAnimationFrame(ts => animate(ts, nodeMap, lineEls, words, cfg, container));
}

/* ─── Start / Stop ──────────────────────── */

export function startAnimation(nodeMap, lineEls, words, cfg, container) {
  frameId = requestAnimationFrame(ts => animate(ts, nodeMap, lineEls, words, cfg, container));
}

export function stopAnimation() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}
