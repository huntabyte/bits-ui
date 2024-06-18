import type { Getter, ReadableBox, WritableBox } from "svelte-toolbelt";
import type { PinInputRootPropsWithoutHTML } from "./types.js";

const PWM_BADGE_MARGIN_RIGHT = 18;
const PWM_BADGE_SPACE_WIDTH_PX = 40;
const PWM_BADGE_SPACE_WIDTH = `${PWM_BADGE_SPACE_WIDTH_PX}px` as const;

const PASSWORD_MANAGER_SELECTORS = [
	"[data-lastpass-icon-root]", // LastPass,
	"com-1password-button", // 1Password,
	"[data-dashlanecreated]", // Dashlane,
	'[style$="2147483647 !important;"]', // Bitwarden
].join(",");

type UsePasswordManagerBadgeProps = {
	containerRef: WritableBox<HTMLElement | null>;
	inputRef: WritableBox<HTMLInputElement | null>;
	pushPasswordManagerStrategy: ReadableBox<
		PinInputRootPropsWithoutHTML["pushPasswordManagerStrategy"]
	>;
	isFocused: ReadableBox<boolean>;
};

export function usePasswordManagerBadge({
	containerRef,
	inputRef,
	pushPasswordManagerStrategy,
	isFocused,
}: UsePasswordManagerBadgeProps) {
	let pwmMetadata = $state({
		done: false,
		refocused: false,
	});

	let hasPwmBadge = $state(false);
	let hasPwmBadgeSpace = $state(false);
	let done = $state(false);

	function willPushPwmBadge() {
		const strat = pushPasswordManagerStrategy.value;
		if (strat === "none") return false;

		const increaseWidthCase = strat === "increase-width" && hasPwmBadge && hasPwmBadgeSpace;

		return increaseWidthCase;
	}

	function trackPwmBadge() {
		const container = containerRef.value;
		const input = inputRef.value;
		if (!container || !input || done || pushPasswordManagerStrategy.value === "none") return;

		const elementToCompare = container;

		// get the top right-center point of the container
		// that is usually where most password managers place their badge
		const rightCornerX =
			elementToCompare.getBoundingClientRect().left + elementToCompare.offsetWidth;
		const centeredY =
			elementToCompare.getBoundingClientRect().top + elementToCompare.offsetHeight / 2;
		const x = rightCornerX - PWM_BADGE_MARGIN_RIGHT;
		const y = centeredY;

		// do an extra search to check for all the password manager badges
		const pwms = document.querySelectorAll(PASSWORD_MANAGER_SELECTORS);

		// if no password manager is detected, dispatch document.elementfrompoint to
		// identify the badges
		if (pwms.length === 0) {
			const maybeBadgeEl = document.elementFromPoint(x, y);

			// if the found element is the container,
			// then it is not a badge, most times there is no badge in this case
			if (maybeBadgeEl === container) return;
		}

		hasPwmBadge = true;
		done = true;

		// for specific PWMs the input has to be re-focused
		// to trigger a reposition of the badge
		if (!pwmMetadata.refocused && document.activeElement === input) {
			const selections = [input.selectionStart ?? 0, input.selectionEnd ?? 0];
			input.blur();
			input.focus();
			input.focus();
			// recover the previous selection
			input.setSelectionRange(selections[0]!, selections[1]!);

			pwmMetadata.refocused = true;
		}
	}

	$effect(() => {
		const container = containerRef.value;
		if (!container || pushPasswordManagerStrategy.value === "none") return;

		// check if the pwm area is fully visible
		function checkHasSpace() {
			const viewportWidth = window.innerWidth;
			const distanceToRightEdge = viewportWidth - container!.getBoundingClientRect().right;
			hasPwmBadgeSpace = distanceToRightEdge >= PWM_BADGE_SPACE_WIDTH_PX;
		}

		checkHasSpace();
		const interval = setInterval(checkHasSpace, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	$effect(() => {
		const focused = isFocused.value || document.activeElement === inputRef.value;

		if (pushPasswordManagerStrategy.value === "none" || !focused) return;

		const t1 = setTimeout(trackPwmBadge, 0);
		const t2 = setTimeout(trackPwmBadge, 2000);
		const t3 = setTimeout(trackPwmBadge, 5000);
		const t4 = setTimeout(() => {
			done = true;
		}, 6000);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	});

	return {
		get hasPwmBadge() {
			return hasPwmBadge;
		},
		get willPushPwmBadge() {
			return willPushPwmBadge();
		},
		PWM_BADGE_SPACE_WIDTH,
	};
}
