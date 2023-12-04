<script lang="ts">
	import { CopyCodeButton } from "@/components";
	import { cn, createCopyCodeButton } from "@/utils";

	let className: string | undefined | null = undefined;
	export { className as class };

	const { copyCode, copied, setCodeString } = createCopyCodeButton();
</script>

<pre
	class={cn(
		"mb-4 mt-6 overflow-x-auto rounded-card border-2 border-muted py-4",
		className
	)}
	use:setCodeString
	{...$$restProps}>
	<slot />
	<CopyCodeButton
		{copyCode}
		copied={$copied}
		class={cn("pre-copy-btn absolute right-4 top-4")}
	/>
</pre>
