<script lang="ts" module>
	import { unstable_Drawer as Drawer, type WithoutChildrenOrChild } from "bits-ui";

	export type DrawerTestProps = Drawer.RootProps & {
		popupProps?: Omit<Drawer.PopupProps, "asChild" | "child" | "children">;
		portalProps?: Drawer.PortalProps;
		titleProps?: WithoutChildrenOrChild<Drawer.TitleProps>;
		descriptionProps?: WithoutChildrenOrChild<Drawer.DescriptionProps>;
	};
</script>

<script lang="ts">
	import { useId } from "bits-ui";

	let {
		open = false,
		popupProps = {},
		portalProps = {},
		titleProps = {},
		descriptionProps = {},
		...restProps
	}: DrawerTestProps = $props();

	let descriptionId = $state<string>(descriptionProps.id ?? useId());
</script>

<main>
	<Drawer.Root bind:open {...restProps}>
		<Drawer.Trigger data-testid="trigger">open</Drawer.Trigger>
		<Drawer.Portal {...portalProps}>
			<Drawer.Backdrop
				data-testid="backdrop"
				class="fixed inset-0 h-[100vh] w-[100vw] bg-black/60"
			/>
			<Drawer.Viewport data-testid="viewport" class="fixed inset-0 flex items-end">
				<Drawer.Popup
					{...popupProps}
					data-testid="popup"
					class="w-full rounded-t-xl bg-white p-4 shadow-lg"
				>
					<Drawer.Content data-testid="content">
						<Drawer.Title {...titleProps} data-testid="title">title</Drawer.Title>
						<Drawer.Description
							{...descriptionProps}
							id={descriptionId}
							data-testid="description"
						>
							description
						</Drawer.Description>
						<Drawer.Close data-testid="close">close</Drawer.Close>
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
