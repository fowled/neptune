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

{#if $lanyard}
	<div class="flex w-screen items-center text-white h-screen bg-cover justify-center bg-[url('/wallpaper.jpg')]">
		<!-- <div class="flex-1">
			<Servers />
		</div> -->

		<Profile />

		<!-- <div class="flex-1" /> -->
	</div>
{:else}
	<Spinner />
{/if}
