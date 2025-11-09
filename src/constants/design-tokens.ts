/**
 * 🔒 디자인 토큰 TypeScript 정의
 * 
 * 이 파일은 디자인 시스템을 TypeScript 레벨에서 강제합니다.
 * - 타입 안전성 보장
 * - 잘못된 값 사용 방지
 * - 자동완성 지원
 * 
 * ⚠️ 주의: 이 파일의 값을 변경하지 마세요!
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/* ============================================
   브랜드 컬러 (절대 변경 금지)
   ============================================ */

export const BRAND_COLORS = {
  hyunpungRed: '#D61C1C',
  shinkalOrange: '#F37021',
  darkBrown: '#2E1C10',
  creamBg: '#F9F6F3',
  brassGold: '#C7A45A',
} as const;

export type BrandColor = typeof BRAND_COLORS[keyof typeof BRAND_COLORS];

/* ============================================
   시맨틱 컬러 매핑
   ============================================ */

export const SEMANTIC_COLORS = {
  primary: BRAND_COLORS.hyunpungRed,
  primaryHover: '#b71616',
  primaryLight: 'rgba(214, 28, 28, 0.1)',
  
  secondary: BRAND_COLORS.shinkalOrange,
  secondaryHover: '#d45e1a',
  secondaryLight: 'rgba(243, 112, 33, 0.1)',
  
  accent: BRAND_COLORS.brassGold,
  accentHover: '#b08f4a',
  accentLight: 'rgba(199, 164, 90, 0.1)',
  
  textPrimary: BRAND_COLORS.darkBrown,
  textSecondary: '#5a5a68',
  textWhite: '#ffffff',
  
  background: '#ffffff',
  backgroundMuted: BRAND_COLORS.creamBg,
  foreground: BRAND_COLORS.darkBrown,
} as const;

export type SemanticColor = typeof SEMANTIC_COLORS[keyof typeof SEMANTIC_COLORS];

/* ============================================
   타이포그래피 토큰
   ============================================ */

export const FONT_FAMILY = {
  sans: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', 'Malgun Gothic', 'Noto Sans KR', sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
} as const;

export type FontSize = typeof FONT_SIZES[keyof typeof FONT_SIZES];

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type FontWeight = typeof FONT_WEIGHTS[keyof typeof FONT_WEIGHTS];

export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export type LineHeight = typeof LINE_HEIGHTS[keyof typeof LINE_HEIGHTS];

/* ============================================
   Border Radius 토큰
   ============================================ */

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
} as const;

export type BorderRadius = typeof BORDER_RADIUS[keyof typeof BORDER_RADIUS];

/* ============================================
   Shadow 토큰
   ============================================ */

export const SHADOWS = {
  soft1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  soft2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  soft3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  medium: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  large: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
} as const;

export type Shadow = typeof SHADOWS[keyof typeof SHADOWS];

/* ============================================
   Spacing 토큰
   ============================================ */

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export type Spacing = typeof SPACING[keyof typeof SPACING];

/* ============================================
   Z-Index 토큰
   ============================================ */

export const Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  fixed: 200,
  modalBackdrop: 900,
  modal: 1000,
  popover: 1050,
  toast: 1100,
  tooltip: 1200,
} as const;

export type ZIndex = typeof Z_INDEX[keyof typeof Z_INDEX];

/* ============================================
   Breakpoint 토큰
   ============================================ */

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS];

/* ============================================
   Duration 토큰
   ============================================ */

export const DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

export type Duration = typeof DURATIONS[keyof typeof DURATIONS];

/* ============================================
   Easing 토큰
   ============================================ */

export const EASINGS = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type Easing = typeof EASINGS[keyof typeof EASINGS];

/* ============================================
   유틸리티 함수
   ============================================ */

/**
 * CSS 변수로 컬러 사용
 */
export const cssVar = (token: string): string => `var(--${token})`;

/**
 * 브랜드 컬러를 CSS 변수로 변환
 */
export const brandColor = (color: keyof typeof BRAND_COLORS): string => {
  const mapping: Record<keyof typeof BRAND_COLORS, string> = {
    hyunpungRed: 'color-hyunpung-red',
    shinkalOrange: 'color-shinkal-orange',
    darkBrown: 'color-dark-brown',
    creamBg: 'color-cream-bg',
    brassGold: 'color-brass-gold',
  };
  return cssVar(mapping[color]);
};

/**
 * 시맨틱 컬러를 CSS 변수로 변환
 */
export const semanticColor = (color: keyof typeof SEMANTIC_COLORS): string => {
  const mapping: Record<keyof typeof SEMANTIC_COLORS, string> = {
    primary: 'color-primary',
    primaryHover: 'color-primary-hover',
    primaryLight: 'color-primary-light',
    secondary: 'color-secondary',
    secondaryHover: 'color-secondary-hover',
    secondaryLight: 'color-secondary-light',
    accent: 'color-accent',
    accentHover: 'color-accent-hover',
    accentLight: 'color-accent-light',
    textPrimary: 'color-text-primary',
    textSecondary: 'color-text-secondary',
    textWhite: 'color-text-white',
    background: 'background',
    backgroundMuted: 'muted',
    foreground: 'foreground',
  };
  return cssVar(mapping[color]);
};

/**
 * 타입 안전한 스타일 객체 생성
 */
export const createStyle = <T extends React.CSSProperties>(style: T): T => style;

/**
 * 디자인 토큰 검증
 */
export const validateDesignToken = (category: string, value: string): boolean => {
  const categories = {
    color: Object.values(BRAND_COLORS),
    fontSize: Object.values(FONT_SIZES),
    fontWeight: Object.values(FONT_WEIGHTS),
    spacing: Object.values(SPACING),
    borderRadius: Object.values(BORDER_RADIUS),
  };
  
  return categories[category as keyof typeof categories]?.includes(value as any) ?? false;
};

/* ============================================
   전체 디자인 토큰 Export
   ============================================ */

export const DESIGN_TOKENS = {
  brand: BRAND_COLORS,
  semantic: SEMANTIC_COLORS,
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZES,
  fontWeight: FONT_WEIGHTS,
  lineHeight: LINE_HEIGHTS,
  borderRadius: BORDER_RADIUS,
  shadow: SHADOWS,
  spacing: SPACING,
  zIndex: Z_INDEX,
  breakpoint: BREAKPOINTS,
  duration: DURATIONS,
  easing: EASINGS,
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;

/* ============================================
   타입 가드
   ============================================ */

export const isBrandColor = (value: string): value is BrandColor => {
  return Object.values(BRAND_COLORS).includes(value as BrandColor);
};

export const isSemanticColor = (value: string): value is SemanticColor => {
  return Object.values(SEMANTIC_COLORS).includes(value as SemanticColor);
};

export const isFontSize = (value: string): value is FontSize => {
  return Object.values(FONT_SIZES).includes(value as FontSize);
};

export const isFontWeight = (value: number): value is FontWeight => {
  return Object.values(FONT_WEIGHTS).includes(value as FontWeight);
};

/* ============================================
   상수 Export (기존 호환성)
   ============================================ */

export {
  BRAND_COLORS as COLORS,
  SEMANTIC_COLORS as THEME_COLORS,
  FONT_SIZES as TYPOGRAPHY_SIZES,
  SPACING as SPACE,
  Z_INDEX as ZINDEX,
};
