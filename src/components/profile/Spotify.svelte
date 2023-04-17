<script lang="ts">
	import Tooltip from "@/components/shared/Tooltip.svelte";

	import { timestamp } from "@/lib/timestamp";

	import type { Lanyard } from "@/types/lanyard";

	let counter = Date.now();

	setInterval(() => {
		counter = Date.now();
	}, 1000);

	$: start = spotify?.timestamps.start!;
	$: end = spotify?.timestamps.end!;

	$: duration = end - start;
	$: progress = (1 - (end - counter) / duration) * 100;

	let coverTooltip;

	export let spotify: Lanyard["spotify"];
</script>

<div>
	<p class="text-xs font-bold uppercase">Listening to Spotify</p>

	<div class="!mt-2 flex w-full flex-row items-center space-x-4">
		<div>
			<img src={spotify?.album_art_url} class="h-[90px] w-[90px] cursor-pointer" alt="activity" bind:this={coverTooltip} />
			<Tooltip el={coverTooltip} direction="top" top={45} content={spotify?.album ?? "Spotify"} />
		</div>

		<div class="flex w-full flex-col overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-slate-200 sm:w-5/12">
			<p class="font-semibold">{spotify?.song}</p>
			<p>by {spotify?.artist}</p>
			<p>on {spotify?.album}</p>

			<div class="flex flex-col space-y-1">
				<div class="mt-2 h-1 w-full rounded-full bg-[#471f61]">
					<div style={`width: ${progress}%;`} class="h-1 rounded-full bg-white" />
				</div>

				<div class="flex flex-row justify-between text-xs">
					<p>{timestamp(duration - (end - counter))}</p>
					<p>{timestamp(duration)}</p>
				</div>
			</div>
		</div>
	</div>
</div>
