<script lang="ts">
	export let spotify: Lanyard["spotify"];

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
</script>

<div>
	<p class="uppercase font-bold text-xs">Listening to Spotify</p>

	<div class="flex flex-row items-center space-x-4 w-full !mt-2">
		<img src={spotify?.album_art_url} class={`w-[90px] h-[90px]`} alt="activity" />

		<div class="flex flex-col text-slate-200 text-sm w-full sm:w-5/12">
			<p class="font-semibold">{spotify?.song}</p>
			<p>by {spotify?.artist}</p>
			<p>on {spotify?.album}</p>

			<div class="flex flex-col space-y-1">
				<div class="w-full bg-[#471f61] rounded-full h-1 mt-2">
					<div style={`width: ${progress}%;`} class="h-1 bg-white rounded-full" />
				</div>

				<div class="flex flex-row justify-between text-xs">
					<p>{timestamp(duration - (end - counter))}</p>
					<p>{timestamp(duration)}</p>
				</div>
			</div>
		</div>
	</div>
</div>
