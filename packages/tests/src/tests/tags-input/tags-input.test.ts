import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import type { TagsInputTestProps } from "./tags-input-test.svelte";
import TagsInputTest from "./tags-input-test.svelte";

const tags = ["a", "b", "c", "d"];

function setup(props: Partial<TagsInputTestProps> = {}) {
	const user = userEvent.setup();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(TagsInputTest, { value: tags, ...props });
	const root = returned.getByTestId("root");
	const list = returned.getByTestId("list");
	const input = returned.getByTestId("input");
	const clear = returned.getByTestId("clear");

	return {
		root,
		user,
		list,
		input,
		clear,
		...returned,
	};
}

describe("tags input", () => {
	it("should have no accessibility violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root, list, input, clear, getByTestId } = setup();
		expect(root).toHaveAttribute("data-tags-input-root");
		expect(list).toHaveAttribute("data-tags-input-list");
		expect(input).toHaveAttribute("data-tags-input-input");
		expect(clear).toHaveAttribute("data-tags-input-clear");
		const tag = getByTestId("tag-a");
		const tagContent = getByTestId("tag-content-a");
		expect(tag);
		const tagText = getByTestId("tag-text-a");
		const tagEdit = getByTestId("tag-edit-a");
		const tagRemove = getByTestId("tag-remove-a");
		expect(tag).toHaveAttribute("data-tags-input-tag");
		expect(tagContent).toHaveAttribute("data-tags-input-tag-content");
		expect(tagText).toHaveAttribute("data-tags-input-tag-text");
		expect(tagEdit).toHaveAttribute("data-tags-input-tag-edit");
		expect(tagRemove).toHaveAttribute("data-tags-input-tag-remove");
	});
});
