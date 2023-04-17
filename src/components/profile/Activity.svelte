<script lang="ts">
	import Tooltip from "@/components/shared/Tooltip.svelte";

	import { timestamp } from "@/lib/timestamp";
	import { convert } from "@/lib/extImages";

	import type { Lanyard } from "@/types/lanyard";

	$: counter = new Date().getTime() - new Date(activity?.timestamps?.start ?? 0).getTime();

	let interval: NodeJS.Timer;

	$: if (activity?.created_at) {
		clearInterval(interval);

		interval = setInterval(() => {
			counter += 1000;
		}, 1000);
	}

	let tooltips: HTMLElement[] = [];

	export let activity: Lanyard["activities"][number];
</script>

<div>
	<p class="text-xs font-bold uppercase">Playing a game</p>

	<div class="!mt-2 flex flex-row items-center space-x-4">
		<div class="relative">
			{#if activity?.assets?.large_image}
				<img
					src={convert(activity, "large")}
					class="h-[90px] w-[90px] rounded-xl {activity?.assets?.small_image && 'mask-game'}"
					alt="activity"
					bind:this={tooltips[0]}
				/>

				{#if activity?.assets?.large_text}
					<Tooltip content={activity?.assets?.large_text} direction="top" top={45} el={tooltips[0]} />
				{/if}
			{/if}

			{#if activity.assets?.small_image}
				<img
					src={convert(activity, "small")}
					class="absolute -bottom-[6%] -right-[6%] h-8 w-8 rounded-full"
					alt="activity"
					bind:this={tooltips[1]}
				/>

				{#if activity?.assets?.small_text}
					<Tooltip content={activity?.assets?.small_text} direction="top" top={45} el={tooltips[1]} />
				{/if}
			{/if}
		</div>

		<div class="flex flex-col overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-slate-200">
			<p class="font-semibold">{activity.name}</p>

			{#if activity?.details}
				<p>{activity.details}</p>
			{/if}

			{#if activity?.state}
				<p>{activity.state}</p>
			{/if}

			{#if activity?.timestamps?.start}
				<p>{timestamp(counter)} elapsed</p>
			{/if}
		</div>
	</div>
</div>
