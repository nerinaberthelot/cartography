/* ─── Navigation state ────────────────────── */

let activeState = null;
let isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
let resizeObserver = null;

export function initState(container) {
  if (resizeObserver) return;

  if (container && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        isMobile = entry.contentRect.width <= 768;
      }
    });
    resizeObserver.observe(container);
    isMobile = container.clientWidth <= 768;
  } else if (typeof window !== 'undefined') {
    isMobile = window.innerWidth <= 768;
    const onResize = () => { isMobile = window.innerWidth <= 768; };
    window.addEventListener('resize', onResize);
    resizeObserver = { disconnect() { window.removeEventListener('resize', onResize); } };
  }
}

export function destroyState() {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  activeState = null;
}

export function getActiveState() {
  return activeState;
}

export function setActiveState(state) {
  activeState = state;
}

export function toggleState(state) {
  if (activeState === state) {
    activeState = null;
  } else {
    activeState = state;
  }
}

export function getIsMobile() {
  return isMobile;
}

/* ─── Target position by state ───────────── */

export function getTargetPos(w) {
  if (activeState === 'archaeology') return w.posAr;
  if (activeState === 'architecture') return w.posArc;
  if (activeState === 'experience') return w.posExp;
  if (activeState === 'accessibility') return w.posAcc;
  if (activeState === 'information') return w.posInf;
  return w.pos;
}
