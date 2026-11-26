import { expectTypeOf, it } from "vitest";
import type {
	Popover,
	Tooltip,
	LinkPreview,
	Combobox,
	Select,
	DropdownMenu,
	ContextMenu,
	Menubar,
} from "bits-ui";

type ContentSide = Popover.ContentProps["side"];

it("accepts logical floating inputs while keeping collision padding physical", () => {
	expectTypeOf<ContentSide>().toEqualTypeOf<
		"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end" | undefined
	>();
	expectTypeOf<Tooltip.ContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<LinkPreview.ContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<Combobox.ContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<Select.ContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<DropdownMenu.SubContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<ContextMenu.SubContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<Menubar.SubContentProps["side"]>().toEqualTypeOf<ContentSide>();
	expectTypeOf<Popover.ContentProps["collisionPadding"]>().toEqualTypeOf<
		number | Partial<Record<"top" | "right" | "bottom" | "left", number>> | undefined
	>();
});
