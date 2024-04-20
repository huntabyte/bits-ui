<script lang="ts">
	import type { PopperLayerProps } from "./index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { EscapeLayer } from "$lib/bits/utilities/escape-layer/index.js";
	import { DismissableLayer } from "$lib/bits/utilities/dismissable-layer/index.js";
	import { TextSelectionLayer } from "$lib/bits/utilities/text-selection-layer/index.js";
	import { Portal } from "$lib/bits/utilities/portal/index.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";

	let { popper, ...restProps }: PopperLayerProps = $props();
</script>

<Portal forceMount={true}>
	{#snippet portal({ portalProps })}
		<PresenceLayer {...restProps}>
			{#snippet presence({ present })}
				<FloatingLayer.Content
					{...restProps}
					wrapperId={portalProps.id}
					present={present.value}
				>
					{#snippet content({ props })}
						<EscapeLayer {...restProps} present={present.value}>
							<DismissableLayer {...restProps} present={present.value}>
								<TextSelectionLayer {...restProps} present={present.value}>
									{@render popper?.({
										props: {
											...props,
											hidden: present.value ? undefined : true,
										},
									})}
								</TextSelectionLayer>
							</DismissableLayer>
						</EscapeLayer>
					{/snippet}
				</FloatingLayer.Content>
			{/snippet}
		</PresenceLayer>
	{/snippet}
</Portal>
