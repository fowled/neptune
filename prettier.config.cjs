module.exports = {
	useTabs: true,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 115,
	plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
	pluginSearchDirs: ["."],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }]
};
