import type { Response } from "./lanyard";

export enum Op {
	Event = 0,
	Hello = 1,
	Initialize = 2,
	Heartbeat = 3
}

export type Event = "INIT_STATE" | "PRESENCE_UPDATE";

export interface Content {
	op: Op;
	seq?: number;
	t?: Event;
	d?: Response;
}

export const errors = {
	4004: "unknown opcode",
	4005: "requires data object",
	4006: "invalid payload"
};
