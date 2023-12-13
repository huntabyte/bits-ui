/**
 * Types for the new internal API for Svelte 5.
 */
import type { Snippet } from "svelte";

/**
 * A type that augments a props type 'T' by adding props necessary
 * for handling render delegation.
 */
export type AsChildProps<T> = {
	child: Snippet<T>;
	children?: never;
	asChild: true;
} & Omit<T, "children" | "asChild">;

/**
 * A type that augments a props type 'T' by adding props necessary
 * for handling default `children` snippet content.
 */
export type DefaultProps<T> = {
	asChild?: never;
	child?: never;
} & Omit<T, "child" | "asChild">;

export type DefaultOrAsChildProps<T> = DefaultProps<T> | AsChildProps<T>;

/**
 * Constructs a new type by omitting properties from type
 * 'T' that exist in type 'U'.
 *
 * @template T - The base object type from which properties will be omitted.
 * @template U - The object type whose properties will be omitted from 'T'.
 * @remarks This type uses TypeScript's utility types where 'Omit<T, K>'
 *          constructs a type by omitting properties 'K' from type 'T'.
 * @example
 * type Result = Without<{ a: number; b: string; }, { b: string; }>;
 * // Result type will be { a: number; }
 */
export type Without<T extends object, U extends object> = Omit<T, keyof U>;
