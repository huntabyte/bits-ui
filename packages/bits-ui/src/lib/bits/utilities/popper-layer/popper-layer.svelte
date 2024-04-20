<script lang="ts">
	import type { Props } from "./index.js";
	import {
		DismissableLayer,
		EscapeLayer,
		FloatingLayer,
		Portal,
		PresenceLayer,
		PreventTextSelectionOverflowLayer,
	} from "$lib/bits/utilities/index.js";

	let { popper, ...restProps }: Props = $props();
</script>

<PresenceLayer.Root {...restProps}>
	{#snippet presence({ present })}
		<Portal.Root {...restProps}>
			<FloatingLayer.Content {...restProps} present={present.value}>
				{#snippet content({ props })}
					<EscapeLayer.Root {...restProps} present={present.value}>
						<DismissableLayer.Root {...restProps} present={present.value}>
							<PreventTextSelectionOverflowLayer.Root
								{...restProps}
								present={present.value}
							>
								{@render popper?.({
									props: {
										...props,
										hidden: present.value ? undefined : true,
									},
								})}
							</PreventTextSelectionOverflowLayer.Root>
						</DismissableLayer.Root>
					</EscapeLayer.Root>
				{/snippet}
			</FloatingLayer.Content>
		</Portal.Root>
	{/snippet}
</PresenceLayer.Root>
