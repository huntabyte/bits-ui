<script lang="ts" module>
	import { unstable_Drawer as Drawer, type WithoutChildrenOrChild } from "bits-ui";

	export type DrawerTestProps = Drawer.RootProps & {
		popupProps?: Omit<Drawer.PopupProps, "asChild" | "child" | "children">;
		portalProps?: Drawer.PortalProps;
		exitTransition?: boolean;
		scrollable?: boolean;
		titleProps?: WithoutChildrenOrChild<Drawer.TitleProps>;
		descriptionProps?: WithoutChildrenOrChild<Drawer.DescriptionProps>;
	};
</script>

<script lang="ts">
	import { untrack } from "svelte";

	let {
		open = false,
		popupProps = {},
		portalProps = {},
		exitTransition = false,
		scrollable = false,
		titleProps = {},
		descriptionProps = {},
		...restProps
	}: DrawerTestProps = $props();

	const uid = $props.id();
	let snapPoint = $state(untrack(() => restProps.snapPoint));
	let descriptionId = $state(untrack(() => descriptionProps.id ?? uid));
</script>

<main>
	<Drawer.Root {...restProps} bind:open bind:snapPoint>
		<Drawer.Trigger data-testid="trigger">open</Drawer.Trigger>
		<Drawer.SwipeArea
			data-testid="swipe-area"
			style="position: fixed; inset: auto 0 0; height: 24px;"
		/>
		<Drawer.Portal {...portalProps}>
			<Drawer.Backdrop
				data-testid="backdrop"
				style="position: fixed; inset: 0; background: rgb(0 0 0 / 60%);"
			/>
			<Drawer.Viewport
				data-testid="viewport"
				style="position: fixed; inset: 0; display: flex; align-items: end; pointer-events: none;"
			>
				<Drawer.Popup
					{...popupProps}
					data-testid="popup"
					class={[
						"w-full rounded-t-xl bg-white p-4 shadow-lg",
						exitTransition && "drawer-exit-transition",
					]}
				>
					<div data-testid="swipe-surface" style="height: 24px;" aria-hidden="true"></div>
					<Drawer.Content
						data-testid="content"
						style={scrollable ? "height: 96px; overflow-y: auto;" : undefined}
					>
						{#if scrollable}
							<div style="height: 300px;" aria-hidden="true"></div>
						{/if}
						<Drawer.Title {...titleProps} data-testid="title">title</Drawer.Title>
						<Drawer.Description
							{...descriptionProps}
							id={descriptionId}
							data-testid="description"
						>
							description
						</Drawer.Description>
						<Drawer.Close data-testid="close">close</Drawer.Close>
						{#if restProps.snapPoints}
							<button data-testid="expand" onclick={() => (snapPoint = 1)}
								>Expand</button
							>
							<output data-testid="snap-point">{snapPoint}</output>
						{/if}
						<button data-testid="update-id" onclick={() => (descriptionId = "new-id")}
							>Reactively update description id</button
						>
						<button data-testid="open-focus-override" id="open-focus-override"
							>open focus override</button
						>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" onclick={() => (open = !open)}>toggle</button>
	<button data-testid="close-focus-override" id="close-focus-override"
		>close focus override</button
	>
	<div data-testid="outside" style="bottom: 0px; right: 10px; position: absolute;">outside</div>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>

<style>
	:global(.drawer-exit-transition) {
		opacity: 1;
		transition: opacity 300ms;
	}

	:global(.drawer-exit-transition[data-ending-style]) {
		opacity: 0;
	}
</style>
