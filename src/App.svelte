<script lang="ts">
	import { Twitter, Github } from "@steeze-ui/feather-icons"; // icons
	import { BookOpen } from "@steeze-ui/heroicons";
	import { Icon } from "@steeze-ui/svelte-icon";

	import { onMount } from "svelte"; // svelte

	import utc from "dayjs/plugin/utc"; // dayjs
	import dayjs from "dayjs";

	import ProgressBar from "./components/ProgressBar.svelte"; // components
	import Spinner from "./components/Spinner.svelte";

	import type { SocketMessage, DiscordUser, Card, Repository } from "./types/interfaces"; // types
	import { ActivityType, Op } from "./types/enums";

	const socials = [
		{ icon: Twitter, href: "https://twitter.com/binksfowled" },
		{ icon: Github, href: "https://github.com/fowled" },
	];

	const repositoryLanguageEmoji = {
		TypeScript: "🔵",
		Svelte: "🟠",
	};

	let heartbeat: NodeJS.Timeout,
		user: DiscordUser,
		activity: Card,
		timestamps: { start: number; end: number },
		repositories: Repository[] = [];

	if (heartbeat) {
		clearInterval(heartbeat);
	}

	dayjs.extend(utc);

	const ws = new WebSocket("wss://api.lanyard.rest/socket");

	ws.addEventListener("open", () => {
		console.log("[WebSocket] connection opened");
	});

	ws.addEventListener("close", () => {
		console.log("[WebSocket] connection closed");
	});

	ws.addEventListener("message", (event) => {
		const data: SocketMessage = JSON.parse(event.data);

		if (data.op === Op.Hello) {
			heartbeat = setInterval(() => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify({ op: Op.Heartbeat }));
				}
			}, data.d?.heartbeat_interval);

			if (ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						op: Op.Initialize,
						d: { subscribe_to_id: "352158391038377984" },
					}),
				);
			}
		}

		if (data.op === Op.Event) {
			user = data.d.discord_user;

			if (data.d.activities[0]?.type === 4) {
				data.d.activities.shift(); // if activity is a custom status
			}

			const currentActivity = data.d.activities[0];

			switch (currentActivity?.type) {
				case ActivityType.Spotify:
					const spotify = data.d.spotify!;

					activity = {
						status: data.d.discord_status,
						name: spotify.song,
						details: `by ${spotify.artist}`,
						large_icon: spotify.album_art_url,
						small_icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Spotify_App_Logo.svg",
						state: `on ${spotify.album}`,
						timestamp_start: spotify.timestamps.start,
						timestamp_end: spotify.timestamps.end,
						elapsed: spotify.timestamps.start,
					};

					break;

				case ActivityType.Lambda:
					activity = {
						status: data.d.discord_status,
						name: currentActivity.name,
						details: currentActivity.details,
						large_icon: currentActivity.assets?.large_image ? `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}` : "covers/game.svg",
						small_icon: currentActivity.assets?.small_image ? `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}` : null,
						state: currentActivity.state,
						timestamp_start: currentActivity.timestamps?.start || null,
						elapsed: currentActivity.timestamps?.start || null,
					};

					break;

				default:
					activity = {
						status: data.d.discord_status,
						name: "Idling",
						details: "I'm currently AFK/offline",
						large_icon: "covers/idle.png",
						state: "I'll be right back!",
					};

					break;
			}

			(function addElapsedTime() {
				if (!activity) return;

				activity.elapsed = activity.elapsed + 1;

				timestamps = {
					start: Date.now() - activity.elapsed,
					end: activity.timestamp_end - activity.timestamp_start,
				};

				setTimeout(addElapsedTime, 1000);
			})();
		}
	});

	onMount(async () => {
		let reposToFetch = ["addmango/mango", "fowled/discord.ts", "fowled/scratchlib", "fowled/sapphire"];

		for (const repo of reposToFetch) {
			let data: Repository = await fetch(`https://api.github.com/repos/${repo}`).then((res) => res.json());

			repositories = [...repositories, data];
		}
	});
</script>

{#if user && repositories}
	<div class="flex bg-black text-white h-full">
		<div class="flex flex-col mx-auto my-20 w-[24.5rem] space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex space-x-2 items-center">
					<div class="relative">
						<img alt="avatar" class="rounded-full h-14 w-14 shadow-lg" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`} />
						<img alt={activity.status} class="w-7 absolute -bottom-1 -right-1 shadow-sm bg-black rounded-full" src={`statuses/${activity.status}.png`} />
					</div>

					<div>
						<p class="font-semibold text-xl leading-tight">{user.username}</p>
						<p class="text-sm leading-tight opacity-50 flex-1">#{user.discriminator}</p>
					</div>
				</div>

				<div class="flex flex-row space-x-2">
					{#each socials as social}
						<a href={social.href} class="bg-neutral-900 rounded-full p-2">
							<Icon src={social.icon} class="m-auto w-6 h-6 text-neutral-200" />
						</a>
					{/each}
				</div>
			</div>

			<div class="bg-neutral-900 rounded-lg relative p-4">
				<p>🖖 Hey, I'm <code>@fowled</code>. TypeScript and Svelte worshipper, proud owner of a dog.</p>
			</div>

			{#if activity}
				<div class="bg-neutral-900 rounded-lg relative p-4">
					<div class="flex space-x-4 items-center">
						<div class="flex-shrink-0 relative">
							<img alt="large activity icon" class="rounded-xl h-24 w-24" src={activity.large_icon} />

							{#if activity.small_icon}
								<img alt="small activity icon" src={activity.small_icon} class="rounded-full h-6 w-6 ring-4 ring-gray-100 ring-opacity-20 absolute bottom-0 right-0" />
							{/if}
						</div>

						<div class="flex flex-col text-clip overflow-hidden space-y-1 self-center">
							<p class="font-semibold text-lg leading-tight truncate">{activity.name}</p>

							{#if activity.details}
								<p class="text-base leading-tight truncate">{activity.details}</p>
							{/if}

							{#if activity.state}
								<p class="text-base leading-tight truncate">{activity.state}</p>
							{/if}

							{#if activity.timestamp_start && !activity.timestamp_end}
								<p class="text-base leading-tight truncate">{dayjs.utc(timestamps?.start).format("HH:mm:ss")} elapsed</p>
							{/if}
						</div>
					</div>

					{#if activity.timestamp_end}
						<div class="flex flex-col flex-0 flex-shrink-0 mt-3">
							<ProgressBar width={(timestamps?.start / timestamps?.end) * 100 + "%"} start={dayjs.utc(timestamps?.start).format("mm:ss")} end={dayjs.utc(timestamps?.end).format("mm:ss")} />
						</div>
					{/if}
				</div>
			{/if}

			<span class="mx-auto leading-[0.5]">•••</span>

			{#each repositories as repository}
				<div class="bg-neutral-900 rounded-lg relative p-4 space-y-1.5">
					<div class="flex flex-row space-x-1.5">
						<Icon src={BookOpen} class="w-6 h-6 text-neutral-400" />

						<a class="text-blue-400 font-semibold" href={repository.html_url}>{repository.name}</a>
					</div>

					<p class="text-base">{repository.description}</p>

					<div class="flex flex-row space-x-2">
						{repositoryLanguageEmoji[repository.language]} {repository.language} - ⭐{repository.stargazers_count}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<Spinner />
{/if}
