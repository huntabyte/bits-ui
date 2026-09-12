<script lang="ts">
	import { flushSync } from "svelte";
	import { DropdownMenu } from "bits-ui";

	let { mode = "single" }: { mode?: "single" | "opening" } = $props();

	let open = $state(mode !== "opening");
	let revision = $state(0);
	let contentVersion = $state(0);
	let dismissals = $state(0);

	function rerenderDuringOutsidePointerdown() {
		revision += 1;
		flushSync();
	}

	function openDuringPointerdown() {
		open = true;
		flushSync();
	}
</script>

<button data-testid="open-during-pointerdown" onpointerdown={openDuringPointerdown}> open </button>
<DropdownMenu.Root bind:open>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			style={`--registration-revision: ${revision}`}
			onInteractOutside={() => (dismissals += 1)}
		>
			{#snippet child({ props })}
				{#key contentVersion}
					<div {...props} data-testid="layer">
						<button
							data-testid="replace-ref"
							onpointerdown={() => (contentVersion += 1)}
						>
							replace
						</button>
						<output data-testid="revision">{revision}</output>
					</div>
				{/key}
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
<button data-testid="rerender-outside" onpointerdown={rerenderDuringOutsidePointerdown}>
	rerender outside
</button>
<button data-testid="intercepted-outside" onpointerdown={(event) => event.stopPropagation()}>
	intercepted outside
</button>
<button data-testid="outside">outside</button>
<button
	data-testid="disable"
	onclick={() => {
		open = false;
		flushSync();
	}}>disable</button
>
<output data-testid="dismissals">{dismissals}</output>
<output data-testid="revision-count">{revision}</output>
