<script lang="ts">
	import { Dialog as DialogPrimitive } from "@/lib";

	type $$Props = DialogPrimitive.PortalProps;
</script>

<DialogPrimitive.Portal {...$$restProps}>
	<slot />
</DialogPrimitive.Portal>
