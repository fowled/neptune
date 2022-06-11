import { useEffect, useState } from "react";

import { SocketMessage, DiscordUser, Op, Event, Card, ActivityType } from "./types/types";

import Spinner from "./templates/Spinner";
import ProgressBar from "./templates/ProgressBar";

let heartbeat: NodeJS.Timeout;

function App() {
	const [user, setUser] = useState<DiscordUser>();
	const [activity, setActivity] = useState<Card>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (heartbeat) {
			clearInterval(heartbeat);
		}

		const ws = new WebSocket("wss://api.lanyard.rest/socket");

		ws.addEventListener("open", () => {
			console.log("[WebSocket] connection opened");
		});

		ws.addEventListener("close", () => {
			console.log("[WebSocket] connection closed");
		});

		ws.addEventListener("message", (event) => {
			const data: SocketMessage = JSON.parse(event.data);

			switch (data.op) {
				case Op.Hello:
					heartbeat = setInterval(() => {
						if (ws.readyState === WebSocket.OPEN) {
							ws.send(JSON.stringify({ op: Op.Heartbeat }));
						}
					}, data.d?.heartbeat_interval);

					if (ws.readyState === WebSocket.OPEN) {
						ws.send(
							JSON.stringify({
								op: Op.Initialize,
								d: { subscribe_to_id: import.meta.env.VITE_ID },
							})
						);
					}

					break;

				case Op.Event:
					switch (data.t) {
						case Event.INIT_STATE:
						case Event.PRESENCE_UPDATE:
							setUser(data.d.discord_user);

							if (data.d.activities[0]?.type === 4) {
								data.d.activities.shift();
							}

							const currentActivity = data.d.activities[0];

							switch (currentActivity?.type) {
								case ActivityType.Spotify:
									const spotify = data.d.spotify!;

									return setActivity({
										status: data.d.discord_status,
										name: spotify.song,
										details: `by ${spotify.artist}`,
										large_icon: spotify.album_art_url,
										small_icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Spotify_App_Logo.svg",
										state: `on ${spotify.album}`,
										timestamp_start: spotify.timestamps.start,
										timestamp_end: spotify.timestamps.end,
										elapsed: spotify.timestamps.start,
									});

								case ActivityType.Lambda:
									return setActivity({
										status: data.d.discord_status,
										name: currentActivity.name,
										details: currentActivity.details,
										large_icon: currentActivity.assets?.large_image
											? `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}`
											: "https://i.imgur.com/j1HAfFJ.png",
										small_icon: currentActivity.assets?.small_image ? `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}` : null,
										state: currentActivity.state,
										timestamp_start: currentActivity.timestamps?.start || null,
										elapsed: currentActivity.timestamps?.start || null,
									});

								default:
									return setActivity({
										status: data.d.discord_status,
										name: "Idling",
										details: "I'm currently AFK/offline",
										large_icon: "https://twemoji.maxcdn.com/2/svg/1f44b.svg",
										state: "I'll be right back!",
									});
							}
					}
			}
			
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (activity?.timestamp_start) {
			const interval = setInterval(() => {
				setActivity((prev) => ({
					...prev!,
					elapsed: prev!.elapsed! + 1,
				}));
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [activity?.timestamp_start]);

	function parseTimestamp(type: string, end?: boolean) {
		const parse = !end ? new Date().getTime() - activity?.elapsed! : new Date(activity?.timestamp_end! - activity?.timestamp_start!).getTime();

		switch (type) {
			case "time":
				const seconds = Math.floor((parse / 1000) % 60);
				const minutes = Math.floor((parse / 1000 / 60) % 60);
				const hours = Math.floor((parse / 1000 / 60 / 60) % 24);

				let result = [hours.toString().padStart(2, "0"), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");

				return (hours === 0 ? result.slice(3, 8) : result);

			case "progress":
				const timeDifference = activity!.timestamp_end! - activity?.timestamp_start!;

				return (parse / timeDifference) * 100;
		}
	}

	return !loading ? (
		<div className="App flex bg-black text-white h-screen">
			<div className="flex flex-col m-auto w-96 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex space-x-2 items-center">
						<div className="relative">
							<img className="rounded-full h-14 w-14 shadow-lg" src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png?size=512`} />
							<img title={activity?.status} className="w-7 absolute -bottom-1 -right-1 shadow-sm bg-black rounded-full" src={`icons/${activity?.status}.png`} />
						</div>

						<div>
							<p className="font-semibold text-xl leading-tight">{user?.username}</p>
							<p className="text-sm leading-tight opacity-50 flex-1">#{user?.discriminator}</p>
						</div>
					</div>

					<a href="https://github.com/fowled">
						<button className="bg-neutral-900 rounded-lg py-2 px-4 hover:bg-neutral-800">GitHub</button>
					</a>
				</div>

				<div className="bg-neutral-900 rounded-lg relative p-4">
					<div className="flex space-x-4 items-center">
						<div className="flex-shrink-0 relative">
							<img className="rounded-xl h-28 w-28" src={activity?.large_icon} />

							{activity?.small_icon && <img className="rounded-full h-6 w-6 ring-4 ring-gray-100 ring-opacity-20 absolute bottom-0 right-0" src={activity?.small_icon} />}
						</div>

						<div className="flex flex-col text-clip overflow-hidden space-y-1 self-center">
							<p className="font-semibold text-lg leading-tight truncate">{activity?.name}</p>

							<p className="text-base leading-tight truncate">{activity?.details}</p>

							<p className="text-base leading-tight truncate">{activity?.state}</p>

							{activity?.timestamp_start && !activity?.timestamp_end && <p className="text-base leading-tight truncate">{parseTimestamp("time")} elapsed</p>}
						</div>
					</div>

					{activity?.timestamp_end && (
						<div className="flex flex-col flex-0 flex-shrink-0 mt-3">
							<ProgressBar width={parseTimestamp("progress") + "%"} start={parseTimestamp("time") as string} end={parseTimestamp("time", true) as string} />
						</div>
					)}
				</div>
			</div>
		</div>
	) : (
		<Spinner />
	);
}

export default App;
