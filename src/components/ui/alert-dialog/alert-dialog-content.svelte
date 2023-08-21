<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "@/lib";
	import * as AlertDialog from ".";
	import { cn } from "@/utils";
	import { fly, scale } from "svelte/transition";

	type $$Props = AlertDialogPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };

	function inTransition(node: HTMLElement, params: unknown) {}
	const some =
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]";
</script>

<AlertDialog.Portal>
	<AlertDialog.Overlay />
	<AlertDialogPrimitive.Content
		transition={scale}
		transitionConfig={{ start: 0.95, duration: 200, opacity: 0 }}
		class={cn(
			"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full",
			className
		)}
		{...$$restProps}
	>
		<slot />
	</AlertDialogPrimitive.Content>
</AlertDialog.Portal>
