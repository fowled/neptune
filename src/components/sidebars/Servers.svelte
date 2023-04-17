<script lang="ts">
	import { Briefcase, Icon, UserCircle, CodeBracketSquare, Plus, MapPin } from "svelte-hero-icons";

	import Tooltip from "@/components/shared/Tooltip.svelte";

	const guilds = [
		{ name: "About", icon: UserCircle, color: "#36b1eb" },
		{ name: "Projects", icon: Briefcase, color: "#7958cc" },
		{ name: "Code", icon: CodeBracketSquare, color: "#36eb39" },
		{ name: "Add a server", icon: Plus, color: "#659f67", special: true },
		{ name: "Explore Public Servers", icon: MapPin, color: "#659f67", special: true }
	];

	let server = "home";

	let tooltips: HTMLElement[] = [];

	const serverClick = (name: string) => (server = name);
</script>

<div class="flex min-h-screen w-[72px] flex-col space-y-2 px-2.5 py-3">
	<div class="server" bind:this={tooltips[0]}>
		<img src="/icons/discord.svg" alt="Discord" class="mx-auto flex" />
		<Tooltip content="fowled.dev" direction="right" class="!text-base font-semibold" el={tooltips[0]} left={70} />
	</div>

	<span class="mx-auto h-0.5 w-7/12 rounded-lg bg-[#4e50587a]" />

	{#each guilds as { special, icon, color, name }, i}
		<button class:special class="server group relative" bind:this={tooltips[i + 1]} on:click={() => serverClick}>
			<span
				class="pointer-events-none absolute left-0 top-1/2 -ml-3 h-5 w-[5px] -translate-y-1/2 rounded-xl bg-white opacity-0 transition group-hover:opacity-100"
			/>

			<Icon src={icon} class="group-hover:!fill-white" style="fill: {color};" solid />
			<Tooltip content={name} direction="right" class="!text-base font-semibold" left={70} el={tooltips[i + 1]} />
		</button>
	{/each}
</div>

<style lang="scss">
	.special:hover {
		background-color: #659f67 !important;
	}

	.server {
		border-radius: 50%;
		background-color: #2b2d31;
		padding: 0.75rem;
		color: white;
		transition: all 0.1s linear;

		&:hover {
			cursor: pointer;
			border-radius: 1rem;
			background-color: #5a65ea;
			color: white;
		}

		&:active {
			position: relative;
			top: 2px;
		}
	}
</style>
