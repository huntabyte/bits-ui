<script lang="ts">
	import type { PopperLayerImplProps } from "./types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { EscapeLayer } from "$lib/bits/utilities/escape-layer/index.js";
	import { DismissableLayer } from "$lib/bits/utilities/dismissable-layer/index.js";
	import { TextSelectionLayer } from "$lib/bits/utilities/text-selection-layer/index.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { FocusScope } from "$lib/bits/utilities/focus-scope/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { popper, present, ...restProps }: PopperLayerImplProps = $props();
</script>

<PresenceLayer {present} {...restProps}>
	{#snippet presence({})}
		<FloatingLayer.Content {...restProps} enabled={present}>
			{#snippet content({ props: floatingProps })}
				<FocusScope {...restProps}>
					{#snippet focusScope({ props: focusScopeProps })}
						<EscapeLayer {...restProps} enabled={present}>
							<DismissableLayer {...restProps} enabled={present}>
								{#snippet children({ props: dismissableProps })}
									<TextSelectionLayer {...restProps} enabled={present}>
										{@render popper?.({
											props: mergeProps(
												restProps,
												floatingProps,
												dismissableProps,
												focusScopeProps,
												{
													style: {
														pointerEvents: "auto",
													},
												}
											),
										})}
									</TextSelectionLayer>
								{/snippet}
							</DismissableLayer>
						</EscapeLayer>
					{/snippet}
				</FocusScope>
			{/snippet}
		</FloatingLayer.Content>
	{/snippet}
</PresenceLayer>
