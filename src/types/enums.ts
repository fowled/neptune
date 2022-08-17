export enum Op {
	Event,
	Hello,
	Initialize,
	Heartbeat,
}

export enum Event {
	INIT_STATE = "INIT_STATE",
	PRESENCE_UPDATE = "PRESENCE_UPDATE",
}

export enum ActivityType {
	Spotify = 2,
	Lambda = 0,
}
