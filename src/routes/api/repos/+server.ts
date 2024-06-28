import type { Repository } from "@/types/github";
import type { RequestHandler } from "./$types";

import { SECRET_GITHUB_PAT } from "$env/static/private";

export const GET: RequestHandler = async ({ setHeaders }) => {
	const repos = ["mango", "sapphire", "amethyst", "neptune", "emerald", "nitrogen"];

	const info = [] as Repository[];

	const headers = {
		headers: { Authorization: `Bearer ${SECRET_GITHUB_PAT}` }
	};

	await Promise.all(
		repos.map(async (repo) => {
			info.push(await fetch(`https://api.github.com/repos/fowled/${repo}`, headers).then((res) => res.json()));
		})
	);

	info.sort((a, b) => b.stargazers_count - a.stargazers_count);

	setHeaders({
		"cache-control": "max-age=60"
	});

	return new Response(JSON.stringify(info), { status: 200 });
};
