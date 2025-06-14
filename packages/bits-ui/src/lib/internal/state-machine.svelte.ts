import { box, type WritableBox } from "svelte-toolbelt";

interface Machine<S> {
	[k: string]: { [k: string]: S };
}
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
	? R
	: never;

export class StateMachine<M> {
	readonly state: WritableBox<MachineState<M>>;
	readonly #machine: M & Machine<MachineState<M>>;

	constructor(initialState: MachineState<M>, machine: M & Machine<MachineState<M>>) {
		this.state = box(initialState);
		this.#machine = machine;
		this.dispatch = this.dispatch.bind(this);
	}

	#reducer(event: MachineEvent<M>) {
		// @ts-expect-error  state.current is keyof M
		const nextState = this.#machine[this.state.current][event];
		return nextState ?? this.state.current;
	}

	dispatch(event: MachineEvent<M>) {
		this.state.current = this.#reducer(event);
	}
}
