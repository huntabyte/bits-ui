<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	type T = Transition;
	type In = Transition;
	type Out = Transition;
</script>

<script
	lang="ts"
	generics="T extends Transition, In extends Transition, Out extends Transition"
>
	import { getCollapsibleState } from "./state.svelte";
	import type { CollapsibleContentProps } from "./types";

	let {
		child,
		children,
		transition,
		inTransition,
		outTransition,
		transitionConfig,
		inTransitionConfig,
		outTransitionConfig,
		...props
	} = $props<CollapsibleContentProps<T, In, Out>>();

	const rootState = getCollapsibleState();
</script>

{#if props.asChild && rootState.open && child}
	{@render child({ ...props, ...rootState.contentAttrs })}
{:else if transition && rootState.open && children}
	<div
		transition:transition={transitionConfig}
		{...props}
		{...rootState.contentAttrs}
	>
		{@render children()}
	</div>
{:else if inTransition && outTransition && rootState.open && children}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...props}
		{...rootState.contentAttrs}
	>
		{@render children()}
	</div>
{:else if inTransition && rootState.open && children}
	<div
		in:inTransition={inTransitionConfig}
		{...props}
		{...rootState.contentAttrs}
	>
		{@render children()}
	</div>
{:else if outTransition && rootState.open && children}
	<div
		out:outTransition={outTransitionConfig}
		{...props}
		{...rootState.contentAttrs}
	>
		{@render children()}
	</div>
{:else if rootState.open && children}
	<div {...props} {...rootState.contentAttrs}>
		{@render children()}
	</div>
{/if}
