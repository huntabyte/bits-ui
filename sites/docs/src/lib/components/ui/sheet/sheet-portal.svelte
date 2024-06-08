<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	let { ...restProps }: SheetPrimitive.PortalProps = $props();

	type $$Props = SheetPrimitive.PortalProps;
</script>

<SheetPrimitive.Portal {...restProps} />
