export type ScrollLockProps = {
	/**
	 * Whether to prevent body scrolling when the content is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * The delay in milliseconds before the scrollbar is restored after closing the
	 * dialog. This is only applicable when using the `child` snippet for custom
	 * transitions and `preventScroll` is `true`. You should set this to a value
	 * greater than the transition duration to prevent content from shifting during
	 * the transition.
	 *
	 * @default null
	 */
	restoreScrollDelay?: number | null;

	/**
	 * Decides whether this lock needs `pointer-events: none` applied to the body
	 * while active. Components that already block pointer interaction another way
	 * (e.g. a dialog rendering an overlay) can return `false` to skip the
	 * full-page style recalculation that write causes. Checked after the open
	 * content has mounted.
	 *
	 * @default () => true
	 */
	shouldBlockPointerEvents?: () => boolean;
};
