<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { PinInputRootProps } from "../types.js";
	import { PinInputRootState } from "../pin-input.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		inputId = `${createId(uid)}-input`,
		ref = $bindable(null),
		maxlength = 6,
		textalign = "left",
		pattern,
		inputmode = "numeric",
		onComplete = noop,
		pushPasswordManagerStrategy = "increase-width",
		class: containerClass = "",
		children,
		autocomplete = "one-time-code",
		disabled = false,
		value = $bindable(""),
		onValueChange = noop,
		pasteTransformer,
		...restProps
	}: PinInputRootProps = $props();

	const rootState = PinInputRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		inputId: boxWith(() => inputId),
		autocomplete: boxWith(() => autocomplete),
		maxLength: boxWith(() => maxlength),
		textAlign: boxWith(() => textalign),
		disabled: boxWith(() => disabled),
		inputmode: boxWith(() => inputmode),
		pattern: boxWith(() => pattern),
		onComplete: boxWith(() => onComplete),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		pushPasswordManagerStrategy: boxWith(() => pushPasswordManagerStrategy),
		pasteTransformer: boxWith(() => pasteTransformer),
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
