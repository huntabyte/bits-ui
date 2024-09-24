<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { REGEXP_ONLY_DIGITS, usePinInput } from "../pin-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		inputId = useId(),
		ref = $bindable(null),
		maxlength = 6,
		textalign = "left",
		pattern = REGEXP_ONLY_DIGITS,
		inputmode = "numeric",
		onComplete = noop,
		pushPasswordManagerStrategy = "increase-width",
		class: containerClass = "",
		children,
		autocomplete = "one-time-code",
		disabled = false,
		value = $bindable(""),
		onValueChange = noop,
		...restProps
	}: RootProps = $props();

	const rootState = usePinInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		inputId: box.with(() => inputId),
		autocomplete: box.with(() => autocomplete),
		maxLength: box.with(() => maxlength),
		textAlign: box.with(() => textalign),
		disabled: box.with(() => disabled),
		inputmode: box.with(() => inputmode),
		pattern: box.with(() => pattern),
		onComplete: box.with(() => onComplete),
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}
		),
		pushPasswordManagerStrategy: box.with(() => pushPasswordManagerStrategy),
	});

	const mergedInputProps = $derived(mergeProps(restProps, rootState.inputProps));
	const mergedRootProps = $derived(mergeProps(rootState.rootProps, { class: containerClass }));
	const mergedInputWrapperProps = $derived(mergeProps(rootState.inputWrapperProps, {}));
</script>

<div {...mergedRootProps}>
	{@render children?.(rootState.snippetProps)}

	<div {...mergedInputWrapperProps}>
		<input {...mergedInputProps} />
	</div>
</div>
