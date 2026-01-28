<script lang="ts">
	import { Checkbox } from "bits-ui";

	let {
		checked = false,
		onFormSubmit,
		...restProps
	}: Checkbox.RootProps & {
		onFormSubmit?: (fd: FormData) => void;
	} = $props();
</script>

<main>
	<form
		method="POST"
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			onFormSubmit?.(formData);
		}}
	>
		<p data-testid="binding">{checked}</p>
		<Checkbox.Root name="terms" data-testid="root" bind:checked {...restProps}>
			{#snippet children({ checked, indeterminate })}
				<span data-testid="indicator">
					{#if indeterminate}
						indeterminate
					{:else}
						{checked}
					{/if}
				</span>
			{/snippet}
		</Checkbox.Root>
		<button type="submit" data-testid="submit">Submit</button>
	</form>
</main>
