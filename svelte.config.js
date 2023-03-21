import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-auto";
import switchCase from "svelte-switch-case";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), switchCase()],
	kit: {
		adapter: adapter(),
		alias: {
			"@": path.resolve("./src/"),
			"config.json": path.resolve("./src/config.json")
		}
	}
};

export default config;
