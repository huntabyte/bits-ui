import type * as CSS from "csstype";

declare module "csstype" {
	interface Properties {
		// Allow any CSS Custom Properties
		// eslint-disable-next-line ts/no-explicit-any
		[index: `--${string}`]: any;
	}
}
