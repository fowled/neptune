<script lang="ts">
	import { onMount } from "svelte";

	import Activity from "@/components/Activity.svelte";
	import Spotify from "@/components/Spotify.svelte";
	import Spinner from "@/components/Spinner.svelte";

	import { Socket, lanyard } from "@/lib/websocket";
	import { snowflake } from "@/lib/snowflake";

	import { PUBLIC_ID } from "$env/static/public";

	import { Activities } from "@/types/lanyard";

	import "@/app.css";

	$: user = $lanyard?.discord_user;
	$: activities = $lanyard?.activities;
	$: spotify = $lanyard?.spotify;

	const badges = [
		{ name: "HypeSquad Bravery", icon: "hypesquad" },
		{ name: "Active Developer", icon: "active_dev" },
		{ name: "Early Verified Bot Developer", icon: "verified_dev" },
		{ name: "Nitro", icon: "nitro" },
		{ name: "Nitro Boost", icon: "boost" }
	];

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

	$: if (activeTab === "activity" && !activities) {
		activeTab = "info";
	}

	$: buttonStyle = (button: (typeof buttons)[number]) => {
		if (activeTab === button.name) {
			return "text-white border-b-2 border-separate pb-4";
		} else {
			return "text-gray-400";
		}
	};

	onMount(async () => {
		Socket();
	});
</script>

<svelte:head>
	<title>Neptune</title>
	<link rel="icon" href="/statuses/idle.png" />
</svelte:head>

{#if $lanyard}
	<div class="flex items-center min-h-screen bg-zinc-800 text-white">
		<div class="profile profile-gradient">
			<div class="relative">
				<img src="/banner.png" alt="banner" class="w-full h-full z-30 mask-banner" />

				<img
					src={`https://api.lanyard.rest/${PUBLIC_ID}.png`}
					class="rounded-full z-[60] absolute sm:top-[140px] left-[3.7vw] top-[23vw] sm:left-[24px] w-[20vw] h-[20vw] sm:w-[120px] sm:h-[120px] mx-auto"
					alt="pfp"
				/>

				<img
					src={`/statuses/${$lanyard.discord_status}.png`}
					class="w-8 h-8 sm:w-9 sm:h-9 absolute left-[18vw] -bottom-[9vw] sm:left-[108px] sm:-bottom-[50px] z-[70] bg-[#000000d0] p-[6px] rounded-full"
					alt="status"
				/>
			</div>

            <div class="relative">
                <div class="flex flex-row space-x-0.5 z-30 w-fit absolute right-5 sm:left-40 mt-4 bg-[#00000073] px-1 py-0.5 rounded-lg">
                    {#each badges as badge}
                        <img src={`/badges/${badge.icon}.svg`} alt={badge.name} />
                    {/each}
                </div>
            </div>

			<div class="content">
				<div class="text-xl font-semibold flex flex-row">
					<p>{user?.username}</p>
					<p class="text-gray-300">#{user?.discriminator}</p>
				</div>

				<div class="flex flex-row space-x-8 text-sm border-b-2 border-zinc-700">
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
							<p class="uppercase font-bold text-xs">{section.title}</p>
							<p class="text-sm text-gray-200">{@html section.content}</p>
						</div>
					{/each}

					<div class="min-w-full min-h-[1px] bg-zinc-700 !mt-8" />

					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
						{#each connections as connection}
							<div class="rounded-md p-3 items-center flex flex-row text-center border-zinc-700 border-[1px]">
								<img src={`/icons/${connection.icon}.svg`} alt={connection.name} class="w-6 h-6" />

								<p class="font-semibold ml-2 mr-1">{connection.username}</p>

								<img src="/icons/verified.svg" alt="verified tick" class="w-4 h-4" />

								<a href={connection.url} class="ml-auto">
									<img src="/icons/open_arrow.svg" alt="open arrow" class="w-2.5 h-2.5" />
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
					<form method="post" class="w-full flex flex-row items-center space-x-2">
						<input type="text" class="input" name="message" minlength="1" placeholder="hi!" required />
						<input
							type="submit"
							value="Send"
							class="cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-lg p-1.5"
						/>
					</form>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<Spinner />
{/if}
