/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		screens: {
			sm: "600px"
		},
		extend: {
			fontFamily: {
				sans: ["GG"],
				ginto: ["Ginto"]
			}
		}
	},
	plugins: []
};
