import { defaults } from '../config.js';

/* ─── Helpers ─────────────────────────────── */

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) + h) + str.charCodeAt(i);
  return Math.abs(h);
}

/* ─── Noise texture generator ────────────── */

export function generateNoise() {
  const size = 256;
  const cell = 16;
  const cells = size / cell;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grid = [];
  for (let y = 0; y < cells; y++) {
    grid[y] = [];
    for (let x = 0; x < cells; x++)
      grid[y][x] = Math.random();
  }

  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = x / cell;
      const gy = y / cell;
      const ix = Math.floor(gx);
      const iy = Math.floor(gy);
      const fx = gx - ix;
      const fy = gy - iy;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);

      const v =
        grid[iy][ix] * (1 - sx) * (1 - sy) +
        grid[iy][(ix + 1) % cells] * sx * (1 - sy) +
        grid[(iy + 1) % cells][ix] * (1 - sx) * sy +
        grid[(iy + 1) % cells][(ix + 1) % cells] * sx * sy;

      const cv = Math.floor(v * 255);
      const idx = (y * size + x) * 4;
      d[idx] = d[idx + 1] = d[idx + 2] = cv;
      d[idx + 3] = 10;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

/* ─── Node data ──────────────────────────── */

export const WORDS = [
  {
    id: 'system', text: 'System',
    priority: 'central', perspective: null,
    layer: 1,
    pos: { x: 52.61, y: 41.82 },
    posAr: { x: 73.37138931338259, y: 51.780186145310806 },
    posArc: { x: 29.403314722292587, y: 48.249398344292306 },
    posExp: { x: 53.00230410523992, y: 12.620582654046905 },
    posInf: { x: 52.731618614037164, y: 74.62240470571787 },
    posAcc: { x: 52.030890648494696, y: 11.573094091849836 },
  },
  {
    id: 'archaeology', text: 'Archaeology',
    priority: 'core', perspective: 'archaeology',
    layer: 2,
    pos: { x: 32.53246140994786, y: 47.86616442367984 },
    posAr: { x: 52.61, y: 41.82 },
    posArc: { x: 19.37220913811208, y: 52.16881856591479 },
    posExp: { x: 14.488035158293015, y: 42.14706105528063 },
    posInf: { x: 27.72120401166971, y: 49.96020980206073 },
    posAcc: { x: 31.401912829028016, y: 67.51833287965191 },
  },
  {
    id: 'architecture', text: 'Architecture',
    priority: 'core', perspective: 'architecture',
    layer: 2,
    pos: { x: 69.4021457330552, y: 47.137062411029015 },
    posAr: { x: 79.08053227763795, y: 59.96700310762947 },
    posArc: { x: 52.61, y: 41.82 },
    posExp: { x: 90.11867005671417, y: 40.446358131524536 },
    posInf: { x: 78.68902622621927, y: 48.48105059377542 },
    posAcc: { x: 75.95326420867792, y: 40.778145770488745 },
  },
  {
    id: 'narrative', text: 'Narrative',
    priority: 'core', perspective: 'archaeology',
    layer: 4,
    pos: { x: 22.845363309852244, y: 32.43146237586429 },
    posAr: { x: 33.0271063411186, y: 63.19694782910791 },
    posArc: { x: 16.83160000980648, y: 35.178599648299806 },
    posExp: { x: 38.27824940956786, y: 42.03110749813584 },
    posInf: { x: 27.53593741317174, y: 59.465876009397035 },
    posAcc: { x: 35.284565973640986, y: 77.32880746572498 },
  },
  {
    id: 'research', text: 'Research',
    priority: 'secondary', perspective: 'archaeology',
    layer: 4,
    pos: { x: 27.694760498302244, y: 79.23114155072194 },
    posAr: { x: 42.36033301189854, y: 49.98687130876322 },
    posArc: { x: 40.67562703024892, y: 62.998014262896556 },
    posExp: { x: 28.101869299980383, y: 41.9393462380101 },
    posInf: { x: 44.074456853507454, y: 50.439491345453155 },
    posAcc: { x: 34.650888894053186, y: 41.642511486789925 },
  },
  {
    id: 'context', text: 'Context',
    priority: 'secondary', perspective: 'archaeology',
    layer: 4,
    pos: { x: 35.481251126213544, y: 26.94999396003508 },
    posAr: { x: 34.192569776718594, y: 34.46926207039723 },
    posArc: { x: 25.24465705775815, y: 29.148942685737526 },
    posExp: { x: 44.290467677415656, y: 26.464686684432617 },
    posInf: { x: 31.616539827610155, y: 39.95114588276166 },
    posAcc: { x: 40.547842652388696, y: 67.2412518058992 },
  },
  {
    id: 'community', text: 'Community',
    priority: 'core', perspective: 'archaeology',
    layer: 4,
    pos: { x: 18.832678467818376, y: 66.59291876737054 },
    posAr: { x: 44.55194203141345, y: 20.899412431365235 },
    posArc: { x: 22.984440548310216, y: 60.815398399369586 },
    posExp: { x: 44.064414144220714, y: 54.48597325786334 },
    posInf: { x: 34.992269184958485, y: 65.45072062262744 },
    posAcc: { x: 45.783363019232976, y: 77.40627312716072 },
  },
  {
    id: 'user', text: 'User',
    priority: 'secondary', perspective: 'archaeology',
    layer: 4,
    pos: { x: 53.21259926768027, y: 54.798639416477425 },
    posAr: { x: 64.67559057515037, y: 45.30109578362256 },
    posArc: { x: 49.628210758225185, y: 33.85761301433704 },
    posExp: { x: 52.99492051128562, y: 21.504656767938243 },
    posInf: { x: 53.053942975798404, y: 54.059829371653 },
    posAcc: { x: 52.03504531668819, y: 55.5702310332921 },
  },
  {
    id: 'information', text: 'Information',
    priority: 'core', perspective: 'both',
    layer: 3,
    pos: { x: 43.324581541436484, y: 68.36733388904894 },
    posAr: { x: 46.93856986712213, y: 73.32883010566364 },
    posArc: { x: 57.52888293661332, y: 51.720570950125416 },
    posExp: { x: 53.003070236908344, y: 80.27379678391065 },
    posInf: { x: 52.61, y: 41.82 },
    posAcc: { x: 28.747968885349926, y: 32.78574762638117 },
  },
  {
    id: 'flow', text: 'Flow',
    priority: 'secondary', perspective: 'architecture',
    layer: 4,
    pos: { x: 72.04464239272113, y: 76.99502393743222 },
    posAr: { x: 65.1628630851203, y: 74.93606053416485 },
    posArc: { x: 65.96013640974355, y: 21.223336498070182 },
    posExp: { x: 52.95443364482544, y: 61.48333616840089 },
    posInf: { x: 76.40467696824333, y: 58.0177474187822 },
    posAcc: { x: 61.02431398272016, y: 64.21173012028029 },
  },
  {
    id: 'interface', text: 'Interface',
    priority: 'secondary', perspective: 'architecture',
    layer: 4,
    pos: { x: 69.49165544964777, y: 26.130825372724885 },
    posAr: { x: 82.95402376438285, y: 28.75792876866272 },
    posArc: { x: 43.64476073452618, y: 49.398385160698556 },
    posExp: { x: 62.42092891932531, y: 27.91399030110324 },
    posInf: { x: 67.7971238293508, y: 62.346384531546565 },
    posAcc: { x: 52.011383020887816, y: 19.310671286096802 },
  },
  {
    id: 'quality', text: 'Quality',
    priority: 'secondary', perspective: 'architecture',
    layer: 4,
    pos: { x: 80.84932120989554, y: 36.262336936834835 },
    posAr: { x: 81.35094432367939, y: 80.08836112264438 },
    posArc: { x: 66.56711699290255, y: 47.90341771454718 },
    posExp: { x: 62.01637947625196, y: 53.80587479663774 },
    posInf: { x: 74.70480317566684, y: 39.204401929611235 },
    posAcc: { x: 61.766657262826066, y: 25.82855074735629 },
  },
  {
    id: 'design', text: 'Design',
    priority: 'secondary', perspective: 'architecture',
    layer: 4,
    pos: { x: 82.04992614746092, y: 58.298178144277045 },
    posAr: { x: 89.68115779860749, y: 62.627010543061955 },
    posArc: { x: 54.19658047600271, y: 18.172546013358362 },
    posExp: { x: 77.17387316332701, y: 40.89192139201464 },
    posInf: { x: 61.65613798133499, y: 49.489547323032465 },
    posAcc: { x: 65.99688519210497, y: 41.05162563762541 },
  },
  {
    id: 'experience', text: 'Experience',
    priority: 'core', perspective: 'both',
    layer: 3,
    pos: { x: 52.235567512033374, y: 22.841485566575718 },
    posAr: { x: 62.04409269324906, y: 31.105536495051516 },
    posArc: { x: 37.08199067311306, y: 15.449846800433843 },
    posExp: { x: 52.61, y: 41.82 },
    posInf: { x: 52.72041872670959, y: 27.65477665700519 },
    posAcc: { x: 51.851840889264346, y: 29.21656874518074 },
  },
  {
    id: 'accessibility', text: 'Accessibility',
    priority: 'core', perspective: 'both',
    layer: 3,
    pos: { x: 60.876402687487734, y: 66.34901480254797 },
    posAr: { x: 68.0442332145659, y: 18.77201948252779 },
    posArc: { x: 44.92062853186699, y: 26.014664944795623 },
    posExp: { x: 65.87134334548248, y: 41.771125535944274 },
    posInf: { x: 53.0065034644474, y: 66.71085166418113 },
    posAcc: { x: 52.61, y: 41.82 },
  },
];

/* ─── Float & opacity params per node ────── */

WORDS.forEach(w => {
  const h = hash(w.id);
  w.float = {
    ax: 2 + (h % 5),
    ay: 3 + ((h >> 4) % 6),
    fx: 0.2 + (h % 40) / 100,
    fy: 0.25 + ((h >> 4) % 45) / 100,
    px: (h % 628) / 100,
    py: ((h >> 8) % 628) / 100,
  };
  w.opacityBase = defaults.opacity.base[w.layer] ?? 0.55;
  w.opacityAmp = defaults.opacity.amp[w.layer] ?? 0.08;
  w.opacityFreq = 0.15 + (h % 25) / 100;
  w.opacityPhase = (h % 628) / 100;

  const s = defaults.typography[w.layer] || defaults.typography[4];
  w.fontSize = s.fontSize;
  w.fontWeight = s.fontWeight;
  w.letterSpacing = s.letterSpacing;
  w.color = 'var(--text-primary)';

  w.dragState = 'resting';
  w.dragOffset = { x: 0, y: 0 };
  w.velocity = { x: 0, y: 0 };
  w.floatTimer = 0;
  w.floatPhase = (h % 628) / 100;

  w.displayX = w.pos.x;
  w.displayY = w.pos.y;
});

/* ─── Default positions (for reset) ──────── */

export const DEFAULT_LAYOUT = {};
WORDS.forEach(w => {
  DEFAULT_LAYOUT[w.id] = {
    pos: { x: w.pos.x, y: w.pos.y },
    posAr: { x: w.posAr.x, y: w.posAr.y },
    posArc: { x: w.posArc.x, y: w.posArc.y },
    posExp: { x: w.posExp.x, y: w.posExp.y },
    posAcc: { x: w.posAcc.x, y: w.posAcc.y },
    posInf: { x: w.posInf.x, y: w.posInf.y },
  };
});

/* ─── Layout persistence ─────────────────── */

const STORAGE_LAYOUT = 'concept_layout';

export function loadLayout() {
  if (typeof localStorage === 'undefined') return;
  const raw = localStorage.getItem(STORAGE_LAYOUT);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    WORDS.forEach(w => {
      const d = data[w.id];
      if (!d) return;
      if (d.pos !== undefined) {
        if (d.pos) { w.pos.x = d.pos.x; w.pos.y = d.pos.y; }
        if (d.posAr) { w.posAr.x = d.posAr.x; w.posAr.y = d.posAr.y; }
        if (d.posArc) { w.posArc.x = d.posArc.x; w.posArc.y = d.posArc.y; }
        if (d.posExp) { w.posExp.x = d.posExp.x; w.posExp.y = d.posExp.y; }
        if (d.posAcc) { w.posAcc.x = d.posAcc.x; w.posAcc.y = d.posAcc.y; }
        if (d.posInf) { w.posInf.x = d.posInf.x; w.posInf.y = d.posInf.y; }
      } else {
        w.pos.x = d.x; w.pos.y = d.y;
      }
    });
  } catch {}
}
