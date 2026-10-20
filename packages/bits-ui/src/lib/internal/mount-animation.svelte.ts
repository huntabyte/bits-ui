import { watch } from "runed";

const blockedAnimationStyle = { animationName: "none", transitionDuration: "0s" } as const;

/**
 * Keeps content that mounts open from playing its open animation/transition.
 *
 * The block is rendered through the content's `style` prop rather than set on the
 * node imperatively, since Svelte rewrites the `style` attribute whenever the
 * content's props change (e.g. after measuring its dimensions). It lifts on the
 * first open state change, so later opening and closing still animate.
 */
export class MountAnimationGuard {
	#prevented = $state(false);

	constructor(open: () => boolean) {
		this.#prevented = open();
		watch.pre(
			open,
			() => {
				this.#prevented = false;
			},
			{ lazy: true }
		);
	}

	get style() {
		return this.#prevented ? blockedAnimationStyle : undefined;
	}
}

/**
 * Measures `node` at its full size with animations and transitions blocked, then
 * restores its inline styles.
 */
export function measureWithoutAnimation(node: HTMLElement): DOMRect {
	const { animationName, transitionDuration } = node.style;
	node.style.animationName = blockedAnimationStyle.animationName;
	node.style.transitionDuration = blockedAnimationStyle.transitionDuration;
	const rect = node.getBoundingClientRect();
	node.style.animationName = animationName;
	node.style.transitionDuration = transitionDuration;
	return rect;
}
