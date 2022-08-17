<script lang="ts">
	export let width: string, start: string, end: string;
</script>

<div class="flex justify-between text-sm mb-2">
	<p>{start}</p>
	<p>{end}</p>
</div>

<div class="w-full bg-black rounded-full h-1.5">
	<div class="bg-white h-1.5 rounded-full" style="width: {width};" />
</div>
