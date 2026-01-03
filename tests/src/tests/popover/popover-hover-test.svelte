<script lang="ts" module>
	import { Popover } from "bits-ui";
	export type PopoverHoverTestProps = Popover.RootProps & {
		triggerProps?: Omit<Popover.TriggerProps, "asChild" | "child" | "children">;
		contentProps?: Omit<Popover.ContentProps, "asChild" | "child" | "children">;
	};
</script>

<script lang="ts">
	let {
		open = $bindable(false),
		triggerProps,
		contentProps,
		...restProps
	}: PopoverHoverTestProps = $props();
</script>

<main data-testid="main" style="display: flex; flex-direction: column; gap: 200px; padding: 20px;">
	<div>
		<Popover.Root bind:open {...restProps}>
			<Popover.Trigger data-testid="trigger" {...triggerProps}>trigger</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content {...contentProps} data-testid="content">
					<div data-testid="content-text">content</div>
					<button data-testid="focusable-button">focusable button</button>
					<input data-testid="focusable-input" type="text" placeholder="input" />
					<Popover.Close data-testid="close">close</Popover.Close>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>

		<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	</div>

	<div data-testid="outside" style="padding: 20px; background: #eee;">outside</div>
</main>
