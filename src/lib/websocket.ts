import { writable } from "svelte/store";

import { id } from "config.json";

import { Op, errors } from "@/types/websocket";

import type { Handshake, Lanyard } from "@/types/lanyard";
import type { Content } from "@/types/websocket";

export const lanyard = writable<Lanyard>();

export function Socket() {
	const websocket = new WebSocket("wss://api.lanyard.rest/socket");

	websocket.onopen = () => {
		console.log("connection opened");
	};

	websocket.onmessage = (raw) => {
		const msg: Content = JSON.parse(raw.data);

		switch (msg.op) {
			case Op.Hello: {
				websocket.send(JSON.stringify({ op: Op.Initialize, d: { subscribe_to_ids: [id] } }));

				return setInterval(() => {
					websocket.send(JSON.stringify({ op: Op.Heartbeat }));
				}, (<Handshake>msg.d)?.heartbeat_interval);
			}

			case Op.Event: {
				switch (msg.t) {
					case "INIT_STATE": {
						return lanyard.set((<{ [id: string]: Lanyard }>msg.d)[id]);
					}

					case "PRESENCE_UPDATE": {
						return lanyard.set(<Lanyard>msg.d);
					}
				}
			}
		}
	};

	websocket.onclose = (err) => {
		console.log(`[WS] closed - ${errors[err.code as keyof typeof errors]}`);

		Socket();
	};

	websocket.onerror = (err) => {
		console.error(err);
	};
}
