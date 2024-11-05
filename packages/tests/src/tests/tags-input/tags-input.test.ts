import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { getTestKbd } from "../utils";
import type { TagsInputTestProps } from "./tags-input-test.svelte";
import TagsInputTest from "./tags-input-test.svelte";

const kbd = getTestKbd();

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

	it("should allow adding tags via the input", async () => {
		const { user, input, getByTestId } = setup();
		await user.click(input);
		await user.keyboard("foo");
		expect(input).toHaveValue("foo");
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("");
		const newTag = getByTestId("tag-foo");
		expect(newTag).toBeInTheDocument();
	});

	it("should allow deleting tags from the input via backspace", async () => {
		const { user, input, list } = setup();
		await user.click(input);
		await user.keyboard(kbd.BACKSPACE);
		expect(input).not.toHaveFocus();
		const tags = list.querySelectorAll<HTMLElement>("[data-tags-input-tag]");
		expect(tags).toHaveLength(4);
		const lastTag = tags[tags.length - 1];
		expect(lastTag).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(lastTag).not.toBeInTheDocument();
		expect(tags[tags.length - 2]).toHaveFocus();
	});

	it("should allow deleting tags by clicking the remove button", async () => {
		const { user, list, getByTestId } = setup();
		const tags = list.querySelectorAll<HTMLElement>("[data-tags-input-tag]");
		expect(tags).toHaveLength(4);
		const lastTagRemoveButton = getByTestId("tag-remove-d");
		expect(lastTagRemoveButton).toBeInTheDocument();
		await user.click(lastTagRemoveButton);
		expect(lastTagRemoveButton).not.toBeInTheDocument();
		expect(list.querySelectorAll<HTMLElement>("[data-tags-input-tag]")).toHaveLength(3);
	});

	it("should allow clearing all tags via the clear button", async () => {
		const { user, list, clear, getByTestId } = setup();
		expect(list.querySelectorAll<HTMLElement>("[data-tags-input-tag]")).toHaveLength(4);
		await user.click(clear);
		expect(list.querySelectorAll<HTMLElement>("[data-tags-input-tag]")).toHaveLength(0);
	});

	it("should allow editing a tag via double click", async () => {
		const { user, getByTestId } = setup();
		const tagA = getByTestId("tag-a");
		await user.dblClick(tagA);
		const tagAEdit = getByTestId("tag-edit-a");
		expect(tagAEdit).toBeInTheDocument();
		await user.click(tagAEdit);
		expect(tagAEdit).toHaveFocus();
		expect(tagAEdit).toHaveValue("a");
		await user.keyboard("foo");
		expect(tagAEdit).toHaveValue("afoo");
		await user.keyboard(kbd.ENTER);
		const tagAFoo = getByTestId("tag-afoo");
		expect(tagAFoo).toBeInTheDocument();
	});

	it("should allow editing via pressing enter on the tag", async () => {
		const { user, getByTestId } = setup();
		const tagA = getByTestId("tag-a");
		await user.click(tagA);
		expect(tagA).toHaveFocus();
		await user.keyboard(kbd.ENTER);
		const editTagA = getByTestId("tag-edit-a");
		expect(editTagA).toHaveFocus();
		await user.keyboard("foo");
		expect(editTagA).toHaveValue("foo");
		await user.keyboard(kbd.ENTER);
		const tagAFoo = getByTestId("tag-foo");
		expect(tagAFoo).toBeInTheDocument();
	});
});
