import type * as CSS from "csstype";

declare module "csstype" {
	interface PropertiesHyphen {
		// Allow any CSS Custom Properties
		// eslint-disable-next-line ts/no-explicit-any
		[index: `--${string}`]: any;
	}
}
