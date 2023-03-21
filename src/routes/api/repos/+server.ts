import type { Repository } from "@/types/github";
import type { RequestHandler } from "./$types";

import { pat } from "config.json";

export const GET: RequestHandler = async ({ setHeaders }) => {
	const repos = ["mango", "scratchlib", "sapphire", "amethyst", "neptune"];

	const info = [] as Repository[];

	const headers = {
		headers: { Authorization: `Bearer ${pat}` }
	};

	await Promise.all(
		repos.map(async (repo) => {
			info.push(await fetch(`https://api.github.com/repos/fowled/${repo}`, headers).then((res) => res.json()));
		})
	);

	setHeaders({
		"cache-control": "max-age=60"
	});

	return new Response(JSON.stringify(info), { status: 302 });
};
