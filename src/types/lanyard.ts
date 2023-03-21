export type Response = Handshake | { [id: string]: Lanyard } | Lanyard;

export interface Handshake {
	heartbeat_interval: number;
}

export enum Activities {
    Game,
    CustomStatus,
    Spotify
}

export interface Lanyard {
	active_on_discord_mobile: boolean;
	active_on_discord_desktop: boolean;
	listening_to_spotify: boolean;
	spotify?: {
		track_id: string;
		timestamps: {
			start: number;
			end: number;
		};
		song: string;
		artist: string;
		album_art_url: string;
		album: string;
	};
	discord_user: {
		username: string;
		public_flags: number;
		id: string;
		discriminator: string;
		avatar: string;
	};
	discord_status: "online" | "dnd" | "idle" | "offline";
	activities: {
		type: Activities;
		timestamps?: {
			start: number;
			end?: number;
		};
		sync_id?: string;
		session_id?: string;
		state: string;
		party?: {
			id: string;
		};
		name: string;
		id: string;
		flags?: number;
		details?: string;
		created_at: number;
		assets?: {
			large_text?: string;
			large_image?: string;
			small_text?: string;
			small_image?: string;
		};
		application_id?: string;
	}[];
}
