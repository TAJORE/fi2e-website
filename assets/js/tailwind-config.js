tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Anthracite / charcoal — remplace l'ancien "navy" (fonds sombres) */
        navy: {
          50: '#f2f3f4',
          100: '#e2e4e6',
          200: '#c5c9ce',
          300: '#9ba1a9',
          400: '#6d7480',
          500: '#4f5561',
          600: '#3d424c',
          700: '#303642',
          800: '#24272f',
          900: '#191b21',
          950: '#101114'
        },
        /* Rouge industriel FI2E — remplace l'ancien "electric" (accent principal) */
        electric: {
          50: '#fdecec',
          100: '#fbd0cf',
          200: '#f7a19f',
          300: '#f37370',
          400: '#f04944',
          500: '#f21b23',
          600: '#d1121c',
          700: '#a50f18',
          800: '#7a0d14',
          900: '#520a10'
        },
        /* Cyan glace FI2E — refroidissement / accent secondaire */
        cyan: {
          50: '#eefcfd',
          100: '#d3f7fa',
          200: '#a8eef5',
          300: '#7de1ec',
          400: '#56c8dd',
          500: '#35abc4',
          600: '#278a9f',
          700: '#1f6c7d'
        },
        /* Vert énergie — usage ponctuel (succès / efficacité) */
        energy: {
          50: '#e6faf3',
          100: '#c2f2e0',
          200: '#85e5c1',
          300: '#47d9a2',
          400: '#16c88a',
          500: '#00b075',
          600: '#008c5e',
          700: '#00694a'
        },
        steel: {
          50: '#f6f6f7',
          100: '#eaebec',
          200: '#d6d8da',
          300: '#b4b8bc',
          400: '#8b9096',
          500: '#6b7178',
          600: '#545a61',
          700: '#41464c',
          800: '#2f333a',
          900: '#1e2126'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        premium: '0 20px 60px -15px rgba(16, 17, 20, 0.28)',
        'premium-lg': '0 30px 90px -20px rgba(16, 17, 20, 0.4)',
        glow: '0 0 40px rgba(242, 27, 35, 0.35)',
        'glow-cyan': '0 0 40px rgba(86, 200, 221, 0.4)'
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'hero-gradient': 'linear-gradient(135deg, #101114 0%, #24272f 45%, #3d424c 100%)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' }
        }
      }
    }
  }
};
