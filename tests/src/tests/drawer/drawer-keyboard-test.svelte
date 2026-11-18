<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";
	let { enabled }: { enabled?: boolean } = $props();
	let active = $state(true);
</script>

{#snippet drawer()}
	<Drawer.Root open>
		<Drawer.Viewport data-testid="viewport">
			<Drawer.Popup
				><Drawer.Title>Keyboard</Drawer.Title><Drawer.Description
					>Keyboard test</Drawer.Description
				><input aria-label="Name" /></Drawer.Popup
			>
		</Drawer.Viewport>
	</Drawer.Root>
{/snippet}
{#if enabled === undefined}
	{@render drawer()}
{:else}
	<Drawer.VirtualKeyboardProvider enabled={enabled && active}
		>{@render drawer()}</Drawer.VirtualKeyboardProvider
	>
{/if}
<button data-testid="disable-keyboard" onclick={() => (active = false)}
	>Disable keyboard handling</button
>
