<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "@/lib";

	type $$Props = AlertDialogPrimitive.PortalProps;
</script>

<AlertDialogPrimitive.Portal {...$$restProps}>
	<slot />
</AlertDialogPrimitive.Portal>
