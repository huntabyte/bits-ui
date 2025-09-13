import type * as CSS from "csstype";

declare module "csstype" {
	interface Properties {
		// Allow any CSS Custom Properties
		// oxlint-disable-next-line no-explicit-any
		[index: `--${string}`]: any;
	}
}
