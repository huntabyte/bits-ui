<script lang="ts">
	import { CopyCodeButton } from "@/components";
	import { cn, createCopyCodeButton } from "@/utils";

	let className: string | undefined | null = undefined;
	export { className as class };

	const { copyCode, copied, setCodeString } = createCopyCodeButton();
</script>

<pre
	class={cn("mb-4 mt-6 overflow-x-auto rounded-lg border py-4 bg-accent", className)}
	use:setCodeString
	{...$$restProps}>
	<slot />
</pre>
<CopyCodeButton {copyCode} copied={$copied} class={cn("absolute right-4 top-4 pre-copy-btn")} />
