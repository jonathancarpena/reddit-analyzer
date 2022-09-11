/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ["Verdana"]
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translate' },
          '50%': { transform: 'rotate(5deg)' },
        },
        move: {
          '0%%': { transform: ' translateX(0) translateY(0px) rotate(45deg)' },
          '100%': { transform: ' translateX(-250px) translateY(250px) rotate(45deg)' },
        },


      },
      animation: {
        'wiggle': 'wiggle 700ms ease-in-out infinite ',
        'move': 'move 800ms ease-in-out infinite ',
      },
      colors: {
        black: '#1F2937',
        sub: '#808486',
        ['comment-activity']: "#7193FF",
        ['comment-karma']: "#FFDE70",
        ['sub-activity']: "#ff4500",
        ['sub-karma']: "#32c7fc",
        primary: {
          100: '#ffdacc',
          200: '#ffb599',
          300: '#ff8f66',
          400: '#ff6a33',
          500: '#ff4500',
          600: '#cc3700',
          700: '#992900',
          800: '#661c00',
          900: '#330e00'
        },
        secondary: {
          100: '#f8f9fa',
          200: '#f0f3f5',
          300: '#e9ecf0',
          400: '#e1e6eb',
          500: '#dae0e6',
          600: '#aeb3b8',
          700: '#83868a',
          800: '#6d7073',
          900: '#575a5c'
        },
        analogous: {
          100: '#d6f4fe',
          200: '#ade9fe',
          300: '#84ddfd',
          400: '#5bd2fd',
          500: '#32c7fc',
          600: '#289fca',
          700: '#1e7797',
          800: '#145065',
          900: '#0a2832',
        },
        neutral: '',
      }
    },
  },
  plugins: [
    require("tailwindcss-animation-delay")
  ],
}
