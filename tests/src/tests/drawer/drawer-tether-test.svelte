<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const tether = Drawer.createTether<{ label: string }>();
	let open = $state(false);
</script>

<main data-testid="main">
	<div data-testid="detached-top">
		<Drawer.Trigger
			id="trigger-top"
			data-testid="trigger-top"
			{tether}
			payload={{ label: "Top" }}
		>
			Top
		</Drawer.Trigger>
	</div>

	<Drawer.Root {tether} bind:open>
		{#snippet children({ payload, triggerId })}
			<Drawer.Portal>
				<Drawer.Backdrop
					data-testid="backdrop"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black/60"
				/>
				<Drawer.Viewport data-testid="viewport" class="fixed inset-0 flex items-end">
					<Drawer.Popup
						data-testid="popup"
						class="w-full rounded-t-xl bg-white p-4 shadow-lg"
					>
						<Drawer.Content data-testid="content">
							<span data-testid="payload">{payload?.label ?? "null"}</span>
							<span data-testid="trigger-binding">{triggerId ?? "null"}</span>
							<Drawer.Close data-testid="close">close</Drawer.Close>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		{/snippet}
	</Drawer.Root>

	<div data-testid="detached-bottom">
		<Drawer.Trigger
			id="trigger-bottom"
			data-testid="trigger-bottom"
			{tether}
			payload={{ label: "Bottom" }}
		>
			Bottom
		</Drawer.Trigger>
	</div>

	<button data-testid="tether-open-top" onclick={() => tether.open("trigger-top")}>
		Open top
	</button>
	<button data-testid="tether-open-bottom" onclick={() => tether.open("trigger-bottom")}>
		Open bottom
	</button>
	<button data-testid="tether-close" onclick={() => tether.close()}> Close tether </button>
	<button data-testid="tether-open-invalid" onclick={() => tether.open("not-registered")}>
		Open invalid id
	</button>
	<button
		data-testid="tether-open-with-payload"
		onclick={() => tether.openWithPayload({ label: "Solo" })}
	>
		Open with payload only
	</button>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="outside">outside</div>
</main>
