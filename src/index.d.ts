export interface Position {
  x: number;
  y: number;
}

export interface FloatParams {
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
}

export interface CartographyNode {
  id: string;
  text: string;
  priority: 'central' | 'core' | 'secondary';
  perspective: 'archaeology' | 'architecture' | 'both' | null;
  layer: number;
  pos: Position;
  posAr: Position;
  posArc: Position;
  posExp: Position;
  posInf: Position;
  posAcc: Position;
  float: FloatParams;
  opacityBase: number;
  opacityAmp: number;
  opacityFreq: number;
  opacityPhase: number;
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  color: string;
  dragState: 'resting' | 'dragging' | 'floating' | 'returning';
  dragOffset: Position;
  velocity: Position;
  floatTimer: number;
  floatPhase: number;
  displayX: number;
  displayY: number;
}

export interface Connection {
  from: string;
  to: string;
  central?: boolean;
  strength?: number;
}

export interface DragConfig {
  threshold: number;
  friction: number;
  returnSnap: number;
  returnAccel: number;
  returnDamping: number;
  floatAmplitude: number;
  floatSpeed: number;
  impulseFactor: number;
}

export interface BorderConfig {
  zone: number;
  maxVelocityPct: number;
}

export interface AnimationConfig {
  lerpSpeed: number;
  floatScaleActive: number;
  floatScaleNeutral: number;
}

export interface TypographyConfig {
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
}

export interface OpacityConfig {
  base: Record<number, number>;
  amp: Record<number, number>;
}

export interface EdgeStyle {
  sw: number;
  op: number;
}

export interface EdgeConfig {
  1: EdgeStyle;
  2: EdgeStyle;
  3: EdgeStyle;
  4: EdgeStyle;
}

export interface ConnectionStrengthConfig {
  structural: string[];
  articulating: string[];
}

export interface CartographyConfig {
  anchor: Position;
  drag: DragConfig;
  border: BorderConfig;
  animation: AnimationConfig;
  typography: Record<number, TypographyConfig>;
  opacity: OpacityConfig;
  edges: EdgeConfig;
  connectionStrength: ConnectionStrengthConfig;
}

export interface CartographyInstance {
  nodeMap: Map<string, { wrapper: HTMLElement; inner: HTMLElement; data: CartographyNode }>;
  lineEls: Array<{ line: SVGLineElement; from: string; to: string; strength: number; baseOp: number; central: boolean }>;
  words: CartographyNode[];
  config: CartographyConfig;
  destroy(): void;
}

export interface CreateCartographyOptions {
  container: HTMLElement;
  config?: Partial<CartographyConfig>;
}

export function createCartography(options?: CreateCartographyOptions): CartographyInstance;

export const defaults: CartographyConfig;
export const WORDS: CartographyNode[];
export const CONNECTIONS: Connection[];
export const STATE_NODES: string[];