import type { RequestHandler } from "./$types";

import { webhook } from "config.json";

export const POST: RequestHandler = (async ({ fetch, request, getClientAddress }) => {
	const { message } = await request.json();
	const ip = getClientAddress();

	const send = {
		content: null,
		embeds: [
			{
				fields: [
					{
						name: "Message",
						value: message,
						inline: true
					},

					{
						name: "IP address",
						value: ip,
						inline: true
					},

					{
						name: "Time",
						value: new Date().toLocaleString(),
						inline: true
					}
				]
			}
		]
	};

	await fetch(webhook, {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify(send)
	});

	return new Response(JSON.stringify({ message: "ok" }), { status: 302 });
}) satisfies RequestHandler;
