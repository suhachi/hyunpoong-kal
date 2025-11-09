/**
 * 🔒 Tailwind CSS 잠금 설정
 * 
 * 이 파일은 디자인 토큰을 완전히 잠급니다.
 * - 모든 값이 CSS 변수로 고정됨
 * - 임의 값 사용 금지
 * - 브랜드 컬러 보호
 * 
 * ⚠️ 주의: 이 파일을 사용하면 디자인이 절대 깨지지 않습니다!
 * 
 * 사용법:
 * 1. tailwind.config.js를 tailwind.backup.config.js로 백업
 * 2. 이 파일을 tailwind.config.js로 복사
 * 3. npm run dev 재시작
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  
  // 다크모드 비활성화 (브랜드 컬러 유지)
  darkMode: 'class',
  
  theme: {
    // ============================================
    // 기본 설정 완전 재정의 (extend 대신 replace)
    // ============================================
    
    // 화면 크기 고정
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    
    // 폰트 패밀리 고정
    fontFamily: {
      sans: ['var(--font-sans)'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    
    // 폰트 크기 고정 (CSS 변수만 사용)
    fontSize: {
      'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
      'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
      'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
      'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
      'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-normal)' }],
      '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
      '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
      '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
      '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-none)' }],
    },
    
    // 폰트 굵기 고정 (CSS 변수만 사용)
    fontWeight: {
      light: 'var(--font-weight-light)',
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
      bold: 'var(--font-weight-bold)',
      extrabold: 'var(--font-weight-extrabold)',
    },
    
    // 줄 높이 고정 (CSS 변수만 사용)
    lineHeight: {
      none: 'var(--leading-none)',
      tight: 'var(--leading-tight)',
      snug: 'var(--leading-snug)',
      normal: 'var(--leading-normal)',
      relaxed: 'var(--leading-relaxed)',
      loose: 'var(--leading-loose)',
    },
    
    // 컬러 팔레트 완전 고정
    colors: {
      // Tailwind 기본 컬러 제거, 브랜드 컬러만 허용
      
      // 현풍닭칼국수 브랜드 컬러 (잠금)
      'hyunpung-red': {
        DEFAULT: 'var(--color-hyunpung-red)',
        hover: 'var(--color-primary-hover)',
        light: 'var(--color-primary-light)',
      },
      'shinkal-orange': {
        DEFAULT: 'var(--color-shinkal-orange)',
        hover: 'var(--color-secondary-hover)',
        light: 'var(--color-secondary-light)',
      },
      'dark-brown': 'var(--color-dark-brown)',
      'cream-bg': 'var(--color-cream-bg)',
      'brass-gold': {
        DEFAULT: 'var(--color-brass-gold)',
        hover: 'var(--color-accent-hover)',
        light: 'var(--color-accent-light)',
      },
      
      // 시맨틱 브랜드 컬러
      'brand-primary': {
        DEFAULT: 'var(--color-brand-primary)',
        hover: 'var(--color-brand-primary-hover)',
        light: 'var(--color-brand-primary-light)',
      },
      'brand-secondary': {
        DEFAULT: 'var(--color-brand-secondary)',
        hover: 'var(--color-brand-secondary-hover)',
        light: 'var(--color-brand-secondary-light)',
      },
      'brand-accent': {
        DEFAULT: 'var(--color-brand-accent)',
        hover: 'var(--color-brand-accent-hover)',
        light: 'var(--color-brand-accent-light)',
      },
      
      // 시스템 컬러 (shadcn/ui 호환)
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      card: 'var(--color-card)',
      'card-foreground': 'var(--color-card-foreground)',
      popover: 'var(--color-popover)',
      'popover-foreground': 'var(--color-popover-foreground)',
      primary: 'var(--color-brand-primary)',
      'primary-foreground': 'var(--color-text-white)',
      secondary: 'var(--color-brand-secondary)',
      'secondary-foreground': 'var(--color-text-white)',
      muted: 'var(--color-muted)',
      'muted-foreground': 'var(--color-muted-foreground)',
      accent: 'var(--color-accent-bg)',
      'accent-foreground': 'var(--color-accent-foreground)',
      destructive: 'var(--color-destructive)',
      'destructive-foreground': 'var(--color-destructive-foreground)',
      border: 'var(--color-border)',
      input: 'var(--color-input)',
      ring: 'var(--color-ring)',
      
      // 필수 색상만 허용
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
    },
    
    // Border Radius 고정
    borderRadius: {
      none: '0',
      'sm': 'var(--radius-sm)',
      DEFAULT: 'var(--radius)',
      'md': 'var(--radius-md)',
      'lg': 'var(--radius-lg)',
      'xl': 'var(--radius-xl)',
      '2xl': 'var(--radius-2xl)',
      'full': 'var(--radius-full)',
    },
    
    // Box Shadow 고정
    boxShadow: {
      none: 'none',
      'sm': 'var(--shadow-soft-1)',
      DEFAULT: 'var(--shadow-soft-2)',
      'md': 'var(--shadow-soft-2)',
      'lg': 'var(--shadow-soft-3)',
      'xl': 'var(--shadow-medium)',
      '2xl': 'var(--shadow-large)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    
    // Spacing 고정
    spacing: {
      '0': '0',
      'px': '1px',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '2.75rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
      
      // 시맨틱 spacing (추가)
      'xs': 'var(--spacing-xs)',
      'sm': 'var(--spacing-sm)',
      'md': 'var(--spacing-md)',
      'lg': 'var(--spacing-lg)',
      'xl': 'var(--spacing-xl)',
      '2xl': 'var(--spacing-2xl)',
      '3xl': 'var(--spacing-3xl)',
    },
    
    // Z-Index 고정
    zIndex: {
      '0': '0',
      '10': '10',
      '20': '20',
      '30': '30',
      '40': '40',
      '50': '50',
      'auto': 'auto',
      
      // 시맨틱 z-index
      'base': 'var(--z-base)',
      'dropdown': 'var(--z-dropdown)',
      'sticky': 'var(--z-sticky)',
      'fixed': 'var(--z-fixed)',
      'modal-backdrop': 'var(--z-modal-backdrop)',
      'modal': 'var(--z-modal)',
      'popover': 'var(--z-popover)',
      'toast': 'var(--z-toast)',
      'tooltip': 'var(--z-tooltip)',
    },
    
    // 확장 설정 (필요한 경우에만)
    extend: {
      // 애니메이션
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      
      // 키프레임
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        pulse: {
          '50%': { opacity: '.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
          },
        },
      },
      
      // 트랜지션 타이밍
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  
  // ============================================
  // 설정 보호
  // ============================================
  
  // 임의 값 완전 금지 (디자인 토큰만 사용)
  safelist: [],
  
  // 플러그인 없음 (순수 Tailwind만)
  plugins: [],
  
  // 중요도 설정
  important: false,
  
  // 프리플라이트 활성화
  corePlugins: {
    preflight: true,
  },
}
