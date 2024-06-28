<script lang="ts">
	import { onMount } from "svelte";

	import Servers from "@/components/sidebars/Servers.svelte";
	import Profile from "@/components/profile/Profile.svelte";
	import Spinner from "@/components/shared/Spinner.svelte";

	import { Socket, lanyard } from "@/lib/websocket";

	onMount(async () => {
		Socket();
	});
</script>

<div class="flex h-screen w-screen items-center justify-center bg-[url('/wallpaper.jpg')] bg-cover text-white">
	{#if $lanyard}
		<Profile />
	{:else}
		<Spinner />
	{/if}
</div>
