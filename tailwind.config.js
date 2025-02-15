
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			main: '#3B5D8F',
  			second: '#A3B8E0',
			gradient1 : "#B2C3E5",
  			'main-2': '#319191',
  			back: '#e5ebf4',
  			jobColor1: '#e0eafd',
  			jobColor2: '#dbf5ed',
  			jobColor3: '#f7e3f4',
  			jobColor4: '#e1dbf7',
  			jobColor5: '#edeff3',
  			jobColor6: '#fcebdb',
			maincl:'#3B5D8F',
			fillc:"#6688CC",
			urgentbg:"#F7ECD1",
			urgenttxt:"#D9A21B",
			buttonclr:"#F0F4FA",
			buttonbgclr:"#D2DCF0",
			mainbg : "#F2F2F2"

  		},
  		fontFamily: {
  			mainfont: [
  				'Lexend',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			fontlit: '10px',
			fontvlit:"8px"
  		},
  		keyframes: {
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			}
  		},
  		animation: {
  			marquee: 'marquee var(--duration) infinite linear',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
  		},
		screens :{
			amd : "1200px"
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

