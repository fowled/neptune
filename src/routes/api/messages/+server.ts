import { SECRET_WEBHOOK } from "$env/static/private";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = (async ({ fetch, request, getClientAddress }) => {
	const { message } = await request.json();

	const ip = getClientAddress();

	const color = Math.floor(Math.random() * 16777215);

	const send = {
		content: null,
		embeds: [
			{
				color,
				fields: [
					{
						name: "Message",
						value: message,
						inline: false
					},

					{
						name: "IP address",
						value: ip,
						inline: false
					},

					{
						name: "Time",
						value: new Date().toLocaleString(),
						inline: false
					}
				]
			}
		]
	};

	await fetch(SECRET_WEBHOOK, {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify(send)
	});

	return new Response(JSON.stringify({ message: "ok" }), { status: 302 });
}) satisfies RequestHandler;
