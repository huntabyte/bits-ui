<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const tether = Drawer.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<main data-testid="main">
	<Drawer.Root {tether} bind:open bind:triggerId>
		{#snippet children({ payload, triggerId: tid })}
			<Drawer.Trigger
				id="trigger-1"
				data-testid="trigger-1"
				{tether}
				payload={{ label: "One" }}
			>
				One
			</Drawer.Trigger>
			<Drawer.Trigger
				id="trigger-2"
				data-testid="trigger-2"
				{tether}
				payload={{ label: "Two" }}
			>
				Two
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop
					data-testid="backdrop"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black/60"
				/>
				<Drawer.Viewport data-testid="viewport" class="fixed inset-0 flex items-end">
					<Drawer.Popup
						data-testid="popup"
						class="w-full rounded-t-xl bg-white p-4 shadow-lg"
						interactOutsideBehavior="ignore"
					>
						<Drawer.Content data-testid="content">
							<span data-testid="payload">{payload?.label ?? "null"}</span>
							<span data-testid="trigger-binding">{tid ?? "null"}</span>
							<Drawer.Close data-testid="close">close</Drawer.Close>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		{/snippet}
	</Drawer.Root>

	<button
		data-testid="open-trigger-1"
		onclick={() => {
			triggerId = "trigger-1";
			open = true;
		}}
	>
		Open Trigger 1
	</button>
	<button
		data-testid="open-trigger-2"
		onclick={() => {
			triggerId = "trigger-2";
			open = true;
		}}
	>
		Open Trigger 2
	</button>
	<button
		data-testid="set-null-trigger"
		onclick={() => {
			triggerId = null;
		}}
	>
		Set null trigger
	</button>
	<button
		data-testid="close"
		onclick={() => {
			open = false;
		}}
	>
		Close
	</button>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="outside">outside</div>
</main>
