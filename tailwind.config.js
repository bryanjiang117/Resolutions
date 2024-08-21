import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '300px',
        'md': '600px',
        'lg': '1000px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        xs: '0.65rem',
        xxxs: '0.60rem',
      },
      maxWidth: {
        '120': '30rem',
      }
    },
  },
  darkMode: "class",
  plugins: [
      nextui({
        themes: {
          light: {
            colors: {
              
            }
          },
          dark: {
            colors: {
              // foreground: '#c4841d',
              primary: {
                foreground: '#DAA520',
                background: '#DAA520',
                DEFAULT: '#DAA520',
                50: '#312107',
                100: '#62420e', 
                200: '#936316',
                300: '#c4841d', 
                400: '#f5a524',
                500: '#f7b750',
                600: '#f9c97c',
                700: '#fbdba7',
                800: '#fdedd3',
                900: '#fefce8'
              },
              focus: '#DAA520',
            }
          },
        }
      })
    ]
}
