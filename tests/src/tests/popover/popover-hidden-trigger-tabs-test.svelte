<script lang="ts">
	import { Popover } from "bits-ui";

	type Tab = "popover" | "other";

	let activeTab = $state<Tab>("popover");
	let open = $state(false);
</script>

<main
	data-testid="main"
	style="display: flex; flex-direction: column; gap: 24px; padding-top: 72px; padding-left: 72px;"
>
	<div role="tablist" aria-label="popover hidden trigger test tabs">
		<button
			role="tab"
			data-testid="tab-popover"
			aria-selected={activeTab === "popover"}
			aria-controls="popover-panel"
			onclick={() => (activeTab = "popover")}
		>
			Popover Tab
		</button>
		<button
			role="tab"
			data-testid="tab-other"
			aria-selected={activeTab === "other"}
			aria-controls="other-panel"
			onclick={() => (activeTab = "other")}
		>
			Other Tab
		</button>
	</div>

	<div
		id="popover-panel"
		role="tabpanel"
		hidden={activeTab !== "popover"}
		data-testid="panel-popover"
		style="padding-top: 120px; padding-left: 220px;"
	>
		<Popover.Root bind:open>
			<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content data-testid="content">
					content
					<Popover.Close data-testid="close">close</Popover.Close>
					<Popover.Arrow data-testid="arrow" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</div>

	<div id="other-panel" role="tabpanel" hidden={activeTab !== "other"} data-testid="panel-other">
		<div data-testid="outside">outside panel</div>
	</div>

	<div data-testid="open-binding">{open ? "true" : "false"}</div>
</main>
