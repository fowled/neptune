import type { PageServerLoad, Actions } from "./$types";
import type { Repository } from "@/types/github";

export const load = (async ({ fetch }) => {
	const repos: Repository[] = await fetch("/api/repos").then(async (res) => await res.json());

	return { repos };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();

		const message = data.get("message");

		await fetch("/api/messages", {
			method: "POST",
			headers: {
				Accept: "application/json"
			},
			body: JSON.stringify({ message })
		});

		return { location: "/" };
	}
} satisfies Actions;

export const prerender = false;
export const ssr = true;
