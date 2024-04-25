<script lang="ts">
	import type { PopperLayerImplProps } from "./types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { EscapeLayer } from "$lib/bits/utilities/escape-layer/index.js";
	import { DismissableLayer } from "$lib/bits/utilities/dismissable-layer/index.js";
	import { TextSelectionLayer } from "$lib/bits/utilities/text-selection-layer/index.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { FocusScope } from "$lib/bits/utilities/focus-scope/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { popper, ...restProps }: PopperLayerImplProps = $props();
</script>

<PresenceLayer {...restProps}>
	{#snippet presence({ present })}
		<FloatingLayer.Content {...restProps} present={present.value}>
			{#snippet content({ props })}
				<FocusScope {...restProps}>
					{#snippet focusScope({ props: focusScopeProps })}
						<EscapeLayer {...restProps} present={present.value}>
							<DismissableLayer {...restProps} present={present.value}>
								<TextSelectionLayer {...restProps} present={present.value}>
									{@render popper?.({
										props: mergeProps(props, focusScopeProps, {
											style: {
												pointerEvents: "auto",
											},
										}),
									})}
								</TextSelectionLayer>
							</DismissableLayer>
						</EscapeLayer>
					{/snippet}
				</FocusScope>
			{/snippet}
		</FloatingLayer.Content>
	{/snippet}
</PresenceLayer>
