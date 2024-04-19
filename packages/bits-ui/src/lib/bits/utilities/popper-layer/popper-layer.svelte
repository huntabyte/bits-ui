<script lang="ts">
	import type { Props } from "./index.js";
	import {
		DismissableLayer,
		EscapeLayer,
		FloatingLayer,
		PresenceLayer,
		PreventTextSelectionOverflowLayer,
	} from "$lib/bits/utilities/index.js";

	let { popper, ...restProps }: Props = $props();
</script>

<PresenceLayer.Root {...restProps}>
	{#snippet presence({ present })}
		<FloatingLayer.Content {...restProps}>
			{#snippet content({ props })}
				<EscapeLayer.Root {...restProps}>
					<DismissableLayer.Root {...restProps}>
						<PreventTextSelectionOverflowLayer.Root {...restProps}>
							{@render popper?.({
								props: { ...props, hidden: present.value ? undefined : true },
							})}
						</PreventTextSelectionOverflowLayer.Root>
					</DismissableLayer.Root>
				</EscapeLayer.Root>
			{/snippet}
		</FloatingLayer.Content>
	{/snippet}
</PresenceLayer.Root>
