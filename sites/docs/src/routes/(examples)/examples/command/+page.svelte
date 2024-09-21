<script lang="ts">
	import ThemeSwitcher from "$lib/components/examples/command/components/theme-switcher.svelte";
	import CommandWrapper from "$lib/components/examples/command/components/command-wrapper.svelte";
	import RaycastCommand from "$lib/components/examples/command/components/raycast/raycast-cmdk.svelte";

	// import { FramerCMDK, LinearCMDK, VercelCMDK } from "$docs/components/cmdk/index.js";

	let theme: "raycast" | "linear" | "vercel" | "framer" = $state("raycast");
</script>

<main class="main">
	<div class="content">
		<div style:height="475px">
			{#if theme === "raycast"}
				<CommandWrapper>
					<RaycastCommand />
				</CommandWrapper>
			{/if}
			<!-- {:else if theme === "linear"}
				<CommandWrapper>
					<LinearCMDK />
				</CommandWrapper>
			{:else if theme === "vercel"}
				<CommandWrapper>
					<VercelCMDK />
				</CommandWrapper>
			{:else if theme === "framer"}
				<CommandWrapper>
					<FramerCMDK />
				</CommandWrapper>
			{/if} -->
		</div>
		<ThemeSwitcher bind:theme />

		<div aria-hidden="true" class="line"></div>
	</div>
</main>
