export interface Data {
	spotify: Spotify | null;
	kv: { [key: string]: string };
	listening_to_spotify: boolean;
	discord_user: DiscordUser;
	discord_status: string;
	activities: Activity[];
	active_on_discord_mobile: boolean;
	active_on_discord_desktop: boolean;
}

export interface Spotify {
	track_id: string;
	timestamps: Timestamps;
	song: string;
	artist: string;
	album_art_url: string;
	album: string;
}

export interface Timestamps {
	start: number;
	end: number;
}

export interface DiscordUser {
	username: string;
	public_flags: number;
	id: number;
	discriminator: string;
	avatar: string;
}

export interface Activity {
	type: number;
	state: string;
	name: string;
	id: string;
	emoji?: Emoji;
	created_at: number;
	timestamps?: Timestamps;
	sync_id?: string;
	session_id?: string;
	party?: Party;
	flags?: number;
	details?: string;
	assets?: Assets;
	application_id?: string;
}

export interface Emoji {
	name: string;
	id: number;
	animated: boolean;
}

export interface Party {
	id: string;
}

export interface Assets {
	small_text: string;
	small_image: string;
	large_text: string;
	large_image: string;
}

interface SocketData extends Data {
	heartbeat_interval?: number;
}

export interface SocketMessage {
	op: Op;
	t: Event;
	d: SocketData;
}

export interface Card {
	status: string;
	name?: string;
	details?: string;
	large_icon?: string;
	small_icon?: string | null;
	state?: string;
	timestamp_start?: number | null;
	timestamp_end?: number | null;
	elapsed?: number | null;
}

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
