module.exports = {
	useTabs: true,
    tabWidth: 4,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 131,
	plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
	pluginSearchDirs: ["."],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }]
};
