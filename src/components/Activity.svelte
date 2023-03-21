<script lang="ts">
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

	export let activity: Lanyard["activities"][number];
</script>

<div>
	<p class="uppercase font-bold text-xs">Playing a game</p>

	<div class="flex flex-row items-center space-x-4 !mt-2">
		<div class="relative">
			<img
				src={convert(activity, "large")}
				class={`w-[90px] h-[90px] rounded-xl ${activity?.assets?.small_image && "mask-game"}`}
				alt="activity"
			/>

			{#if activity.assets?.small_image}
				<img
					src={convert(activity, "small")}
					class="w-8 h-8 rounded-full absolute -bottom-[6%] -right-[6%]"
					alt="activity"
				/>
			{/if}
		</div>

		<div class="flex flex-col text-slate-200 text-sm">
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
