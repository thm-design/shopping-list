export type CatColorName = 'green' | 'red' | 'blue' | 'orange' | 'yellow' | 'purple' | 'pink' | 'gray';

export interface CatColorSet {
  dot: string;
  lBg: string;
  lTxt: string;
  dBg: string;
  dTxt: string;
}

const CAT_COLORS: Record<CatColorName, CatColorSet> = {
  green: {
    dot: 'oklch(52% 0.17 145)',
    lBg: 'oklch(96% 0.04 145)',
    lTxt: 'oklch(34% 0.14 145)',
    dBg: 'oklch(19% 0.07 145)',
    dTxt: 'oklch(72% 0.14 145)',
  },
  red: {
    dot: 'oklch(52% 0.22 25)',
    lBg: 'oklch(97% 0.03 25)',
    lTxt: 'oklch(36% 0.18 25)',
    dBg: 'oklch(17% 0.06 25)',
    dTxt: 'oklch(72% 0.16 25)',
  },
  blue: {
    dot: 'oklch(55% 0.20 245)',
    lBg: 'oklch(96% 0.04 245)',
    lTxt: 'oklch(38% 0.16 245)',
    dBg: 'oklch(17% 0.07 245)',
    dTxt: 'oklch(72% 0.14 245)',
  },
  orange: {
    dot: 'oklch(63% 0.20 65)',
    lBg: 'oklch(97% 0.04 65)',
    lTxt: 'oklch(42% 0.16 65)',
    dBg: 'oklch(20% 0.07 65)',
    dTxt: 'oklch(75% 0.14 65)',
  },
  yellow: {
    dot: 'oklch(76% 0.17 90)',
    lBg: 'oklch(98% 0.04 90)',
    lTxt: 'oklch(48% 0.15 80)',
    dBg: 'oklch(22% 0.07 85)',
    dTxt: 'oklch(82% 0.13 90)',
  },
  purple: {
    dot: 'oklch(55% 0.22 300)',
    lBg: 'oklch(96% 0.04 300)',
    lTxt: 'oklch(38% 0.18 300)',
    dBg: 'oklch(17% 0.08 300)',
    dTxt: 'oklch(72% 0.14 300)',
  },
  pink: {
    dot: 'oklch(60% 0.22 350)',
    lBg: 'oklch(97% 0.03 350)',
    lTxt: 'oklch(42% 0.18 350)',
    dBg: 'oklch(20% 0.07 350)',
    dTxt: 'oklch(74% 0.14 350)',
  },
  gray: {
    dot: 'oklch(50% 0.01 240)',
    lBg: 'oklch(95% 0.005 240)',
    lTxt: 'oklch(40% 0.01 240)',
    dBg: 'oklch(22% 0.007 240)',
    dTxt: 'oklch(65% 0.01 240)',
  },
};

export const CAT_COLOR_NAMES: CatColorName[] = ['green', 'red', 'blue', 'orange', 'yellow', 'purple', 'pink', 'gray'];

export function getCat(colorName: string): CatColorSet {
  const name = (colorName || 'gray') as CatColorName;
  return CAT_COLORS[name] ?? CAT_COLORS.gray;
}

export function catBg(colorName: string, isDark: boolean): string {
  const cs = getCat(colorName);
  return isDark ? cs.dBg : cs.lBg;
}

export function catText(colorName: string, isDark: boolean): string {
  const cs = getCat(colorName);
  return isDark ? cs.dTxt : cs.lTxt;
}

export function catDot(colorName: string): string {
  return getCat(colorName).dot;
}

export const DEFAULT_CATEGORIES: { name: string; color: CatColorName }[] = [
  { name: 'Produce', color: 'green' },
  { name: 'Meat', color: 'red' },
  { name: 'Dairy', color: 'blue' },
  { name: 'Pantry', color: 'orange' },
  { name: 'General', color: 'gray' },
];