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
	<div class="flex min-h-screen w-screen items-center justify-center bg-[#1e1f22] text-white">
		<Profile />
	</div>
{:else}
	<Spinner />
{/if}
