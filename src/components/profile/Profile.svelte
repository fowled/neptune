<script lang="ts">
	import { PaperAirplane, Icon } from "svelte-hero-icons";

	import Activity from "@/components/profile/Activity.svelte";
	import Spotify from "@/components/profile/Spotify.svelte";
	import Tooltip from "@/components/shared/Tooltip.svelte";

	import { snowflake } from "@/lib/snowflake";
	import { lanyard } from "@/lib/websocket";
	import { getBadges } from "@/lib/flags";

	import { capitalize } from "@/utils/capitalize";

	import { PUBLIC_ID } from "$env/static/public";

	import { Activities } from "@/types/lanyard";

	import "@/app.css";

	$: user = $lanyard?.discord_user;
	$: activities = $lanyard?.activities;
	$: spotify = $lanyard?.spotify;

	$: buttons = [
		{ name: "info", label: "User Info" },
		{ name: "activity", label: "Activity", enabled: activities?.length > 0 ? true : false },
		{ name: "message", label: "Send message" }
	];

	$: sections = [
		{ title: "About me", content: "TypeScript enthusiast. Owns <b>@Mango</b>." },
		{ title: "Discord member since", content: snowflake(parseInt(user?.id)) },
		{ title: "Note", content: "Did you know you can send me a message directly from this website?" }
	];

	const connections = [
		{ name: "Telegram", icon: "telegram", username: "fowled", url: "https://t.me/fowled" },
		{ name: "Twitter", icon: "twitter", username: "fowledsucks", url: "https://twitter.com/fowledsucks" },
		{ name: "GitHub", icon: "github", username: "fowled", url: "https://github.com/fowled" }
	];

	let activeTab = "info";

	$: if (activeTab === "activity" && activities.length === 0) {
		activeTab = "info";
	}

	$: buttonStyle = (button: (typeof buttons)[number]) => {
		if (activeTab === button.name) {
			return "text-white border-b-2 border-separate pb-4";
		} else {
			return "text-gray-400";
		}
	};

	type Tooltips = {
		badges: HTMLElement[];
		connections: HTMLElement[];
		status?: HTMLElement;
	};

	let tooltips: Tooltips = {
		badges: [] as HTMLElement[],
		connections: [] as HTMLElement[]
	};
</script>

<svelte:head>
	<title>fowled.dev</title>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div
	class="profile-gradient relative m-auto flex max-h-[650px] w-[38rem] flex-col rounded-lg p-1 pb-6 before:absolute before:h-[calc(100%-8px)] before:w-[calc(100%-8px)] before:rounded-lg before:bg-[#0009]"
>
	<div class="relative">
		<img src="/banner.png" alt="banner" class="mask-banner z-[1] h-full w-full" />

		<img
			src="https://api.lanyard.rest/{PUBLIC_ID}.png"
			class="absolute left-[3.7vw] top-[23vw] z-[2] mx-auto h-[20vw] w-[20vw] rounded-full sm:top-[140px] sm:left-[24px] sm:h-[120px] sm:w-[120px]"
			alt="pfp"
		/>

		<img
			src="/statuses/{$lanyard.discord_status}.png"
			class="absolute left-[18vw] -bottom-[9vw] z-[2] h-7 w-7 rounded-full bg-[#000000d0] p-[6px] sm:left-[108px] sm:-bottom-[50px] sm:h-9 sm:w-9"
			alt="status"
			bind:this={tooltips.status}
		/>

		<Tooltip el={tooltips.status} content={capitalize($lanyard.discord_status)} direction="top" top={45} />
	</div>

	<div class="relative pb-16">
		<div class="absolute right-5 z-[2] mt-4 flex w-fit flex-row space-x-0.5 rounded-lg bg-[#00000073] px-1 py-0.5 sm:left-40">
			{#each getBadges(user.public_flags) as badge, i}
				<div class="cursor-pointer">
					<img src="/badges/{badge.name}.svg" alt={badge.name} bind:this={tooltips.badges[i]} />
					<Tooltip el={tooltips.badges[i]} content={badge.display} direction="top" top={45} />
				</div>
			{/each}
		</div>
	</div>

	<div
		class="scrollbar-stable scrollbar test z-[3] mx-auto flex min-h-full w-[93%] flex-col space-y-4 overflow-y-hidden rounded-lg bg-[#00000073] p-3 hover:overflow-y-scroll"
	>
		<div class="flex flex-row text-xl font-semibold">
			<p>{user?.username}</p>
			<p class="text-gray-300">#{user?.discriminator}</p>
		</div>

		<div class="flex flex-row space-x-8 border-b-2 border-zinc-700 text-sm">
			{#each buttons as button}
				{#if button.enabled !== false}
					<div>
						<button class={buttonStyle(button)} on:click={() => (activeTab = button.name)}>
							{button.label}
						</button>
					</div>
				{/if}
			{/each}
		</div>

		{#if activeTab === "info"}
			{#each sections as section}
				<div class="flex flex-col space-y-1.5">
					<p class="text-xs font-bold uppercase">{section.title}</p>
					<p class="text-sm text-gray-200">{@html section.content}</p>
				</div>
			{/each}

			<span class="!mt-8 min-h-[1px] min-w-full bg-zinc-700" />

			<div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
				{#each connections as connection, i}
					<div class="flex flex-row items-center rounded-md border-[1px] border-zinc-700 p-3 text-center">
						<img src="/icons/{connection.icon}.svg" alt={connection.name} class="h-6 w-6" />

						<p class="ml-2 mr-1 font-semibold">{connection.username}</p>

						<img src="/icons/verified.svg" alt="tick" class="h-4 w-4" bind:this={tooltips.connections[i]} />

						<Tooltip el={tooltips.connections[i]} direction="top" content="Verified Connection" top={45} />

						<a href={connection.url} class="ml-auto">
							<img src="/icons/open_arrow.svg" alt="open arrow" class="h-2.5 w-2.5" />
						</a>
					</div>
				{/each}
			</div>
		{:else if activeTab === "activity"}
			{#each $lanyard.activities as activity}
				{#if activity.type === Activities.Spotify}
					<Spotify {spotify} />
				{:else if activity.type === Activities.Game}
					<Activity {activity} />
				{/if}
			{/each}
		{:else if activeTab === "message"}
			<form method="post" class="flex w-full flex-row items-center space-x-2">
				<input
					class="h-10 w-full rounded-lg bg-black p-3 text-sm outline-none placeholder:text-zinc-500 focus:outline-violet-600"
					name="message"
					placeholder="hi!"
					required
				/>

				<button type="submit" class="cursor-pointer rounded-lg bg-purple-500 p-1.5 hover:bg-purple-700">
					<Icon class="h-6 w-6" src={PaperAirplane} />
				</button>
			</form>
		{/if}
	</div>
</div>
