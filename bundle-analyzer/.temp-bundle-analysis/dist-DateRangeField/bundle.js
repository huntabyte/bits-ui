import { untrack as untrack$1, hasContext, getContext, setContext, onMount } from "svelte";
const PUBLIC_VERSION = "5";
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
}
const PROPS_IS_IMMUTABLE = 1;
const PROPS_IS_RUNES = 1 << 1;
const PROPS_IS_UPDATED = 1 << 2;
const PROPS_IS_BINDABLE = 1 << 3;
const PROPS_IS_LAZY_INITIAL = 1 << 4;
const TEMPLATE_FRAGMENT = 1;
const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
const UNINITIALIZED = Symbol();
const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
const ATTACHMENT_KEY = "@attach";
const DEV = false;
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
function is_function(thing) {
  return typeof thing === "function";
}
const noop$1 = () => {
};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const RENDER_EFFECT = 1 << 3;
const BLOCK_EFFECT = 1 << 4;
const BRANCH_EFFECT = 1 << 5;
const ROOT_EFFECT = 1 << 6;
const BOUNDARY_EFFECT = 1 << 7;
const UNOWNED = 1 << 8;
const DISCONNECTED = 1 << 9;
const CLEAN = 1 << 10;
const DIRTY = 1 << 11;
const MAYBE_DIRTY = 1 << 12;
const INERT = 1 << 13;
const DESTROYED = 1 << 14;
const EFFECT_RAN = 1 << 15;
const EFFECT_TRANSPARENT = 1 << 16;
const INSPECT_EFFECT = 1 << 17;
const HEAD_EFFECT = 1 << 18;
const EFFECT_PRESERVED = 1 << 19;
const USER_EFFECT = 1 << 20;
const REACTION_IS_UPDATING = 1 << 21;
const ASYNC = 1 << 22;
const ERROR_VALUE = 1 << 23;
const STATE_SYMBOL = Symbol("$state");
const LEGACY_PROPS = Symbol("legacy props");
const LOADING_ATTR_SYMBOL = Symbol("");
const STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function await_outside_boundary() {
  {
    throw new Error(`https://svelte.dev/e/await_outside_boundary`);
  }
}
function async_derived_orphan() {
  {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function effect_in_teardown(rune) {
  {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function props_invalid_value(key) {
  {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function state_descriptors_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function select_multiple_invalid_value() {
  {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a2, b) {
  return a2 != a2 ? b == b : a2 !== b || a2 !== null && typeof a2 === "object" || typeof a2 === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
let legacy_mode_flag = false;
let tracing_mode_flag = false;
function enable_legacy_mode_flag() {
  legacy_mode_flag = true;
}
let component_context = null;
function set_component_context(context) {
  component_context = context;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    c: null,
    e: null,
    s: props,
    x: null,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
}
function pop(component) {
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  component_context = context.p;
  return (
    /** @type {T} */
    {}
  );
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}
const adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error) {
  var effect2 = active_effect;
  if (effect2 === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if ((effect2.f & EFFECT_RAN) === 0) {
    if ((effect2.f & BOUNDARY_EFFECT) === 0) {
      if (!effect2.parent && error instanceof Error) {
        apply_adjustments(error);
      }
      throw error;
    }
    effect2.b.error(error);
  } else {
    invoke_error_boundary(error, effect2);
  }
}
function invoke_error_boundary(error, effect2) {
  while (effect2 !== null) {
    if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
      try {
        effect2.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect2 = effect2.parent;
  }
  if (error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}
let micro_tasks = [];
function run_micro_tasks() {
  var tasks2 = micro_tasks;
  micro_tasks = [];
  run_all(tasks2);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0) {
    queueMicrotask(run_micro_tasks);
  }
  micro_tasks.push(fn);
}
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  return () => {
    if (effect_tracking()) {
      get(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = void 0;
              increment(version);
            }
          });
        };
      });
    }
  };
}
function get_pending_boundary() {
  var boundary = (
    /** @type {Effect} */
    active_effect.b
  );
  while (boundary !== null && !boundary.has_pending_snippet()) {
    boundary = boundary.parent;
  }
  if (boundary === null) {
    await_outside_boundary();
  }
  return boundary;
}
// @__NO_SIDE_EFFECTS__
function derived(fn) {
  var flags = DERIVED | DIRTY;
  var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
    /** @type {Derived} */
    active_reaction
  ) : null;
  if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
    flags |= UNOWNED;
  } else {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags,
    fn,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      UNINITIALIZED
    ),
    wv: 0,
    parent: parent_derived ?? active_effect,
    ac: null
  };
  return signal;
}
// @__NO_SIDE_EFFECTS__
function async_derived(fn, location) {
  let parent = (
    /** @type {Effect | null} */
    active_effect
  );
  if (parent === null) {
    async_derived_orphan();
  }
  var boundary = (
    /** @type {Boundary} */
    parent.b
  );
  var promise = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  );
  var signal = source(
    /** @type {V} */
    UNINITIALIZED
  );
  var prev = null;
  var should_suspend = !active_reaction;
  async_effect(() => {
    try {
      var p2 = fn();
    } catch (error) {
      p2 = Promise.reject(error);
    }
    var r2 = () => p2;
    promise = prev?.then(r2, r2) ?? Promise.resolve(p2);
    prev = promise;
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var pending = boundary.pending;
    if (should_suspend) {
      boundary.update_pending_count(1);
      if (!pending) batch.increment();
    }
    const handler = (value, error = void 0) => {
      prev = null;
      if (!pending) batch.activate();
      if (error) {
        if (error !== STALE_REACTION) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        }
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
      }
      if (should_suspend) {
        boundary.update_pending_count(-1);
        if (!pending) batch.decrement();
      }
      unset_context();
    };
    promise.then(handler, (e) => handler(null, e || "unknown"));
    if (batch) {
      return () => {
        queueMicrotask(() => batch.neuter());
      };
    }
  });
  return new Promise((fulfil) => {
    function next(p2) {
      function go() {
        if (p2 === promise) {
          fulfil(signal);
        } else {
          next(promise);
        }
      }
      p2.then(go, go);
    }
    next(promise);
  });
}
// @__NO_SIDE_EFFECTS__
function user_derived(fn) {
  const d = /* @__PURE__ */ derived(fn);
  push_reaction_value(d);
  return d;
}
// @__NO_SIDE_EFFECTS__
function derived_safe_equal(fn) {
  const signal = /* @__PURE__ */ derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
function get_derived_parent_effect(derived2) {
  var parent = derived2.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (
        /** @type {Effect} */
        parent
      );
    }
    parent = parent.parent;
  }
  return null;
}
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived2));
  {
    try {
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.v = value;
    derived2.wv = increment_write_version();
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_deriveds !== null) {
    batch_deriveds.set(derived2, derived2.v);
  } else {
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
}
function flatten(sync, async, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  if (async.length === 0) {
    fn(sync.map(d));
    return;
  }
  var batch = current_batch;
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  var restore = capture();
  var boundary = get_pending_boundary();
  Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then((result) => {
    batch?.activate();
    restore();
    try {
      fn([...sync.map(d), ...result]);
    } catch (error) {
      if ((parent.f & DESTROYED) === 0) {
        invoke_error_boundary(error, parent);
      }
    }
    batch?.deactivate();
    unset_context();
  }).catch((error) => {
    boundary.error(error);
  });
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  return function restore() {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
  };
}
function unset_context() {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
}
const batches = /* @__PURE__ */ new Set();
let current_batch = null;
let previous_batch = null;
let batch_deriveds = null;
let effect_pending_updates = /* @__PURE__ */ new Set();
let tasks = [];
function dequeue() {
  const task = (
    /** @type {() => void} */
    tasks.shift()
  );
  if (tasks.length > 0) {
    queueMicrotask(dequeue);
  }
  task();
}
let queued_root_effects = [];
let last_scheduled_effect = null;
let is_flushing = false;
class Batch {
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  #previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #callbacks = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #pending = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #deferred = null;
  /**
   * True if an async effect inside this batch resolved and
   * its parent branch was already deleted
   */
  #neutered = false;
  /**
   * Async effects (created inside `async_derived`) encountered during processing.
   * These run after the rest of the batch has updated, since they should
   * always have the latest values
   * @type {Effect[]}
   */
  #async_effects = [];
  /**
   * The same as `#async_effects`, but for effects inside a newly-created
   * `<svelte:boundary>` — these do not prevent the batch from committing
   * @type {Effect[]}
   */
  #boundary_async_effects = [];
  /**
   * Template effects and `$effect.pre` effects, which run when
   * a batch is committed
   * @type {Effect[]}
   */
  #render_effects = [];
  /**
   * The same as `#render_effects`, but for `$effect` (which runs after)
   * @type {Effect[]}
   */
  #effects = [];
  /**
   * Block effects, which may need to re-run on subsequent flushes
   * in order to update internal sources (e.g. each block items)
   * @type {Effect[]}
   */
  #block_effects = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Effect[]}
   */
  #dirty_effects = [];
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Effect[]}
   */
  #maybe_dirty_effects = [];
  /**
   * A set of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`
   * @type {Set<Effect>}
   */
  skipped_effects = /* @__PURE__ */ new Set();
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(root_effects) {
    queued_root_effects = [];
    previous_batch = null;
    var current_values = null;
    if (batches.size > 1) {
      current_values = /* @__PURE__ */ new Map();
      batch_deriveds = /* @__PURE__ */ new Map();
      for (const [source2, current] of this.current) {
        current_values.set(source2, { v: source2.v, wv: source2.wv });
        source2.v = current;
      }
      for (const batch of batches) {
        if (batch === this) continue;
        for (const [source2, previous] of batch.#previous) {
          if (!current_values.has(source2)) {
            current_values.set(source2, { v: source2.v, wv: source2.wv });
            source2.v = previous;
          }
        }
      }
    }
    for (const root2 of root_effects) {
      this.#traverse_effect_tree(root2);
    }
    if (this.#async_effects.length === 0 && this.#pending === 0) {
      this.#commit();
      var render_effects = this.#render_effects;
      var effects = this.#effects;
      this.#render_effects = [];
      this.#effects = [];
      this.#block_effects = [];
      previous_batch = current_batch;
      current_batch = null;
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      if (current_batch === null) {
        current_batch = this;
      } else {
        batches.delete(this);
      }
      this.#deferred?.resolve();
    } else {
      this.#defer_effects(this.#render_effects);
      this.#defer_effects(this.#effects);
      this.#defer_effects(this.#block_effects);
    }
    if (current_values) {
      for (const [source2, { v, wv }] of current_values) {
        if (source2.wv <= wv) {
          source2.v = v;
        }
      }
      batch_deriveds = null;
    }
    for (const effect2 of this.#async_effects) {
      update_effect(effect2);
    }
    for (const effect2 of this.#boundary_async_effects) {
      update_effect(effect2);
    }
    this.#async_effects = [];
    this.#boundary_async_effects = [];
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   */
  #traverse_effect_tree(root2) {
    root2.f ^= CLEAN;
    var effect2 = root2.first;
    while (effect2 !== null) {
      var flags = effect2.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          effect2.f ^= CLEAN;
        } else if ((flags & CLEAN) === 0) {
          if ((flags & EFFECT) !== 0) {
            this.#effects.push(effect2);
          } else if ((flags & ASYNC) !== 0) {
            var effects = effect2.b?.pending ? this.#boundary_async_effects : this.#async_effects;
            effects.push(effect2);
          } else if (is_dirty(effect2)) {
            if ((effect2.f & BLOCK_EFFECT) !== 0) this.#block_effects.push(effect2);
            update_effect(effect2);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      var parent = effect2.parent;
      effect2 = effect2.next;
      while (effect2 === null && parent !== null) {
        effect2 = parent.next;
        parent = parent.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #defer_effects(effects) {
    for (const e of effects) {
      const target = (e.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
      target.push(e);
      set_signal_status(e, CLEAN);
    }
    effects.length = 0;
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(source2, value) {
    if (!this.#previous.has(source2)) {
      this.#previous.set(source2, value);
    }
    this.current.set(source2, source2.v);
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    previous_batch = null;
    for (const update of effect_pending_updates) {
      effect_pending_updates.delete(update);
      update();
      if (current_batch !== null) {
        break;
      }
    }
  }
  neuter() {
    this.#neutered = true;
  }
  flush() {
    if (queued_root_effects.length > 0) {
      flush_effects();
    } else {
      this.#commit();
    }
    if (current_batch !== this) {
      return;
    }
    if (this.#pending === 0) {
      batches.delete(this);
    }
    this.deactivate();
  }
  /**
   * Append and remove branches to/from the DOM
   */
  #commit() {
    if (!this.#neutered) {
      for (const fn of this.#callbacks) {
        fn();
      }
    }
    this.#callbacks.clear();
  }
  increment() {
    this.#pending += 1;
  }
  decrement() {
    this.#pending -= 1;
    if (this.#pending === 0) {
      for (const e of this.#dirty_effects) {
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of this.#maybe_dirty_effects) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      this.#render_effects = [];
      this.#effects = [];
      this.flush();
    } else {
      this.deactivate();
    }
  }
  /** @param {() => void} fn */
  add_callback(fn) {
    this.#callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new Batch();
      batches.add(current_batch);
      {
        Batch.enqueue(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  /** @param {() => void} task */
  static enqueue(task) {
    if (tasks.length === 0) {
      queueMicrotask(dequeue);
    }
    tasks.unshift(task);
  }
}
function flush_effects() {
  var was_updating_effect = is_updating_effect;
  is_flushing = true;
  try {
    var flush_count = 0;
    set_is_updating_effect(true);
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1e3) {
        var updates, entry;
        if (DEV) ;
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
    }
  } finally {
    is_flushing = false;
    set_is_updating_effect(was_updating_effect);
    last_scheduled_effect = null;
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect2 = effects[i++];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
      var n = current_batch ? current_batch.current.size : 0;
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
        if (effect2.teardown === null && effect2.ac === null) {
          unlink_effect(effect2);
        } else {
          effect2.fn = null;
        }
      }
      if (current_batch !== null && current_batch.current.size > n && (effect2.f & USER_EFFECT) !== 0) {
        break;
      }
    }
  }
  while (i < length) {
    schedule_effect(effects[i++]);
  }
}
function schedule_effect(signal) {
  var effect2 = last_scheduled_effect = signal;
  while (effect2.parent !== null) {
    effect2 = effect2.parent;
    var flags = effect2.f;
    if (is_flushing && effect2 === active_effect && (flags & BLOCK_EFFECT) !== 0) {
      return;
    }
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0) return;
      effect2.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect2);
}
const old_values = /* @__PURE__ */ new Map();
function source(v, stack) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  return signal;
}
// @__NO_SIDE_EFFECTS__
function state(v, stack) {
  const s = source(v);
  push_reaction_value(s);
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  return internal_set(source2, new_value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if ((source2.f & DERIVED) !== 0) {
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(
          /** @type {Derived} */
          source2
        );
      }
      set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
  }
  return value;
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
    if (!runes && reaction === active_effect) continue;
    var not_dirty = (flags & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags & DERIVED) !== 0) {
      mark_reactions(
        /** @type {Derived} */
        reaction,
        MAYBE_DIRTY
      );
    } else if (not_dirty) {
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = /* @__PURE__ */ state(0);
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", /* @__PURE__ */ state(
      /** @type {any[]} */
      value.length
    ));
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop2, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop2);
        if (s === void 0) {
          s = with_parent(() => {
            var s2 = /* @__PURE__ */ state(descriptor.value);
            sources.set(prop2, s2);
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop2) {
        var s = sources.get(prop2);
        if (s === void 0) {
          if (prop2 in target) {
            const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
            sources.set(prop2, s2);
            increment(version);
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target, prop2, receiver) {
        if (prop2 === STATE_SYMBOL) {
          return value;
        }
        var s = sources.get(prop2);
        var exists = prop2 in target;
        if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
          s = with_parent(() => {
            var p2 = proxy(exists ? target[prop2] : UNINITIALIZED);
            var s2 = /* @__PURE__ */ state(p2);
            return s2;
          });
          sources.set(prop2, s);
        }
        if (s !== void 0) {
          var v = get(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop2, receiver);
      },
      getOwnPropertyDescriptor(target, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s) descriptor.value = get(s);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop2);
          var value2 = source2?.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop2) {
        if (prop2 === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop2);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
        if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
          if (s === void 0) {
            s = with_parent(() => {
              var p2 = has ? proxy(target[prop2]) : UNINITIALIZED;
              var s2 = /* @__PURE__ */ state(p2);
              return s2;
            });
            sources.set(prop2, s);
          }
          var value2 = get(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop2, value2, receiver) {
        var s = sources.get(prop2);
        var has = prop2 in target;
        if (is_proxied_array && prop2 === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(i + "", other_s);
            }
          }
        }
        if (s === void 0) {
          if (!has || get_descriptor(target, prop2)?.writable) {
            s = with_parent(() => /* @__PURE__ */ state(void 0));
            set(s, proxy(value2));
            sources.set(prop2, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p2 = with_parent(() => proxy(value2));
          set(s, p2);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor?.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop2 === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop2);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target) {
        get(version);
        var own_keys = Reflect.ownKeys(target).filter((key2) => {
          var source3 = sources.get(key2);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key in target)) {
            own_keys.push(key);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {
  }
  return value;
}
function is(a2, b) {
  return Object.is(get_proxied_value(a2), get_proxied_value(b));
}
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return first_child_getter.call(node);
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function child(node, is_text) {
  {
    return /* @__PURE__ */ get_first_child(node);
  }
}
function first_child(fragment, is_text) {
  {
    var first = (
      /** @type {DocumentFragment} */
      /* @__PURE__ */ get_first_child(
        /** @type {Node} */
        fragment
      )
    );
    if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
    return first;
  }
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = node;
  while (count--) {
    next_sibling = /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(next_sibling);
  }
  {
    return next_sibling;
  }
}
function should_defer_append() {
  return false;
}
function autofocus(dom, value) {
  if (value) {
    const body = document.body;
    dom.autofocus = true;
    queue_micro_task(() => {
      if (document.activeElement === body) {
        dom.focus();
      }
    });
  }
}
let listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener(
      "reset",
      (evt) => {
        Promise.resolve().then(() => {
          if (!evt.defaultPrevented) {
            for (
              const e of
              /**@type {HTMLFormElement} */
              evt.target.elements
            ) {
              e.__on_r?.();
            }
          }
        });
      },
      // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
      { capture: true }
    );
  }
}
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
  element.addEventListener(event, () => without_reactive_context(handler));
  const prev = element.__on_r;
  if (prev) {
    element.__on_r = () => {
      prev();
      on_reset(true);
    };
  } else {
    element.__on_r = () => on_reset(true);
  }
  add_form_reset_listener();
}
function validate_effect(rune) {
  if (active_effect === null && active_reaction === null) {
    effect_orphan();
  }
  if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown();
  }
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn, sync, push2 = true) {
  var parent = active_effect;
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect2 = {
    ctx: component_context,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: type | DIRTY,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0,
    ac: null
  };
  if (sync) {
    try {
      update_effect(effect2);
      effect2.f |= EFFECT_RAN;
    } catch (e) {
      destroy_effect(effect2);
      throw e;
    }
  } else if (fn !== null) {
    schedule_effect(effect2);
  }
  var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & EFFECT_PRESERVED) === 0;
  if (!inert && push2) {
    if (parent !== null) {
      push_effect(effect2, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.effects ??= []).push(effect2);
    }
  }
  return effect2;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect2 = create_effect(RENDER_EFFECT, null, false);
  set_signal_status(effect2, CLEAN);
  effect2.teardown = fn;
  return effect2;
}
function user_effect(fn) {
  validate_effect();
  var flags = (
    /** @type {Effect} */
    active_effect.f
  );
  var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & EFFECT_RAN) === 0;
  if (defer) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn, false);
}
function user_pre_effect(fn) {
  validate_effect();
  return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
}
function render_effect(fn, flags = 0) {
  return create_effect(RENDER_EFFECT | flags, fn, true);
}
function block(fn, flags = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags, fn, true);
  return effect2;
}
function branch(fn, push2 = true) {
  return create_effect(BRANCH_EFFECT, fn, true, push2);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null && effect2.nodes_end !== null) {
    remove_effect_dom(
      effect2.nodes_start,
      /** @type {TemplateNode} */
      effect2.nodes_end
    );
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.transitions;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = effect2.ac = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next = node === end ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node)
    );
    node.remove();
    node = next;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next = effect2.next;
  if (prev !== null) prev.next = next;
  if (next !== null) next.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next;
    if (parent.last === effect2) parent.last = prev;
  }
}
function pause_effect(effect2, callback) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  run_out_transitions(transitions, () => {
    destroy_effect(effect2);
    if (callback) callback();
  });
}
function run_out_transitions(transitions, fn) {
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0) return;
  effect2.f ^= INERT;
  if (effect2.transitions !== null) {
    for (const transition of effect2.transitions) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    pause_children(child2, transitions, transparent ? local : false);
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0) return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    schedule_effect(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  if (effect2.transitions !== null) {
    for (const transition of effect2.transitions) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
let is_updating_effect = false;
function set_is_updating_effect(value) {
  is_updating_effect = value;
}
let is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
let active_reaction = null;
let untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
let active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
let current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && true) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
let new_deps = null;
let skipped_deps = 0;
let untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
let write_version = 1;
let read_version = 0;
let update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
let skip_reaction = false;
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var is_unowned = (flags & UNOWNED) !== 0;
    if (dependencies !== null) {
      var i;
      var dependency;
      var is_disconnected = (flags & DISCONNECTED) !== 0;
      var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
      var length = dependencies.length;
      if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        var parent = derived2.parent;
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (is_disconnected || !dependency?.reactions?.includes(derived2)) {
            (dependency.reactions ??= []).push(derived2);
          }
        }
        if (is_disconnected) {
          derived2.f ^= DISCONNECTED;
        }
        if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
          derived2.f ^= UNOWNED;
        }
      }
      for (i = 0; i < length; i++) {
        dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
    }
    if (!is_unowned || active_effect !== null && !skip_reaction) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (current_sources?.includes(signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect2,
        false
      );
    } else if (effect2 === reaction) {
      if (root2) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_skip_reaction = skip_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
  active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    var deps = reaction.deps;
    if (new_deps !== null) {
      var i;
      remove_reactions(reaction, skipped_deps);
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (!skip_reaction || // Deriveds that already have reactions can cleanup, so we still add them as reactions
      (flags & DERIVED) !== 0 && /** @type {import('#client').Derived} */
      reaction.reactions !== null) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    skip_reaction = previous_skip_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !new_deps.includes(dependency))) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
      dependency.f ^= DISCONNECTED;
    }
    destroy_derived_effects(
      /** @type {Derived} **/
      dependency
    );
    remove_reactions(
      /** @type {Derived} **/
      dependency,
      0
    );
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags = effect2.f;
  if ((flags & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  try {
    if ((flags & BLOCK_EFFECT) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    var dep;
    if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
  }
}
function get(signal) {
  var flags = signal.f;
  var is_derived = (flags & DERIVED) !== 0;
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && !current_sources?.includes(signal)) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ??= []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!reactions.includes(active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  } else if (is_derived && /** @type {Derived} */
  signal.deps === null && /** @type {Derived} */
  signal.effects === null) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    var parent = derived2.parent;
    if (parent !== null && (parent.f & UNOWNED) === 0) {
      derived2.f ^= UNOWNED;
    }
  }
  if (is_destroying_effect) {
    if (old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
  } else if (is_derived) {
    derived2 = /** @type {Derived} */
    signal;
    if (batch_deriveds?.has(derived2)) {
      return batch_deriveds.get(derived2);
    }
    if (is_dirty(derived2)) {
      update_derived(derived2);
    }
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED) return true;
  if (derived2.deps === null) return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
const STATUS_MASK = -7169;
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key in value) {
      const prop2 = value[key];
      if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
        deep_read(prop2);
      }
    }
  }
}
function deep_read(value, visited = /* @__PURE__ */ new Set()) {
  if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
  !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key in value) {
      try {
        deep_read(value[key], visited);
      } catch (e) {
      }
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key in descriptors) {
        const get2 = descriptors[key].get;
        if (get2) {
          try {
            get2.call(value);
          } catch (e) {
          }
        }
      }
    }
  }
}
const all_registered_events = /* @__PURE__ */ new Set();
const root_event_handles = /* @__PURE__ */ new Set();
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event);
    }
    if (!event.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function on(element, type, handler, options = {}) {
  var target_handler = create_event(type, element, handler, options);
  return () => {
    element.removeEventListener(type, target_handler, options);
  };
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
let last_propagated_event = null;
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  last_propagated_event = event;
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event.target === current_target)) {
          if (is_array(delegated)) {
            var [fn, ...data] = delegated;
            fn.apply(current_target, [event, ...data]);
          } else {
            delegated.call(current_target, event);
          }
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event.__root = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function create_fragment_from_html(html) {
  var elem = document.createElement("template");
  elem.innerHTML = html.replaceAll("<!>", "<!---->");
  return elem.content;
}
function assign_nodes(start, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes_start === null) {
    effect2.nodes_start = start;
    effect2.nodes_end = end;
  }
}
// @__NO_SIDE_EFFECTS__
function from_html(content, flags) {
  var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = /** @type {Node} */
      /* @__PURE__ */ get_first_child(node);
    }
    var clone = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(clone)
      );
      var end = (
        /** @type {TemplateNode} */
        clone.lastChild
      );
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function comment() {
  var frag = document.createDocumentFragment();
  var start = document.createComment("");
  var anchor = create_text();
  frag.append(start, anchor);
  assign_nodes(start, anchor);
  return frag;
}
function append(anchor, dom) {
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}
function props_id() {
  (window.__svelte ??= {}).uid ??= 1;
  return `c${window.__svelte.uid++}`;
}
function is_capture_event(name) {
  return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
}
const DELEGATED_EVENTS = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function is_delegated(event_name) {
  return DELEGATED_EVENTS.includes(event_name);
}
const ATTRIBUTE_ALIASES = {
  // no `class: 'className'` because we handle that separately
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function normalize_attribute(name) {
  name = name.toLowerCase();
  return ATTRIBUTE_ALIASES[name] ?? name;
}
function snippet(node, get_snippet, ...args) {
  var anchor = node;
  var snippet2 = noop$1;
  var snippet_effect;
  block(() => {
    if (snippet2 === (snippet2 = get_snippet())) return;
    if (snippet_effect) {
      destroy_effect(snippet_effect);
      snippet_effect = null;
    }
    snippet_effect = branch(() => (
      /** @type {SnippetFn} */
      snippet2(anchor, ...args)
    ));
  }, EFFECT_TRANSPARENT);
}
function createAttachmentKey() {
  return Symbol(ATTACHMENT_KEY);
}
function if_block(node, fn, elseif = false) {
  var anchor = node;
  var consequent_effect = null;
  var alternate_effect = null;
  var condition = UNINITIALIZED;
  var flags = elseif ? EFFECT_TRANSPARENT : 0;
  var has_branch = false;
  const set_branch = (fn2, flag = true) => {
    has_branch = true;
    update_branch(flag, fn2);
  };
  var offscreen_fragment = null;
  function commit() {
    if (offscreen_fragment !== null) {
      offscreen_fragment.lastChild.remove();
      anchor.before(offscreen_fragment);
      offscreen_fragment = null;
    }
    var active = condition ? consequent_effect : alternate_effect;
    var inactive = condition ? alternate_effect : consequent_effect;
    if (active) {
      resume_effect(active);
    }
    if (inactive) {
      pause_effect(inactive, () => {
        if (condition) {
          alternate_effect = null;
        } else {
          consequent_effect = null;
        }
      });
    }
  }
  const update_branch = (new_condition, fn2) => {
    if (condition === (condition = new_condition)) return;
    var defer = should_defer_append();
    var target = anchor;
    if (defer) {
      offscreen_fragment = document.createDocumentFragment();
      offscreen_fragment.append(target = create_text());
    }
    if (condition) {
      consequent_effect ??= fn2 && branch(() => fn2(target));
    } else {
      alternate_effect ??= fn2 && branch(() => fn2(target));
    }
    if (defer) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var active = condition ? consequent_effect : alternate_effect;
      var inactive = condition ? alternate_effect : consequent_effect;
      if (active) batch.skipped_effects.delete(active);
      if (inactive) batch.skipped_effects.add(inactive);
      batch.add_callback(commit);
    } else {
      commit();
    }
  };
  block(() => {
    has_branch = false;
    fn(set_branch);
    if (!has_branch) {
      update_branch(null, null);
    }
  }, flags);
}
function attach(node, get_fn) {
  var fn = void 0;
  var e;
  block(() => {
    if (fn !== (fn = get_fn())) {
      if (e) {
        destroy_effect(e);
        e = null;
      }
      if (fn) {
        e = branch(() => {
          effect(() => (
            /** @type {(node: Element) => void} */
            fn(node)
          ));
        });
      }
    }
  });
}
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx$1() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (directives) {
    for (var key in directives) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a2 = 0;
        while ((a2 = classname.indexOf(key, a2)) >= 0) {
          var b = a2 + len;
          if ((a2 === 0 || whitespace.includes(classname[a2 - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a2 === 0 ? "" : classname.substring(0, a2)) + classname.substring(b + 1);
          } else {
            a2 = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key in styles) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}
function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
  var prev = dom.__className;
  if (prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash, next_classes);
    {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}
function update_styles(dom, prev = {}, next, priority) {
  for (var key in next) {
    var value = next[key];
    if (prev[key] !== value) {
      if (next[key] == null) {
        dom.style.removeProperty(key);
      } else {
        dom.style.setProperty(key, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == void 0) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    // Listen to option element changes
    childList: true,
    subtree: true,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}
const CLASS = Symbol("class");
const STYLE = Symbol("style");
const IS_CUSTOM_ELEMENT = Symbol("is custom element");
const IS_HTML = Symbol("is html");
function set_selected(element, selected) {
  if (selected) {
    if (!element.hasAttribute("selected")) {
      element.setAttribute("selected", "");
    }
  } else {
    element.removeAttribute("selected");
  }
}
function set_attribute(element, attribute, value, skip_warning) {
  var attributes = get_attributes(element);
  if (attributes[attribute] === (attributes[attribute] = value)) return;
  if (attribute === "loading") {
    element[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
    element[attribute] = value;
  } else {
    element.setAttribute(attribute, value);
  }
}
function set_attributes(element, prev, next, css_hash, skip_warning = false) {
  var attributes = get_attributes(element);
  var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
  var preserve_attribute_case = !attributes[IS_HTML];
  var current = prev || {};
  var is_option_element = element.tagName === "OPTION";
  for (var key in prev) {
    if (!(key in next)) {
      next[key] = null;
    }
  }
  if (next.class) {
    next.class = clsx(next.class);
  } else if (next[CLASS]) {
    next.class = null;
  }
  if (next[STYLE]) {
    next.style ??= null;
  }
  var setters = get_setters(element);
  for (const key2 in next) {
    let value = next[key2];
    if (is_option_element && key2 === "value" && value == null) {
      element.value = element.__value = "";
      current[key2] = value;
      continue;
    }
    if (key2 === "class") {
      var is_html = element.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
      current[key2] = value;
      current[CLASS] = next[CLASS];
      continue;
    }
    if (key2 === "style") {
      set_style(element, value, prev?.[STYLE], next[STYLE]);
      current[key2] = value;
      current[STYLE] = next[STYLE];
      continue;
    }
    var prev_value = current[key2];
    if (value === prev_value && !(value === void 0 && element.hasAttribute(key2))) {
      continue;
    }
    current[key2] = value;
    var prefix = key2[0] + key2[1];
    if (prefix === "$$") continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key2;
      let event_name = key2.slice(2);
      var delegated = is_delegated(event_name);
      if (is_capture_event(event_name)) {
        event_name = event_name.slice(0, -7);
        opts.capture = true;
      }
      if (!delegated && prev_value) {
        if (value != null) continue;
        element.removeEventListener(event_name, current[event_handle_key], opts);
        current[event_handle_key] = null;
      }
      if (value != null) {
        if (!delegated) {
          let handle = function(evt) {
            current[key2].call(this, evt);
          };
          current[event_handle_key] = create_event(event_name, element, handle, opts);
        } else {
          element[`__${event_name}`] = value;
          delegate([event_name]);
        }
      } else if (delegated) {
        element[`__${event_name}`] = void 0;
      }
    } else if (key2 === "style") {
      set_attribute(element, key2, value);
    } else if (key2 === "autofocus") {
      autofocus(
        /** @type {HTMLElement} */
        element,
        Boolean(value)
      );
    } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
      element.value = element.__value = value;
    } else if (key2 === "selected" && is_option_element) {
      set_selected(
        /** @type {HTMLOptionElement} */
        element,
        value
      );
    } else {
      var name = key2;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key2] = null;
        if (name === "value" || name === "checked") {
          let input = (
            /** @type {HTMLInputElement} */
            element
          );
          const use_default = prev === void 0;
          if (name === "value") {
            let previous = input.defaultValue;
            input.removeAttribute(name);
            input.defaultValue = previous;
            input.value = input.__value = use_default ? previous : null;
          } else {
            let previous = input.defaultChecked;
            input.removeAttribute(name);
            input.defaultChecked = previous;
            input.checked = use_default ? previous : false;
          }
        } else {
          element.removeAttribute(key2);
        }
      } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
        element[name] = value;
        if (name in attributes) attributes[name] = UNINITIALIZED;
      } else if (typeof value !== "function") {
        set_attribute(element, name, value);
      }
    }
  }
  return current;
}
function attribute_effect(element, fn, sync = [], async = [], css_hash, skip_warning = false) {
  flatten(sync, async, (values) => {
    var prev = void 0;
    var effects = {};
    var is_select = element.nodeName === "SELECT";
    var inited = false;
    block(() => {
      var next = fn(...values.map(get));
      var current = set_attributes(element, prev, next, css_hash, skip_warning);
      if (inited && is_select && "value" in next) {
        select_option(
          /** @type {HTMLSelectElement} */
          element,
          next.value
        );
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next[symbol]) destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next)) {
        var n = next[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol]) destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element, () => n));
        }
        current[symbol] = n;
      }
      prev = current;
    });
    if (is_select) {
      var select = (
        /** @type {HTMLSelectElement} */
        element
      );
      effect(() => {
        select_option(
          select,
          /** @type {Record<string | symbol, any>} */
          prev.value,
          true
        );
        init_select(select);
      });
    }
    inited = true;
  });
}
function get_attributes(element) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    element.__attributes ??= {
      [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
      [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
    }
  );
}
var setters_cache = /* @__PURE__ */ new Map();
function get_setters(element) {
  var setters = setters_cache.get(element.nodeName);
  if (setters) return setters;
  setters_cache.set(element.nodeName, setters = []);
  var descriptors;
  var proto = element;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set) {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function bind_value(input, get2, set2 = get2) {
  var runes = is_runes();
  var batches2 = /* @__PURE__ */ new WeakSet();
  listen_to_event_and_reset_event(input, "input", (is_reset) => {
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
    if (runes && value !== (value = get2())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      input.value = value ?? "";
      if (end !== null) {
        input.selectionStart = start;
        input.selectionEnd = Math.min(end, input.value.length);
      }
    }
  });
  if (
    // If we are hydrating and the value has since changed,
    // then use the updated value from the input instead.
    // If defaultValue is set, then value == defaultValue
    // TODO Svelte 6: remove input.value check and set to empty string?
    untrack(get2) == null && input.value
  ) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches2.add(current_batch);
    }
  }
  render_effect(() => {
    var value = get2();
    if (input === document.activeElement) {
      var batch = (
        /** @type {Batch} */
        previous_batch ?? current_batch
      );
      if (batches2.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
function init(immutable = false) {
  const context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  const callbacks = context.l.u;
  if (!callbacks) return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = (
      /** @type {Record<string, any>} */
      {}
    );
    const d = /* @__PURE__ */ derived(() => {
      let changed = false;
      const props2 = context.s;
      for (const key in props2) {
        if (props2[key] !== prev[key]) {
          prev[key] = props2[key];
          changed = true;
        }
      }
      if (changed) version++;
      return version;
    });
    props = () => get(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s) get(signal);
  }
  props();
}
let is_store_binding = false;
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}
const rest_props_handler = {
  get(target, key) {
    if (target.exclude.includes(key)) return;
    return target.props[key];
  },
  set(target, key) {
    return false;
  },
  getOwnPropertyDescriptor(target, key) {
    if (target.exclude.includes(key)) return;
    if (key in target.props) {
      return {
        enumerable: true,
        configurable: true,
        value: target.props[key]
      };
    }
  },
  has(target, key) {
    if (target.exclude.includes(key)) return false;
    return key in target.props;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
  }
};
// @__NO_SIDE_EFFECTS__
function rest_props(props, exclude, name) {
  return new Proxy(
    { props, exclude },
    rest_props_handler
  );
}
const spread_props_handler = {
  get(target, key) {
    let i = target.props.length;
    while (i--) {
      let p2 = target.props[i];
      if (is_function(p2)) p2 = p2();
      if (typeof p2 === "object" && p2 !== null && key in p2) return p2[key];
    }
  },
  set(target, key, value) {
    let i = target.props.length;
    while (i--) {
      let p2 = target.props[i];
      if (is_function(p2)) p2 = p2();
      const desc = get_descriptor(p2, key);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key) {
    let i = target.props.length;
    while (i--) {
      let p2 = target.props[i];
      if (is_function(p2)) p2 = p2();
      if (typeof p2 === "object" && p2 !== null && key in p2) {
        const descriptor = get_descriptor(p2, key);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target, key) {
    if (key === STATE_SYMBOL || key === LEGACY_PROPS) return false;
    for (let p2 of target.props) {
      if (is_function(p2)) p2 = p2();
      if (p2 != null && key in p2) return true;
    }
    return false;
  },
  ownKeys(target) {
    const keys = [];
    for (let p2 of target.props) {
      if (is_function(p2)) p2 = p2();
      if (!p2) continue;
      for (const key in p2) {
        if (!keys.includes(key)) keys.push(key);
      }
      for (const key of Object.getOwnPropertySymbols(p2)) {
        if (!keys.includes(key)) keys.push(key);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key, flags, fallback) {
  var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
  var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = (
    /** @type {V} */
    fallback
  );
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(
        /** @type {() => V} */
        fallback
      ) : (
        /** @type {V} */
        fallback
      );
    }
    return fallback_value;
  };
  var setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key];
  }
  if (initial_value === void 0 && fallback !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      if (runes) props_invalid_value();
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key]
      );
      if (value === void 0) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key]
      );
      if (value !== void 0) {
        fallback_value = /** @type {V} */
        void 0;
      }
      return value === void 0 ? fallback_value : value;
    };
  }
  if (runes && (flags & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return (
      /** @type {() => V} */
      (function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        }
        return getter();
      })
    );
  }
  var overridden = false;
  var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (bindable) get(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return (
    /** @type {() => V} */
    (function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
        set(d, new_value);
        overridden = true;
        if (fallback_value !== void 0) {
          fallback_value = new_value;
        }
        return value;
      }
      if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
        return d.v;
      }
      return get(d);
    })
  );
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
const CLASS_VALUE_PRIMITIVE_TYPES = ["string", "number", "bigint", "boolean"];
function isClassValue(value) {
  if (value === null || value === void 0)
    return true;
  if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value))
    return true;
  if (Array.isArray(value))
    return value.every((item) => isClassValue(item));
  if (typeof value === "object") {
    if (Object.getPrototypeOf(value) !== Object.prototype)
      return false;
    return true;
  }
  return false;
}
const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");
function isBox(value) {
  return isObject(value) && BoxSymbol in value;
}
function isWritableBox(value) {
  return box.isBox(value) && isWritableSymbol in value;
}
function box(initialValue) {
  let current = /* @__PURE__ */ state(proxy(initialValue));
  return {
    [BoxSymbol]: true,
    [isWritableSymbol]: true,
    get current() {
      return get(current);
    },
    set current(v) {
      set(current, v, true);
    }
  };
}
function boxWith(getter, setter) {
  const derived2 = /* @__PURE__ */ user_derived(getter);
  if (setter) {
    return {
      [BoxSymbol]: true,
      [isWritableSymbol]: true,
      get current() {
        return get(derived2);
      },
      set current(v) {
        setter(v);
      }
    };
  }
  return {
    [BoxSymbol]: true,
    get current() {
      return getter();
    }
  };
}
function boxFrom(value) {
  if (box.isBox(value)) return value;
  if (isFunction(value)) return box.with(value);
  return box(value);
}
function boxFlatten(boxes) {
  return Object.entries(boxes).reduce(
    (acc, [key, b]) => {
      if (!box.isBox(b)) {
        return Object.assign(acc, { [key]: b });
      }
      if (box.isWritableBox(b)) {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set(v) {
            b.current = v;
          }
        });
      } else {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          }
        });
      }
      return acc;
    },
    {}
  );
}
function toReadonlyBox(b) {
  if (!box.isWritableBox(b)) return b;
  return {
    [BoxSymbol]: true,
    get current() {
      return b.current;
    }
  };
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
function composeHandlers(...handlers) {
  return function(e) {
    for (const handler of handlers) {
      if (!handler)
        continue;
      if (e.defaultPrevented)
        return;
      if (typeof handler === "function") {
        handler.call(this, e);
      } else {
        handler.current?.call(this, e);
      }
    }
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var cjs = {};
var inlineStyleParser;
var hasRequiredInlineStyleParser;
function requireInlineStyleParser() {
  if (hasRequiredInlineStyleParser) return inlineStyleParser;
  hasRequiredInlineStyleParser = 1;
  var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
  var NEWLINE_REGEX = /\n/g;
  var WHITESPACE_REGEX = /^\s*/;
  var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
  var COLON_REGEX = /^:\s*/;
  var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
  var SEMICOLON_REGEX = /^[;\s]*/;
  var TRIM_REGEX = /^\s+|\s+$/g;
  var NEWLINE = "\n";
  var FORWARD_SLASH = "/";
  var ASTERISK = "*";
  var EMPTY_STRING = "";
  var TYPE_COMMENT = "comment";
  var TYPE_DECLARATION = "declaration";
  inlineStyleParser = function(style, options) {
    if (typeof style !== "string") {
      throw new TypeError("First argument must be a string");
    }
    if (!style) return [];
    options = options || {};
    var lineno = 1;
    var column = 1;
    function updatePosition(str) {
      var lines = str.match(NEWLINE_REGEX);
      if (lines) lineno += lines.length;
      var i = str.lastIndexOf(NEWLINE);
      column = ~i ? str.length - i : column + str.length;
    }
    function position() {
      var start = { line: lineno, column };
      return function(node) {
        node.position = new Position(start);
        whitespace2();
        return node;
      };
    }
    function Position(start) {
      this.start = start;
      this.end = { line: lineno, column };
      this.source = options.source;
    }
    Position.prototype.content = style;
    function error(msg) {
      var err = new Error(
        options.source + ":" + lineno + ":" + column + ": " + msg
      );
      err.reason = msg;
      err.filename = options.source;
      err.line = lineno;
      err.column = column;
      err.source = style;
      if (options.silent) ;
      else {
        throw err;
      }
    }
    function match(re) {
      var m = re.exec(style);
      if (!m) return;
      var str = m[0];
      updatePosition(str);
      style = style.slice(str.length);
      return m;
    }
    function whitespace2() {
      match(WHITESPACE_REGEX);
    }
    function comments(rules) {
      var c;
      rules = rules || [];
      while (c = comment2()) {
        if (c !== false) {
          rules.push(c);
        }
      }
      return rules;
    }
    function comment2() {
      var pos = position();
      if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
      var i = 2;
      while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) {
        ++i;
      }
      i += 2;
      if (EMPTY_STRING === style.charAt(i - 1)) {
        return error("End of comment missing");
      }
      var str = style.slice(2, i - 2);
      column += 2;
      updatePosition(str);
      style = style.slice(i);
      column += 2;
      return pos({
        type: TYPE_COMMENT,
        comment: str
      });
    }
    function declaration() {
      var pos = position();
      var prop2 = match(PROPERTY_REGEX);
      if (!prop2) return;
      comment2();
      if (!match(COLON_REGEX)) return error("property missing ':'");
      var val = match(VALUE_REGEX);
      var ret = pos({
        type: TYPE_DECLARATION,
        property: trim(prop2[0].replace(COMMENT_REGEX, EMPTY_STRING)),
        value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
      });
      match(SEMICOLON_REGEX);
      return ret;
    }
    function declarations() {
      var decls = [];
      comments(decls);
      var decl;
      while (decl = declaration()) {
        if (decl !== false) {
          decls.push(decl);
          comments(decls);
        }
      }
      return decls;
    }
    whitespace2();
    return declarations();
  };
  function trim(str) {
    return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
  }
  return inlineStyleParser;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var __importDefault = cjs && cjs.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(cjs, "__esModule", { value: true });
  cjs.default = StyleToObject2;
  var inline_style_parser_1 = __importDefault(requireInlineStyleParser());
  function StyleToObject2(style, iterator) {
    var styleObject = null;
    if (!style || typeof style !== "string") {
      return styleObject;
    }
    var declarations = (0, inline_style_parser_1.default)(style);
    var hasIterator = typeof iterator === "function";
    declarations.forEach(function(declaration) {
      if (declaration.type !== "declaration") {
        return;
      }
      var property = declaration.property, value = declaration.value;
      if (hasIterator) {
        iterator(property, value, declaration);
      } else if (value) {
        styleObject = styleObject || {};
        styleObject[property] = value;
      }
    });
    return styleObject;
  }
  return cjs;
}
var cjsExports = requireCjs();
const StyleToObject = /* @__PURE__ */ getDefaultExportFromCjs(cjsExports);
const parse = StyleToObject.default || StyleToObject;
const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char))
    return void 0;
  return char !== char.toLowerCase();
}
function splitByCase(str) {
  const parts = [];
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = STR_SPLITTERS.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function pascalCase(str) {
  if (!str)
    return "";
  return splitByCase(str).map((p2) => upperFirst(p2)).join("");
}
function camelCase(str) {
  return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function cssToStyleObj(css) {
  if (!css)
    return {};
  const styleObj = {};
  function iterator(name, value) {
    if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
      styleObj[pascalCase(name)] = value;
      return;
    }
    if (name.startsWith("--")) {
      styleObj[name] = value;
      return;
    }
    styleObj[camelCase(name)] = value;
  }
  parse(css, iterator);
  return styleObj;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function createParser(matcher, replacer) {
  const regex = RegExp(matcher, "g");
  return (str) => {
    if (typeof str !== "string") {
      throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
    }
    if (!str.match(regex))
      return str;
    return str.replace(regex, replacer);
  };
}
const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
  }
  return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
function styleToString(style = {}) {
  return styleToCSS(style).replace("\n", " ");
}
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  transform: "translateX(-100%)"
};
const srOnlyStylesString = styleToString(srOnlyStyles);
const EVENT_LIST = [
  "onabort",
  "onanimationcancel",
  "onanimationend",
  "onanimationiteration",
  "onanimationstart",
  "onauxclick",
  "onbeforeinput",
  "onbeforetoggle",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncompositionend",
  "oncompositionstart",
  "oncompositionupdate",
  "oncontextlost",
  "oncontextmenu",
  "oncontextrestored",
  "oncopy",
  "oncuechange",
  "oncut",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onfocusin",
  "onfocusout",
  "onformdata",
  "ongotpointercapture",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onlostpointercapture",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onpaste",
  "onpause",
  "onplay",
  "onplaying",
  "onpointercancel",
  "onpointerdown",
  "onpointerenter",
  "onpointerleave",
  "onpointermove",
  "onpointerout",
  "onpointerover",
  "onpointerup",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onscroll",
  "onscrollend",
  "onsecuritypolicyviolation",
  "onseeked",
  "onseeking",
  "onselect",
  "onselectionchange",
  "onselectstart",
  "onslotchange",
  "onstalled",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "ontouchcancel",
  "ontouchend",
  "ontouchmove",
  "ontouchstart",
  "ontransitioncancel",
  "ontransitionend",
  "ontransitionrun",
  "ontransitionstart",
  "onvolumechange",
  "onwaiting",
  "onwebkitanimationend",
  "onwebkitanimationiteration",
  "onwebkitanimationstart",
  "onwebkittransitionend",
  "onwheel"
];
const EVENT_LIST_SET = new Set(EVENT_LIST);
function isEventHandler(key) {
  return EVENT_LIST_SET.has(key);
}
function mergeProps(...args) {
  const result = { ...args[0] };
  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    if (!props)
      continue;
    for (const key of Object.keys(props)) {
      const a2 = result[key];
      const b = props[key];
      const aIsFunction = typeof a2 === "function";
      const bIsFunction = typeof b === "function";
      if (aIsFunction && typeof bIsFunction && isEventHandler(key)) {
        const aHandler = a2;
        const bHandler = b;
        result[key] = composeHandlers(aHandler, bHandler);
      } else if (aIsFunction && bIsFunction) {
        result[key] = executeCallbacks(a2, b);
      } else if (key === "class") {
        const aIsClassValue = isClassValue(a2);
        const bIsClassValue = isClassValue(b);
        if (aIsClassValue && bIsClassValue) {
          result[key] = clsx$1(a2, b);
        } else if (aIsClassValue) {
          result[key] = clsx$1(a2);
        } else if (bIsClassValue) {
          result[key] = clsx$1(b);
        }
      } else if (key === "style") {
        const aIsObject = typeof a2 === "object";
        const bIsObject = typeof b === "object";
        const aIsString = typeof a2 === "string";
        const bIsString = typeof b === "string";
        if (aIsObject && bIsObject) {
          result[key] = { ...a2, ...b };
        } else if (aIsObject && bIsString) {
          const parsedStyle = cssToStyleObj(b);
          result[key] = { ...a2, ...parsedStyle };
        } else if (aIsString && bIsObject) {
          const parsedStyle = cssToStyleObj(a2);
          result[key] = { ...parsedStyle, ...b };
        } else if (aIsString && bIsString) {
          const parsedStyleA = cssToStyleObj(a2);
          const parsedStyleB = cssToStyleObj(b);
          result[key] = { ...parsedStyleA, ...parsedStyleB };
        } else if (aIsObject) {
          result[key] = a2;
        } else if (bIsObject) {
          result[key] = b;
        } else if (aIsString) {
          result[key] = a2;
        } else if (bIsString) {
          result[key] = b;
        }
      } else {
        result[key] = b !== void 0 ? b : a2;
      }
    }
    for (const key of Object.getOwnPropertySymbols(props)) {
      const a2 = result[key];
      const b = props[key];
      result[key] = b !== void 0 ? b : a2;
    }
  }
  if (typeof result.style === "object") {
    result.style = styleToString(result.style).replaceAll("\n", " ");
  }
  if (result.hidden !== true) {
    result.hidden = void 0;
    delete result.hidden;
  }
  if (result.disabled !== true) {
    result.disabled = void 0;
    delete result.disabled;
  }
  return result;
}
const defaultWindow$1 = typeof window !== "undefined" ? window : void 0;
function getActiveElement$2(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
let ActiveElement$1 = class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window: window2 = defaultWindow$1, document: document2 = window2?.document } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber((update) => {
      const cleanupFocusIn = on(window2, "focusin", update);
      const cleanupFocusOut = on(window2, "focusout", update);
      return () => {
        cleanupFocusIn();
        cleanupFocusOut();
      };
    });
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement$2(this.#document);
  }
};
new ActiveElement$1();
function onDestroyEffect(fn) {
  user_effect(() => {
    return () => {
      fn();
    };
  });
}
const DOCUMENT_NODE = 9;
function isDocument(node) {
  return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
  return isObject(node) && node.constructor?.name === "VisualViewport";
}
function getDocument(node) {
  if (isDocument(node))
    return node;
  if (isWindow(node))
    return node.document;
  return node?.ownerDocument ?? document;
}
function getActiveElement$1(rootNode) {
  let activeElement = rootNode.activeElement;
  while (activeElement?.shadowRoot) {
    const el = activeElement.shadowRoot.activeElement;
    if (el === activeElement)
      break;
    else
      activeElement = el;
  }
  return activeElement;
}
class DOMContext {
  element;
  #root = /* @__PURE__ */ user_derived(() => {
    if (!this.element.current) return document;
    const rootNode = this.element.current.getRootNode() ?? document;
    return rootNode;
  });
  get root() {
    return get(this.#root);
  }
  set root(value) {
    set(this.#root, value);
  }
  constructor(element) {
    if (typeof element === "function") {
      this.element = box.with(element);
    } else {
      this.element = element;
    }
  }
  getDocument = () => {
    return getDocument(this.root);
  };
  getWindow = () => {
    return this.getDocument().defaultView ?? window;
  };
  getActiveElement = () => {
    return getActiveElement$1(this.root);
  };
  isActiveElement = (node) => {
    return node === this.getActiveElement();
  };
  getElementById(id) {
    return this.root.getElementById(id);
  }
  querySelector = (selector) => {
    if (!this.root) return null;
    return this.root.querySelector(selector);
  };
  querySelectorAll = (selector) => {
    if (!this.root) return [];
    return this.root.querySelectorAll(selector);
  };
  setTimeout = (callback, delay) => {
    return this.getWindow().setTimeout(callback, delay);
  };
  clearTimeout = (timeoutId) => {
    return this.getWindow().clearTimeout(timeoutId);
  };
}
function attachRef(ref, onChange) {
  return {
    [createAttachmentKey()]: (node) => {
      if (box.isBox(ref)) {
        ref.current = node;
        untrack$1(() => onChange?.(node));
        return () => {
          if ("isConnected" in node && node.isConnected)
            return;
          ref.current = null;
          onChange?.(null);
        };
      }
      ref(node);
      untrack$1(() => onChange?.(node));
      return () => {
        if ("isConnected" in node && node.isConnected)
          return;
        ref(null);
        onChange?.(null);
      };
    }
  };
}
const defaultWindow = typeof window !== "undefined" ? window : void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
class ActiveElement2 {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window: window2 = defaultWindow, document: document2 = window2?.document } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber((update) => {
      const cleanupFocusIn = on(window2, "focusin", update);
      const cleanupFocusOut = on(window2, "focusout", update);
      return () => {
        cleanupFocusIn();
        cleanupFocusOut();
      };
    });
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement2();
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
function runEffect(flush, effect2) {
  switch (flush) {
    case "post":
      user_effect(effect2);
      break;
    case "pre":
      user_pre_effect(effect2);
      break;
  }
}
function runWatcher(sources, flush, effect2, options = {}) {
  const { lazy = false } = options;
  let active = !lazy;
  let previousValues = Array.isArray(sources) ? [] : void 0;
  runEffect(flush, () => {
    const values = Array.isArray(sources) ? sources.map((source2) => source2()) : sources();
    if (!active) {
      active = true;
      previousValues = values;
      return;
    }
    const cleanup = untrack$1(() => effect2(values, previousValues));
    previousValues = values;
    return cleanup;
  });
}
function watch(sources, effect2, options) {
  runWatcher(sources, "post", effect2, options);
}
function watchPre(sources, effect2, options) {
  runWatcher(sources, "pre", effect2, options);
}
watch.pre = watchPre;
function getAriaDisabled(condition) {
  return condition ? "true" : "false";
}
function getAriaReadonly(condition) {
  return condition ? "true" : "false";
}
function getDataDisabled(condition) {
  return condition ? "" : void 0;
}
function getAriaHidden(condition) {
  return condition ? "true" : void 0;
}
function getAriaInvalid(condition) {
  return condition ? "true" : void 0;
}
function getDataInvalid(condition) {
  return condition ? "" : void 0;
}
function getDataReadonly(condition) {
  return condition ? "" : void 0;
}
class BitsAttrs {
  #variant;
  #prefix;
  attrs;
  constructor(config) {
    this.#variant = config.getVariant ? config.getVariant() : null;
    this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config.component}-`;
    this.getAttr = this.getAttr.bind(this);
    this.selector = this.selector.bind(this);
    this.attrs = Object.fromEntries(config.parts.map((part) => [part, this.getAttr(part)]));
  }
  getAttr(part, variantOverride) {
    if (variantOverride)
      return `data-${variantOverride}-${part}`;
    return `${this.#prefix}${part}`;
  }
  selector(part, variantOverride) {
    return `[${this.getAttr(part, variantOverride)}]`;
  }
}
function createBitsAttrs(config) {
  const bitsAttrs = new BitsAttrs(config);
  return {
    ...bitsAttrs.attrs,
    selector: bitsAttrs.selector,
    getAttr: bitsAttrs.getAttr
  };
}
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const ARROW_UP = "ArrowUp";
const BACKSPACE = "Backspace";
const ENTER = "Enter";
const SPACE = " ";
const TAB = "Tab";
const a = "a";
const P = "P";
const A = "A";
const p = "p";
const isBrowser = typeof document !== "undefined";
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isNumberString(value) {
  return !Number.isNaN(Number(value)) && !Number.isNaN(Number.parseFloat(value));
}
function isNull(value) {
  return value === null;
}
function noop() {
}
function createId(prefixOrUid, uid) {
  return `bits-${prefixOrUid}`;
}
const BitsConfigContext = new Context("BitsConfig");
function getBitsConfig() {
  const fallback = new BitsConfigState(null, {});
  return BitsConfigContext.getOr(fallback).opts;
}
class BitsConfigState {
  opts;
  constructor(parent, opts) {
    const resolveConfigOption = createConfigResolver(parent, opts);
    this.opts = {
      defaultPortalTo: resolveConfigOption((config) => config.defaultPortalTo),
      defaultLocale: resolveConfigOption((config) => config.defaultLocale)
    };
  }
}
function createConfigResolver(parent, currentOpts) {
  return (getter) => {
    const configOption = box.with(() => {
      const value = getter(currentOpts)?.current;
      if (value !== void 0)
        return value;
      if (parent === null)
        return void 0;
      return getter(parent.opts)?.current;
    });
    return configOption;
  };
}
function createPropResolver(configOption, fallback) {
  return (getProp) => {
    const config = getBitsConfig();
    return box.with(() => {
      const propValue = getProp();
      if (propValue !== void 0)
        return propValue;
      const option = configOption(config).current;
      if (option !== void 0)
        return option;
      return fallback;
    });
  };
}
const resolveLocaleProp = createPropResolver((config) => config.defaultLocale, "en");
globalThis.bitsIdCounter ??= { current: 0 };
function useId(prefix = "bits") {
  globalThis.bitsIdCounter.current++;
  return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
function $2b4dce13dd5a17fa$export$842a2cf37af977e1(amount, numerator) {
  return amount - numerator * Math.floor(amount / numerator);
}
const $3b62074eb05584b2$var$EPOCH = 1721426;
function $3b62074eb05584b2$export$f297eb839006d339(era, year, month, day) {
  year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(era, year);
  let y1 = year - 1;
  let monthOffset = -2;
  if (month <= 2) monthOffset = 0;
  else if ($3b62074eb05584b2$export$553d7fa8e3805fc0(year)) monthOffset = -1;
  return $3b62074eb05584b2$var$EPOCH - 1 + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) + Math.floor((367 * month - 362) / 12 + monthOffset + day);
}
function $3b62074eb05584b2$export$553d7fa8e3805fc0(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function $3b62074eb05584b2$export$c36e0ecb2d4fa69d(era, year) {
  return era === "BC" ? 1 - year : year;
}
function $3b62074eb05584b2$export$4475b7e617eb123c(year) {
  let era = "AD";
  if (year <= 0) {
    era = "BC";
    year = 1 - year;
  }
  return [
    era,
    year
  ];
}
const $3b62074eb05584b2$var$daysInMonth = {
  standard: [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ],
  leapyear: [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]
};
class $3b62074eb05584b2$export$80ee6245ec4f29ec {
  fromJulianDay(jd) {
    let jd0 = jd;
    let depoch = jd0 - $3b62074eb05584b2$var$EPOCH;
    let quadricent = Math.floor(depoch / 146097);
    let dqc = $2b4dce13dd5a17fa$export$842a2cf37af977e1(depoch, 146097);
    let cent = Math.floor(dqc / 36524);
    let dcent = $2b4dce13dd5a17fa$export$842a2cf37af977e1(dqc, 36524);
    let quad = Math.floor(dcent / 1461);
    let dquad = $2b4dce13dd5a17fa$export$842a2cf37af977e1(dcent, 1461);
    let yindex = Math.floor(dquad / 365);
    let extendedYear = quadricent * 400 + cent * 100 + quad * 4 + yindex + (cent !== 4 && yindex !== 4 ? 1 : 0);
    let [era, year] = $3b62074eb05584b2$export$4475b7e617eb123c(extendedYear);
    let yearDay = jd0 - $3b62074eb05584b2$export$f297eb839006d339(era, year, 1, 1);
    let leapAdj = 2;
    if (jd0 < $3b62074eb05584b2$export$f297eb839006d339(era, year, 3, 1)) leapAdj = 0;
    else if ($3b62074eb05584b2$export$553d7fa8e3805fc0(year)) leapAdj = 1;
    let month = Math.floor(((yearDay + leapAdj) * 12 + 373) / 367);
    let day = jd0 - $3b62074eb05584b2$export$f297eb839006d339(era, year, month, 1) + 1;
    return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(era, year, month, day);
  }
  toJulianDay(date) {
    return $3b62074eb05584b2$export$f297eb839006d339(date.era, date.year, date.month, date.day);
  }
  getDaysInMonth(date) {
    return $3b62074eb05584b2$var$daysInMonth[$3b62074eb05584b2$export$553d7fa8e3805fc0(date.year) ? "leapyear" : "standard"][date.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(date) {
    return 12;
  }
  getDaysInYear(date) {
    return $3b62074eb05584b2$export$553d7fa8e3805fc0(date.year) ? 366 : 365;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getYearsInEra(date) {
    return 9999;
  }
  getEras() {
    return [
      "BC",
      "AD"
    ];
  }
  isInverseEra(date) {
    return date.era === "BC";
  }
  balanceDate(date) {
    if (date.year <= 0) {
      date.era = date.era === "BC" ? "AD" : "BC";
      date.year = 1 - date.year;
    }
  }
  constructor() {
    this.identifier = "gregory";
  }
}
function $14e0f24ef4ac5c92$export$dbc69fd56b53d5e(a2, b) {
  var _a_isEqual, _b_isEqual;
  var _a_isEqual1, _ref;
  return (_ref = (_a_isEqual1 = (_a_isEqual = a2.isEqual) === null || _a_isEqual === void 0 ? void 0 : _a_isEqual.call(a2, b)) !== null && _a_isEqual1 !== void 0 ? _a_isEqual1 : (_b_isEqual = b.isEqual) === null || _b_isEqual === void 0 ? void 0 : _b_isEqual.call(b, a2)) !== null && _ref !== void 0 ? _ref : a2.identifier === b.identifier;
}
function $14e0f24ef4ac5c92$export$68781ddf31c0090f(a2, b) {
  return a2.calendar.toJulianDay(a2) - b.calendar.toJulianDay(b);
}
function $14e0f24ef4ac5c92$export$c19a80a9721b80f6(a2, b) {
  return $14e0f24ef4ac5c92$var$timeToMs(a2) - $14e0f24ef4ac5c92$var$timeToMs(b);
}
function $14e0f24ef4ac5c92$var$timeToMs(a2) {
  return a2.hour * 36e5 + a2.minute * 6e4 + a2.second * 1e3 + a2.millisecond;
}
let $14e0f24ef4ac5c92$var$localTimeZone = null;
function $14e0f24ef4ac5c92$export$aa8b41735afcabd2() {
  if ($14e0f24ef4ac5c92$var$localTimeZone == null) $14e0f24ef4ac5c92$var$localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  return $14e0f24ef4ac5c92$var$localTimeZone;
}
function $11d87f3f76e88657$export$bd4fb2bc8bb06fb(date) {
  date = $11d87f3f76e88657$export$b4a036af3fc0b032(date, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
  let year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(date.era, date.year);
  return $11d87f3f76e88657$var$epochFromParts(year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
}
function $11d87f3f76e88657$var$epochFromParts(year, month, day, hour, minute, second, millisecond) {
  let date = /* @__PURE__ */ new Date();
  date.setUTCHours(hour, minute, second, millisecond);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}
function $11d87f3f76e88657$export$59c99f3515d3493f(ms, timeZone) {
  if (timeZone === "UTC") return 0;
  if (ms > 0 && timeZone === $14e0f24ef4ac5c92$export$aa8b41735afcabd2()) return new Date(ms).getTimezoneOffset() * -6e4;
  let { year, month, day, hour, minute, second } = $11d87f3f76e88657$var$getTimeZoneParts(ms, timeZone);
  let utc = $11d87f3f76e88657$var$epochFromParts(year, month, day, hour, minute, second, 0);
  return utc - Math.floor(ms / 1e3) * 1e3;
}
const $11d87f3f76e88657$var$formattersByTimeZone = /* @__PURE__ */ new Map();
function $11d87f3f76e88657$var$getTimeZoneParts(ms, timeZone) {
  let formatter = $11d87f3f76e88657$var$formattersByTimeZone.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      era: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    $11d87f3f76e88657$var$formattersByTimeZone.set(timeZone, formatter);
  }
  let parts = formatter.formatToParts(new Date(ms));
  let namedParts = {};
  for (let part of parts) if (part.type !== "literal") namedParts[part.type] = part.value;
  return {
    // Firefox returns B instead of BC... https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
    year: namedParts.era === "BC" || namedParts.era === "B" ? -namedParts.year + 1 : +namedParts.year,
    month: +namedParts.month,
    day: +namedParts.day,
    hour: namedParts.hour === "24" ? 0 : +namedParts.hour,
    minute: +namedParts.minute,
    second: +namedParts.second
  };
}
const $11d87f3f76e88657$var$DAYMILLIS = 864e5;
function $11d87f3f76e88657$var$getValidWallTimes(date, timeZone, earlier, later) {
  let found = earlier === later ? [
    earlier
  ] : [
    earlier,
    later
  ];
  return found.filter((absolute) => $11d87f3f76e88657$var$isValidWallTime(date, timeZone, absolute));
}
function $11d87f3f76e88657$var$isValidWallTime(date, timeZone, absolute) {
  let parts = $11d87f3f76e88657$var$getTimeZoneParts(absolute, timeZone);
  return date.year === parts.year && date.month === parts.month && date.day === parts.day && date.hour === parts.hour && date.minute === parts.minute && date.second === parts.second;
}
function $11d87f3f76e88657$export$5107c82f94518f5c(date, timeZone, disambiguation = "compatible") {
  let dateTime = $11d87f3f76e88657$export$b21e0b124e224484(date);
  if (timeZone === "UTC") return $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime);
  if (timeZone === $14e0f24ef4ac5c92$export$aa8b41735afcabd2() && disambiguation === "compatible") {
    dateTime = $11d87f3f76e88657$export$b4a036af3fc0b032(dateTime, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
    let date2 = /* @__PURE__ */ new Date();
    let year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(dateTime.era, dateTime.year);
    date2.setFullYear(year, dateTime.month - 1, dateTime.day);
    date2.setHours(dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond);
    return date2.getTime();
  }
  let ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime);
  let offsetBefore = $11d87f3f76e88657$export$59c99f3515d3493f(ms - $11d87f3f76e88657$var$DAYMILLIS, timeZone);
  let offsetAfter = $11d87f3f76e88657$export$59c99f3515d3493f(ms + $11d87f3f76e88657$var$DAYMILLIS, timeZone);
  let valid = $11d87f3f76e88657$var$getValidWallTimes(dateTime, timeZone, ms - offsetBefore, ms - offsetAfter);
  if (valid.length === 1) return valid[0];
  if (valid.length > 1) switch (disambiguation) {
    // 'compatible' means 'earlier' for "fall back" transitions
    case "compatible":
    case "earlier":
      return valid[0];
    case "later":
      return valid[valid.length - 1];
    case "reject":
      throw new RangeError("Multiple possible absolute times found");
  }
  switch (disambiguation) {
    case "earlier":
      return Math.min(ms - offsetBefore, ms - offsetAfter);
    // 'compatible' means 'later' for "spring forward" transitions
    case "compatible":
    case "later":
      return Math.max(ms - offsetBefore, ms - offsetAfter);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function $11d87f3f76e88657$export$e67a095c620b86fe(dateTime, timeZone, disambiguation = "compatible") {
  return new Date($11d87f3f76e88657$export$5107c82f94518f5c(dateTime, timeZone, disambiguation));
}
function $11d87f3f76e88657$export$1b96692a1ba042ac(ms, timeZone) {
  let offset = $11d87f3f76e88657$export$59c99f3515d3493f(ms, timeZone);
  let date = new Date(ms + offset);
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate();
  let hour = date.getUTCHours();
  let minute = date.getUTCMinutes();
  let second = date.getUTCSeconds();
  let millisecond = date.getUTCMilliseconds();
  return new $35ea8db9cb2ccb90$export$d3b7288e7994edea(year < 1 ? "BC" : "AD", year < 1 ? -year + 1 : year, month, day, timeZone, offset, hour, minute, second, millisecond);
}
function $11d87f3f76e88657$export$b21e0b124e224484(date, time) {
  let hour = 0, minute = 0, second = 0, millisecond = 0;
  if ("timeZone" in date) ({ hour, minute, second, millisecond } = date);
  else if ("hour" in date && !time) return date;
  if (time) ({ hour, minute, second, millisecond } = time);
  return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(date.calendar, date.era, date.year, date.month, date.day, hour, minute, second, millisecond);
}
function $11d87f3f76e88657$export$b4a036af3fc0b032(date, calendar) {
  if ($14e0f24ef4ac5c92$export$dbc69fd56b53d5e(date.calendar, calendar)) return date;
  let calendarDate = calendar.fromJulianDay(date.calendar.toJulianDay(date));
  let copy = date.copy();
  copy.calendar = calendar;
  copy.era = calendarDate.era;
  copy.year = calendarDate.year;
  copy.month = calendarDate.month;
  copy.day = calendarDate.day;
  $735220c2d4774dd3$export$c4e2ecac49351ef2(copy);
  return copy;
}
function $11d87f3f76e88657$export$84c95a83c799e074(date, timeZone, disambiguation) {
  if (date instanceof $35ea8db9cb2ccb90$export$d3b7288e7994edea) {
    if (date.timeZone === timeZone) return date;
    return $11d87f3f76e88657$export$538b00033cc11c75(date, timeZone);
  }
  let ms = $11d87f3f76e88657$export$5107c82f94518f5c(date, timeZone, disambiguation);
  return $11d87f3f76e88657$export$1b96692a1ba042ac(ms, timeZone);
}
function $11d87f3f76e88657$export$83aac07b4c37b25(date) {
  let ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(date) - date.offset;
  return new Date(ms);
}
function $11d87f3f76e88657$export$538b00033cc11c75(date, timeZone) {
  let ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(date) - date.offset;
  return $11d87f3f76e88657$export$b4a036af3fc0b032($11d87f3f76e88657$export$1b96692a1ba042ac(ms, timeZone), date.calendar);
}
const $735220c2d4774dd3$var$ONE_HOUR = 36e5;
function $735220c2d4774dd3$export$e16d8520af44a096(date, duration) {
  let mutableDate = date.copy();
  let days = "hour" in mutableDate ? $735220c2d4774dd3$var$addTimeFields(mutableDate, duration) : 0;
  $735220c2d4774dd3$var$addYears(mutableDate, duration.years || 0);
  if (mutableDate.calendar.balanceYearMonth) mutableDate.calendar.balanceYearMonth(mutableDate, date);
  mutableDate.month += duration.months || 0;
  $735220c2d4774dd3$var$balanceYearMonth(mutableDate);
  $735220c2d4774dd3$var$constrainMonthDay(mutableDate);
  mutableDate.day += (duration.weeks || 0) * 7;
  mutableDate.day += duration.days || 0;
  mutableDate.day += days;
  $735220c2d4774dd3$var$balanceDay(mutableDate);
  if (mutableDate.calendar.balanceDate) mutableDate.calendar.balanceDate(mutableDate);
  if (mutableDate.year < 1) {
    mutableDate.year = 1;
    mutableDate.month = 1;
    mutableDate.day = 1;
  }
  let maxYear = mutableDate.calendar.getYearsInEra(mutableDate);
  if (mutableDate.year > maxYear) {
    var _mutableDate_calendar_isInverseEra, _mutableDate_calendar;
    let isInverseEra = (_mutableDate_calendar_isInverseEra = (_mutableDate_calendar = mutableDate.calendar).isInverseEra) === null || _mutableDate_calendar_isInverseEra === void 0 ? void 0 : _mutableDate_calendar_isInverseEra.call(_mutableDate_calendar, mutableDate);
    mutableDate.year = maxYear;
    mutableDate.month = isInverseEra ? 1 : mutableDate.calendar.getMonthsInYear(mutableDate);
    mutableDate.day = isInverseEra ? 1 : mutableDate.calendar.getDaysInMonth(mutableDate);
  }
  if (mutableDate.month < 1) {
    mutableDate.month = 1;
    mutableDate.day = 1;
  }
  let maxMonth = mutableDate.calendar.getMonthsInYear(mutableDate);
  if (mutableDate.month > maxMonth) {
    mutableDate.month = maxMonth;
    mutableDate.day = mutableDate.calendar.getDaysInMonth(mutableDate);
  }
  mutableDate.day = Math.max(1, Math.min(mutableDate.calendar.getDaysInMonth(mutableDate), mutableDate.day));
  return mutableDate;
}
function $735220c2d4774dd3$var$addYears(date, years) {
  var _date_calendar_isInverseEra, _date_calendar;
  if ((_date_calendar_isInverseEra = (_date_calendar = date.calendar).isInverseEra) === null || _date_calendar_isInverseEra === void 0 ? void 0 : _date_calendar_isInverseEra.call(_date_calendar, date)) years = -years;
  date.year += years;
}
function $735220c2d4774dd3$var$balanceYearMonth(date) {
  while (date.month < 1) {
    $735220c2d4774dd3$var$addYears(date, -1);
    date.month += date.calendar.getMonthsInYear(date);
  }
  let monthsInYear = 0;
  while (date.month > (monthsInYear = date.calendar.getMonthsInYear(date))) {
    date.month -= monthsInYear;
    $735220c2d4774dd3$var$addYears(date, 1);
  }
}
function $735220c2d4774dd3$var$balanceDay(date) {
  while (date.day < 1) {
    date.month--;
    $735220c2d4774dd3$var$balanceYearMonth(date);
    date.day += date.calendar.getDaysInMonth(date);
  }
  while (date.day > date.calendar.getDaysInMonth(date)) {
    date.day -= date.calendar.getDaysInMonth(date);
    date.month++;
    $735220c2d4774dd3$var$balanceYearMonth(date);
  }
}
function $735220c2d4774dd3$var$constrainMonthDay(date) {
  date.month = Math.max(1, Math.min(date.calendar.getMonthsInYear(date), date.month));
  date.day = Math.max(1, Math.min(date.calendar.getDaysInMonth(date), date.day));
}
function $735220c2d4774dd3$export$c4e2ecac49351ef2(date) {
  if (date.calendar.constrainDate) date.calendar.constrainDate(date);
  date.year = Math.max(1, Math.min(date.calendar.getYearsInEra(date), date.year));
  $735220c2d4774dd3$var$constrainMonthDay(date);
}
function $735220c2d4774dd3$export$3e2544e88a25bff8(duration) {
  let inverseDuration = {};
  for (let key in duration) if (typeof duration[key] === "number") inverseDuration[key] = -duration[key];
  return inverseDuration;
}
function $735220c2d4774dd3$export$4e2d2ead65e5f7e3(date, duration) {
  return $735220c2d4774dd3$export$e16d8520af44a096(date, $735220c2d4774dd3$export$3e2544e88a25bff8(duration));
}
function $735220c2d4774dd3$export$adaa4cf7ef1b65be(date, fields) {
  let mutableDate = date.copy();
  if (fields.era != null) mutableDate.era = fields.era;
  if (fields.year != null) mutableDate.year = fields.year;
  if (fields.month != null) mutableDate.month = fields.month;
  if (fields.day != null) mutableDate.day = fields.day;
  $735220c2d4774dd3$export$c4e2ecac49351ef2(mutableDate);
  return mutableDate;
}
function $735220c2d4774dd3$export$e5d5e1c1822b6e56(value, fields) {
  let mutableValue = value.copy();
  if (fields.hour != null) mutableValue.hour = fields.hour;
  if (fields.minute != null) mutableValue.minute = fields.minute;
  if (fields.second != null) mutableValue.second = fields.second;
  if (fields.millisecond != null) mutableValue.millisecond = fields.millisecond;
  $735220c2d4774dd3$export$7555de1e070510cb(mutableValue);
  return mutableValue;
}
function $735220c2d4774dd3$var$balanceTime(time) {
  time.second += Math.floor(time.millisecond / 1e3);
  time.millisecond = $735220c2d4774dd3$var$nonNegativeMod(time.millisecond, 1e3);
  time.minute += Math.floor(time.second / 60);
  time.second = $735220c2d4774dd3$var$nonNegativeMod(time.second, 60);
  time.hour += Math.floor(time.minute / 60);
  time.minute = $735220c2d4774dd3$var$nonNegativeMod(time.minute, 60);
  let days = Math.floor(time.hour / 24);
  time.hour = $735220c2d4774dd3$var$nonNegativeMod(time.hour, 24);
  return days;
}
function $735220c2d4774dd3$export$7555de1e070510cb(time) {
  time.millisecond = Math.max(0, Math.min(time.millisecond, 1e3));
  time.second = Math.max(0, Math.min(time.second, 59));
  time.minute = Math.max(0, Math.min(time.minute, 59));
  time.hour = Math.max(0, Math.min(time.hour, 23));
}
function $735220c2d4774dd3$var$nonNegativeMod(a2, b) {
  let result = a2 % b;
  if (result < 0) result += b;
  return result;
}
function $735220c2d4774dd3$var$addTimeFields(time, duration) {
  time.hour += duration.hours || 0;
  time.minute += duration.minutes || 0;
  time.second += duration.seconds || 0;
  time.millisecond += duration.milliseconds || 0;
  return $735220c2d4774dd3$var$balanceTime(time);
}
function $735220c2d4774dd3$export$d52ced6badfb9a4c(value, field, amount, options) {
  let mutable = value.copy();
  switch (field) {
    case "era": {
      let eras = value.calendar.getEras();
      let eraIndex = eras.indexOf(value.era);
      if (eraIndex < 0) throw new Error("Invalid era: " + value.era);
      eraIndex = $735220c2d4774dd3$var$cycleValue(eraIndex, amount, 0, eras.length - 1, options === null || options === void 0 ? void 0 : options.round);
      mutable.era = eras[eraIndex];
      $735220c2d4774dd3$export$c4e2ecac49351ef2(mutable);
      break;
    }
    case "year":
      var _mutable_calendar_isInverseEra, _mutable_calendar;
      if ((_mutable_calendar_isInverseEra = (_mutable_calendar = mutable.calendar).isInverseEra) === null || _mutable_calendar_isInverseEra === void 0 ? void 0 : _mutable_calendar_isInverseEra.call(_mutable_calendar, mutable)) amount = -amount;
      mutable.year = $735220c2d4774dd3$var$cycleValue(value.year, amount, -Infinity, 9999, options === null || options === void 0 ? void 0 : options.round);
      if (mutable.year === -Infinity) mutable.year = 1;
      if (mutable.calendar.balanceYearMonth) mutable.calendar.balanceYearMonth(mutable, value);
      break;
    case "month":
      mutable.month = $735220c2d4774dd3$var$cycleValue(value.month, amount, 1, value.calendar.getMonthsInYear(value), options === null || options === void 0 ? void 0 : options.round);
      break;
    case "day":
      mutable.day = $735220c2d4774dd3$var$cycleValue(value.day, amount, 1, value.calendar.getDaysInMonth(value), options === null || options === void 0 ? void 0 : options.round);
      break;
    default:
      throw new Error("Unsupported field " + field);
  }
  if (value.calendar.balanceDate) value.calendar.balanceDate(mutable);
  $735220c2d4774dd3$export$c4e2ecac49351ef2(mutable);
  return mutable;
}
function $735220c2d4774dd3$export$dd02b3e0007dfe28(value, field, amount, options) {
  let mutable = value.copy();
  switch (field) {
    case "hour": {
      let hours = value.hour;
      let min = 0;
      let max = 23;
      if ((options === null || options === void 0 ? void 0 : options.hourCycle) === 12) {
        let isPM = hours >= 12;
        min = isPM ? 12 : 0;
        max = isPM ? 23 : 11;
      }
      mutable.hour = $735220c2d4774dd3$var$cycleValue(hours, amount, min, max, options === null || options === void 0 ? void 0 : options.round);
      break;
    }
    case "minute":
      mutable.minute = $735220c2d4774dd3$var$cycleValue(value.minute, amount, 0, 59, options === null || options === void 0 ? void 0 : options.round);
      break;
    case "second":
      mutable.second = $735220c2d4774dd3$var$cycleValue(value.second, amount, 0, 59, options === null || options === void 0 ? void 0 : options.round);
      break;
    case "millisecond":
      mutable.millisecond = $735220c2d4774dd3$var$cycleValue(value.millisecond, amount, 0, 999, options === null || options === void 0 ? void 0 : options.round);
      break;
    default:
      throw new Error("Unsupported field " + field);
  }
  return mutable;
}
function $735220c2d4774dd3$var$cycleValue(value, amount, min, max, round = false) {
  if (round) {
    value += Math.sign(amount);
    if (value < min) value = max;
    let div = Math.abs(amount);
    if (amount > 0) value = Math.ceil(value / div) * div;
    else value = Math.floor(value / div) * div;
    if (value > max) value = min;
  } else {
    value += amount;
    if (value < min) value = max - (min - value - 1);
    else if (value > max) value = min + (value - max - 1);
  }
  return value;
}
function $735220c2d4774dd3$export$96b1d28349274637(dateTime, duration) {
  let ms;
  if (duration.years != null && duration.years !== 0 || duration.months != null && duration.months !== 0 || duration.weeks != null && duration.weeks !== 0 || duration.days != null && duration.days !== 0) {
    let res2 = $735220c2d4774dd3$export$e16d8520af44a096($11d87f3f76e88657$export$b21e0b124e224484(dateTime), {
      years: duration.years,
      months: duration.months,
      weeks: duration.weeks,
      days: duration.days
    });
    ms = $11d87f3f76e88657$export$5107c82f94518f5c(res2, dateTime.timeZone);
  } else
    ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime) - dateTime.offset;
  ms += duration.milliseconds || 0;
  ms += (duration.seconds || 0) * 1e3;
  ms += (duration.minutes || 0) * 6e4;
  ms += (duration.hours || 0) * 36e5;
  let res = $11d87f3f76e88657$export$1b96692a1ba042ac(ms, dateTime.timeZone);
  return $11d87f3f76e88657$export$b4a036af3fc0b032(res, dateTime.calendar);
}
function $735220c2d4774dd3$export$6814caac34ca03c7(dateTime, duration) {
  return $735220c2d4774dd3$export$96b1d28349274637(dateTime, $735220c2d4774dd3$export$3e2544e88a25bff8(duration));
}
function $735220c2d4774dd3$export$9a297d111fc86b79(dateTime, field, amount, options) {
  switch (field) {
    case "hour": {
      let min = 0;
      let max = 23;
      if ((options === null || options === void 0 ? void 0 : options.hourCycle) === 12) {
        let isPM = dateTime.hour >= 12;
        min = isPM ? 12 : 0;
        max = isPM ? 23 : 11;
      }
      let plainDateTime = $11d87f3f76e88657$export$b21e0b124e224484(dateTime);
      let minDate = $11d87f3f76e88657$export$b4a036af3fc0b032($735220c2d4774dd3$export$e5d5e1c1822b6e56(plainDateTime, {
        hour: min
      }), new $3b62074eb05584b2$export$80ee6245ec4f29ec());
      let minAbsolute = [
        $11d87f3f76e88657$export$5107c82f94518f5c(minDate, dateTime.timeZone, "earlier"),
        $11d87f3f76e88657$export$5107c82f94518f5c(minDate, dateTime.timeZone, "later")
      ].filter((ms2) => $11d87f3f76e88657$export$1b96692a1ba042ac(ms2, dateTime.timeZone).day === minDate.day)[0];
      let maxDate = $11d87f3f76e88657$export$b4a036af3fc0b032($735220c2d4774dd3$export$e5d5e1c1822b6e56(plainDateTime, {
        hour: max
      }), new $3b62074eb05584b2$export$80ee6245ec4f29ec());
      let maxAbsolute = [
        $11d87f3f76e88657$export$5107c82f94518f5c(maxDate, dateTime.timeZone, "earlier"),
        $11d87f3f76e88657$export$5107c82f94518f5c(maxDate, dateTime.timeZone, "later")
      ].filter((ms2) => $11d87f3f76e88657$export$1b96692a1ba042ac(ms2, dateTime.timeZone).day === maxDate.day).pop();
      let ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime) - dateTime.offset;
      let hours = Math.floor(ms / $735220c2d4774dd3$var$ONE_HOUR);
      let remainder = ms % $735220c2d4774dd3$var$ONE_HOUR;
      ms = $735220c2d4774dd3$var$cycleValue(hours, amount, Math.floor(minAbsolute / $735220c2d4774dd3$var$ONE_HOUR), Math.floor(maxAbsolute / $735220c2d4774dd3$var$ONE_HOUR), options === null || options === void 0 ? void 0 : options.round) * $735220c2d4774dd3$var$ONE_HOUR + remainder;
      return $11d87f3f76e88657$export$b4a036af3fc0b032($11d87f3f76e88657$export$1b96692a1ba042ac(ms, dateTime.timeZone), dateTime.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return $735220c2d4774dd3$export$dd02b3e0007dfe28(dateTime, field, amount, options);
    case "era":
    case "year":
    case "month":
    case "day": {
      let res = $735220c2d4774dd3$export$d52ced6badfb9a4c($11d87f3f76e88657$export$b21e0b124e224484(dateTime), field, amount, options);
      let ms = $11d87f3f76e88657$export$5107c82f94518f5c(res, dateTime.timeZone);
      return $11d87f3f76e88657$export$b4a036af3fc0b032($11d87f3f76e88657$export$1b96692a1ba042ac(ms, dateTime.timeZone), dateTime.calendar);
    }
    default:
      throw new Error("Unsupported field " + field);
  }
}
function $735220c2d4774dd3$export$31b5430eb18be4f8(dateTime, fields, disambiguation) {
  let plainDateTime = $11d87f3f76e88657$export$b21e0b124e224484(dateTime);
  let res = $735220c2d4774dd3$export$e5d5e1c1822b6e56($735220c2d4774dd3$export$adaa4cf7ef1b65be(plainDateTime, fields), fields);
  if (res.compare(plainDateTime) === 0) return dateTime;
  let ms = $11d87f3f76e88657$export$5107c82f94518f5c(res, dateTime.timeZone, disambiguation);
  return $11d87f3f76e88657$export$b4a036af3fc0b032($11d87f3f76e88657$export$1b96692a1ba042ac(ms, dateTime.timeZone), dateTime.calendar);
}
function $fae977aafc393c5c$export$f59dee82248f5ad4(time) {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}${time.millisecond ? String(time.millisecond / 1e3).slice(1) : ""}`;
}
function $fae977aafc393c5c$export$60dfd74aa96791bd(date) {
  let gregorianDate = $11d87f3f76e88657$export$b4a036af3fc0b032(date, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
  let year;
  if (gregorianDate.era === "BC") year = gregorianDate.year === 1 ? "0000" : "-" + String(Math.abs(1 - gregorianDate.year)).padStart(6, "00");
  else year = String(gregorianDate.year).padStart(4, "0");
  return `${year}-${String(gregorianDate.month).padStart(2, "0")}-${String(gregorianDate.day).padStart(2, "0")}`;
}
function $fae977aafc393c5c$export$4223de14708adc63(date) {
  return `${$fae977aafc393c5c$export$60dfd74aa96791bd(date)}T${$fae977aafc393c5c$export$f59dee82248f5ad4(date)}`;
}
function $fae977aafc393c5c$var$offsetToString(offset) {
  let sign = Math.sign(offset) < 0 ? "-" : "+";
  offset = Math.abs(offset);
  let offsetHours = Math.floor(offset / 36e5);
  let offsetMinutes = offset % 36e5 / 6e4;
  return `${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
}
function $fae977aafc393c5c$export$bf79f1ebf4b18792(date) {
  return `${$fae977aafc393c5c$export$4223de14708adc63(date)}${$fae977aafc393c5c$var$offsetToString(date.offset)}[${date.timeZone}]`;
}
function _check_private_redeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _class_private_field_init(obj, privateMap, value) {
  _check_private_redeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function $35ea8db9cb2ccb90$var$shiftArgs(args) {
  let calendar = typeof args[0] === "object" ? args.shift() : new $3b62074eb05584b2$export$80ee6245ec4f29ec();
  let era;
  if (typeof args[0] === "string") era = args.shift();
  else {
    let eras = calendar.getEras();
    era = eras[eras.length - 1];
  }
  let year = args.shift();
  let month = args.shift();
  let day = args.shift();
  return [
    calendar,
    era,
    year,
    month,
    day
  ];
}
var $35ea8db9cb2ccb90$var$_type = /* @__PURE__ */ new WeakMap();
class $35ea8db9cb2ccb90$export$99faa760c7908e4f {
  /** Returns a copy of this date. */
  copy() {
    if (this.era) return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(this.calendar, this.era, this.year, this.month, this.day);
    else return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(duration) {
    return $735220c2d4774dd3$export$e16d8520af44a096(this, duration);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(duration) {
    return $735220c2d4774dd3$export$4e2d2ead65e5f7e3(this, duration);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(fields) {
    return $735220c2d4774dd3$export$adaa4cf7ef1b65be(this, fields);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(field, amount, options) {
    return $735220c2d4774dd3$export$d52ced6badfb9a4c(this, field, amount, options);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(timeZone) {
    return $11d87f3f76e88657$export$e67a095c620b86fe(this, timeZone);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return $fae977aafc393c5c$export$60dfd74aa96791bd(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(b) {
    return $14e0f24ef4ac5c92$export$68781ddf31c0090f(this, b);
  }
  constructor(...args) {
    _class_private_field_init(this, $35ea8db9cb2ccb90$var$_type, {
      writable: true,
      value: void 0
    });
    let [calendar, era, year, month, day] = $35ea8db9cb2ccb90$var$shiftArgs(args);
    this.calendar = calendar;
    this.era = era;
    this.year = year;
    this.month = month;
    this.day = day;
    $735220c2d4774dd3$export$c4e2ecac49351ef2(this);
  }
}
var $35ea8db9cb2ccb90$var$_type2 = /* @__PURE__ */ new WeakMap();
class $35ea8db9cb2ccb90$export$ca871e8dbb80966f {
  /** Returns a copy of this date. */
  copy() {
    if (this.era) return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
    else return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(duration) {
    return $735220c2d4774dd3$export$e16d8520af44a096(this, duration);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(duration) {
    return $735220c2d4774dd3$export$4e2d2ead65e5f7e3(this, duration);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(fields) {
    return $735220c2d4774dd3$export$adaa4cf7ef1b65be($735220c2d4774dd3$export$e5d5e1c1822b6e56(this, fields), fields);
  }
  /**
  * Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(field, amount, options) {
    switch (field) {
      case "era":
      case "year":
      case "month":
      case "day":
        return $735220c2d4774dd3$export$d52ced6badfb9a4c(this, field, amount, options);
      default:
        return $735220c2d4774dd3$export$dd02b3e0007dfe28(this, field, amount, options);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(timeZone, disambiguation) {
    return $11d87f3f76e88657$export$e67a095c620b86fe(this, timeZone, disambiguation);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return $fae977aafc393c5c$export$4223de14708adc63(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(b) {
    let res = $14e0f24ef4ac5c92$export$68781ddf31c0090f(this, b);
    if (res === 0) return $14e0f24ef4ac5c92$export$c19a80a9721b80f6(this, $11d87f3f76e88657$export$b21e0b124e224484(b));
    return res;
  }
  constructor(...args) {
    _class_private_field_init(this, $35ea8db9cb2ccb90$var$_type2, {
      writable: true,
      value: void 0
    });
    let [calendar, era, year, month, day] = $35ea8db9cb2ccb90$var$shiftArgs(args);
    this.calendar = calendar;
    this.era = era;
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = args.shift() || 0;
    this.minute = args.shift() || 0;
    this.second = args.shift() || 0;
    this.millisecond = args.shift() || 0;
    $735220c2d4774dd3$export$c4e2ecac49351ef2(this);
  }
}
var $35ea8db9cb2ccb90$var$_type3 = /* @__PURE__ */ new WeakMap();
class $35ea8db9cb2ccb90$export$d3b7288e7994edea {
  /** Returns a copy of this date. */
  copy() {
    if (this.era) return new $35ea8db9cb2ccb90$export$d3b7288e7994edea(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
    else return new $35ea8db9cb2ccb90$export$d3b7288e7994edea(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(duration) {
    return $735220c2d4774dd3$export$96b1d28349274637(this, duration);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(duration) {
    return $735220c2d4774dd3$export$6814caac34ca03c7(this, duration);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(fields, disambiguation) {
    return $735220c2d4774dd3$export$31b5430eb18be4f8(this, fields, disambiguation);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(field, amount, options) {
    return $735220c2d4774dd3$export$9a297d111fc86b79(this, field, amount, options);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return $11d87f3f76e88657$export$83aac07b4c37b25(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return $fae977aafc393c5c$export$bf79f1ebf4b18792(this);
  }
  /** Converts the date to an ISO 8601 formatted string in UTC. */
  toAbsoluteString() {
    return this.toDate().toISOString();
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(b) {
    return this.toDate().getTime() - $11d87f3f76e88657$export$84c95a83c799e074(b, this.timeZone).toDate().getTime();
  }
  constructor(...args) {
    _class_private_field_init(this, $35ea8db9cb2ccb90$var$_type3, {
      writable: true,
      value: void 0
    });
    let [calendar, era, year, month, day] = $35ea8db9cb2ccb90$var$shiftArgs(args);
    let timeZone = args.shift();
    let offset = args.shift();
    this.calendar = calendar;
    this.era = era;
    this.year = year;
    this.month = month;
    this.day = day;
    this.timeZone = timeZone;
    this.offset = offset;
    this.hour = args.shift() || 0;
    this.minute = args.shift() || 0;
    this.second = args.shift() || 0;
    this.millisecond = args.shift() || 0;
    $735220c2d4774dd3$export$c4e2ecac49351ef2(this);
  }
}
let $fb18d541ea1ad717$var$formatterCache = /* @__PURE__ */ new Map();
class $fb18d541ea1ad717$export$ad991b66133851cf {
  /** Formats a date as a string according to the locale and format options passed to the constructor. */
  format(value) {
    return this.formatter.format(value);
  }
  /** Formats a date to an array of parts such as separators, numbers, punctuation, and more. */
  formatToParts(value) {
    return this.formatter.formatToParts(value);
  }
  /** Formats a date range as a string. */
  formatRange(start, end) {
    if (typeof this.formatter.formatRange === "function")
      return this.formatter.formatRange(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    return `${this.formatter.format(start)} – ${this.formatter.format(end)}`;
  }
  /** Formats a date range as an array of parts. */
  formatRangeToParts(start, end) {
    if (typeof this.formatter.formatRangeToParts === "function")
      return this.formatter.formatRangeToParts(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    let startParts = this.formatter.formatToParts(start);
    let endParts = this.formatter.formatToParts(end);
    return [
      ...startParts.map((p2) => ({
        ...p2,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...endParts.map((p2) => ({
        ...p2,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let resolvedOptions = this.formatter.resolvedOptions();
    if ($fb18d541ea1ad717$var$hasBuggyResolvedHourCycle()) {
      if (!this.resolvedHourCycle) this.resolvedHourCycle = $fb18d541ea1ad717$var$getResolvedHourCycle(resolvedOptions.locale, this.options);
      resolvedOptions.hourCycle = this.resolvedHourCycle;
      resolvedOptions.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12";
    }
    if (resolvedOptions.calendar === "ethiopic-amete-alem") resolvedOptions.calendar = "ethioaa";
    return resolvedOptions;
  }
  constructor(locale, options = {}) {
    this.formatter = $fb18d541ea1ad717$var$getCachedDateFormatter(locale, options);
    this.options = options;
  }
}
const $fb18d541ea1ad717$var$hour12Preferences = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function $fb18d541ea1ad717$var$getCachedDateFormatter(locale, options = {}) {
  if (typeof options.hour12 === "boolean" && $fb18d541ea1ad717$var$hasBuggyHour12Behavior()) {
    options = {
      ...options
    };
    let pref = $fb18d541ea1ad717$var$hour12Preferences[String(options.hour12)][locale.split("-")[0]];
    let defaultHourCycle = options.hour12 ? "h12" : "h23";
    options.hourCycle = pref !== null && pref !== void 0 ? pref : defaultHourCycle;
    delete options.hour12;
  }
  let cacheKey = locale + (options ? Object.entries(options).sort((a2, b) => a2[0] < b[0] ? -1 : 1).join() : "");
  if ($fb18d541ea1ad717$var$formatterCache.has(cacheKey)) return $fb18d541ea1ad717$var$formatterCache.get(cacheKey);
  let numberFormatter = new Intl.DateTimeFormat(locale, options);
  $fb18d541ea1ad717$var$formatterCache.set(cacheKey, numberFormatter);
  return numberFormatter;
}
let $fb18d541ea1ad717$var$_hasBuggyHour12Behavior = null;
function $fb18d541ea1ad717$var$hasBuggyHour12Behavior() {
  if ($fb18d541ea1ad717$var$_hasBuggyHour12Behavior == null) $fb18d541ea1ad717$var$_hasBuggyHour12Behavior = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false
  }).format(new Date(2020, 2, 3, 0)) === "24";
  return $fb18d541ea1ad717$var$_hasBuggyHour12Behavior;
}
let $fb18d541ea1ad717$var$_hasBuggyResolvedHourCycle = null;
function $fb18d541ea1ad717$var$hasBuggyResolvedHourCycle() {
  if ($fb18d541ea1ad717$var$_hasBuggyResolvedHourCycle == null) $fb18d541ea1ad717$var$_hasBuggyResolvedHourCycle = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: false
  }).resolvedOptions().hourCycle === "h12";
  return $fb18d541ea1ad717$var$_hasBuggyResolvedHourCycle;
}
function $fb18d541ea1ad717$var$getResolvedHourCycle(locale, options) {
  if (!options.timeStyle && !options.hour) return void 0;
  locale = locale.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, "");
  locale += (locale.includes("-u-") ? "" : "-u") + "-nu-latn";
  let formatter = $fb18d541ea1ad717$var$getCachedDateFormatter(locale, {
    ...options,
    timeZone: void 0
    // use local timezone
  });
  let min = parseInt(formatter.formatToParts(new Date(2020, 2, 3, 0)).find((p2) => p2.type === "hour").value, 10);
  let max = parseInt(formatter.formatToParts(new Date(2020, 2, 3, 23)).find((p2) => p2.type === "hour").value, 10);
  if (min === 0 && max === 23) return "h23";
  if (min === 24 && max === 23) return "h24";
  if (min === 0 && max === 11) return "h11";
  if (min === 12 && max === 11) return "h12";
  throw new Error("Unexpected hour cycle result");
}
function initAnnouncer(doc) {
  if (!isBrowser || !doc)
    return null;
  let el = doc.querySelector("[data-bits-announcer]");
  const createLog = (kind) => {
    const log = doc.createElement("div");
    log.role = "log";
    log.ariaLive = kind;
    log.setAttribute("aria-relevant", "additions");
    return log;
  };
  if (!isHTMLElement(el)) {
    const div = doc.createElement("div");
    div.style.cssText = srOnlyStylesString;
    div.setAttribute("data-bits-announcer", "");
    div.appendChild(createLog("assertive"));
    div.appendChild(createLog("polite"));
    el = div;
    doc.body.insertBefore(el, doc.body.firstChild);
  }
  const getLog = (kind) => {
    if (!isHTMLElement(el))
      return null;
    const log = el.querySelector(`[aria-live="${kind}"]`);
    if (!isHTMLElement(log))
      return null;
    return log;
  };
  return {
    getLog
  };
}
function getAnnouncer(doc) {
  const announcer = initAnnouncer(doc);
  function announce(value, kind = "assertive", timeout = 7500) {
    if (!announcer || !isBrowser || !doc)
      return;
    const log = announcer.getLog(kind);
    const content = doc.createElement("div");
    if (typeof value === "number") {
      value = value.toString();
    } else if (value === null) {
      value = "Empty";
    } else {
      value = value.trim();
    }
    content.innerText = value;
    if (kind === "assertive") {
      log?.replaceChildren(content);
    } else {
      log?.appendChild(content);
    }
    return setTimeout(() => {
      content.remove();
    }, timeout);
  }
  return {
    announce
  };
}
const defaultDateDefaults = {
  defaultValue: void 0,
  granularity: "day"
};
function getDefaultDate(opts) {
  const withDefaults = { ...defaultDateDefaults, ...opts };
  const { defaultValue, granularity } = withDefaults;
  if (Array.isArray(defaultValue) && defaultValue.length) {
    return defaultValue[defaultValue.length - 1];
  }
  if (defaultValue && !Array.isArray(defaultValue)) {
    return defaultValue;
  } else {
    const date = /* @__PURE__ */ new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const calendarDateTimeGranularities = ["hour", "minute", "second"];
    if (calendarDateTimeGranularities.includes(granularity ?? "day")) {
      return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(year, month, day, 0, 0, 0);
    }
    return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(year, month, day);
  }
}
function toDate(dateValue, tz = $14e0f24ef4ac5c92$export$aa8b41735afcabd2()) {
  if (dateValue instanceof $35ea8db9cb2ccb90$export$d3b7288e7994edea) {
    return dateValue.toDate();
  } else {
    return dateValue.toDate(tz);
  }
}
function isCalendarDateTime(dateValue) {
  return dateValue instanceof $35ea8db9cb2ccb90$export$ca871e8dbb80966f;
}
function isZonedDateTime(dateValue) {
  return dateValue instanceof $35ea8db9cb2ccb90$export$d3b7288e7994edea;
}
function hasTime(dateValue) {
  return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}
function getDaysInMonth(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  } else {
    return date.set({ day: 100 }).day;
  }
}
function isBefore(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) < 0;
}
const DATE_SEGMENT_PARTS = ["day", "month", "year"];
const EDITABLE_TIME_SEGMENT_PARTS = ["hour", "minute", "second", "dayPeriod"];
const NON_EDITABLE_SEGMENT_PARTS = ["literal", "timeZoneName"];
const EDITABLE_SEGMENT_PARTS = [
  ...DATE_SEGMENT_PARTS,
  ...EDITABLE_TIME_SEGMENT_PARTS
];
const ALL_SEGMENT_PARTS = [
  ...EDITABLE_SEGMENT_PARTS,
  ...NON_EDITABLE_SEGMENT_PARTS
];
const supportedLocales = [
  "ach",
  "af",
  "am",
  "an",
  "ar",
  "ast",
  "az",
  "be",
  "bg",
  "bn",
  "br",
  "bs",
  "ca",
  "cak",
  "ckb",
  "cs",
  "cy",
  "da",
  "de",
  "dsb",
  "el",
  "en",
  "eo",
  "es",
  "et",
  "eu",
  "fa",
  "ff",
  "fi",
  "fr",
  "fy",
  "ga",
  "gd",
  "gl",
  "he",
  "hr",
  "hsb",
  "hu",
  "ia",
  "id",
  "it",
  "ja",
  "ka",
  "kk",
  "kn",
  "ko",
  "lb",
  "lo",
  "lt",
  "lv",
  "meh",
  "ml",
  "ms",
  "nl",
  "nn",
  "no",
  "oc",
  "pl",
  "pt",
  "rm",
  "ro",
  "ru",
  "sc",
  "scn",
  "sk",
  "sl",
  "sr",
  "sv",
  "szl",
  "tg",
  "th",
  "tr",
  "uk",
  "zh-CN",
  "zh-TW"
];
const placeholderFields = ["year", "month", "day"];
const placeholders = {
  ach: { year: "mwaka", month: "dwe", day: "nino" },
  af: { year: "jjjj", month: "mm", day: "dd" },
  am: { year: "ዓዓዓዓ", month: "ሚሜ", day: "ቀቀ" },
  an: { year: "aaaa", month: "mm", day: "dd" },
  ar: { year: "سنة", month: "شهر", day: "يوم" },
  ast: { year: "aaaa", month: "mm", day: "dd" },
  az: { year: "iiii", month: "aa", day: "gg" },
  be: { year: "гггг", month: "мм", day: "дд" },
  bg: { year: "гггг", month: "мм", day: "дд" },
  bn: { year: "yyyy", month: "মিমি", day: "dd" },
  br: { year: "bbbb", month: "mm", day: "dd" },
  bs: { year: "gggg", month: "mm", day: "dd" },
  ca: { year: "aaaa", month: "mm", day: "dd" },
  cak: { year: "jjjj", month: "ii", day: "q'q'" },
  ckb: { year: "ساڵ", month: "مانگ", day: "ڕۆژ" },
  cs: { year: "rrrr", month: "mm", day: "dd" },
  cy: { year: "bbbb", month: "mm", day: "dd" },
  da: { year: "åååå", month: "mm", day: "dd" },
  de: { year: "jjjj", month: "mm", day: "tt" },
  dsb: { year: "llll", month: "mm", day: "źź" },
  el: { year: "εεεε", month: "μμ", day: "ηη" },
  en: { year: "yyyy", month: "mm", day: "dd" },
  eo: { year: "jjjj", month: "mm", day: "tt" },
  es: { year: "aaaa", month: "mm", day: "dd" },
  et: { year: "aaaa", month: "kk", day: "pp" },
  eu: { year: "uuuu", month: "hh", day: "ee" },
  fa: { year: "سال", month: "ماه", day: "روز" },
  ff: { year: "hhhh", month: "ll", day: "ññ" },
  fi: { year: "vvvv", month: "kk", day: "pp" },
  fr: { year: "aaaa", month: "mm", day: "jj" },
  fy: { year: "jjjj", month: "mm", day: "dd" },
  ga: { year: "bbbb", month: "mm", day: "ll" },
  gd: { year: "bbbb", month: "mm", day: "ll" },
  gl: { year: "aaaa", month: "mm", day: "dd" },
  he: { year: "שנה", month: "חודש", day: "יום" },
  hr: { year: "gggg", month: "mm", day: "dd" },
  hsb: { year: "llll", month: "mm", day: "dd" },
  hu: { year: "éééé", month: "hh", day: "nn" },
  ia: { year: "aaaa", month: "mm", day: "dd" },
  id: { year: "tttt", month: "bb", day: "hh" },
  it: { year: "aaaa", month: "mm", day: "gg" },
  ja: { year: " 年 ", month: "月", day: "日" },
  ka: { year: "წწწწ", month: "თთ", day: "რრ" },
  kk: { year: "жжжж", month: "аа", day: "кк" },
  kn: { year: "ವವವವ", month: "ಮಿಮೀ", day: "ದಿದಿ" },
  ko: { year: "연도", month: "월", day: "일" },
  lb: { year: "jjjj", month: "mm", day: "dd" },
  lo: { year: "ປປປປ", month: "ດດ", day: "ວວ" },
  lt: { year: "mmmm", month: "mm", day: "dd" },
  lv: { year: "gggg", month: "mm", day: "dd" },
  meh: { year: "aaaa", month: "mm", day: "dd" },
  ml: { year: "വർഷം", month: "മാസം", day: "തീയതി" },
  ms: { year: "tttt", month: "mm", day: "hh" },
  nl: { year: "jjjj", month: "mm", day: "dd" },
  nn: { year: "åååå", month: "mm", day: "dd" },
  no: { year: "åååå", month: "mm", day: "dd" },
  oc: { year: "aaaa", month: "mm", day: "jj" },
  pl: { year: "rrrr", month: "mm", day: "dd" },
  pt: { year: "aaaa", month: "mm", day: "dd" },
  rm: { year: "oooo", month: "mm", day: "dd" },
  ro: { year: "aaaa", month: "ll", day: "zz" },
  ru: { year: "гггг", month: "мм", day: "дд" },
  sc: { year: "aaaa", month: "mm", day: "dd" },
  scn: { year: "aaaa", month: "mm", day: "jj" },
  sk: { year: "rrrr", month: "mm", day: "dd" },
  sl: { year: "llll", month: "mm", day: "dd" },
  sr: { year: "гггг", month: "мм", day: "дд" },
  sv: { year: "åååå", month: "mm", day: "dd" },
  szl: { year: "rrrr", month: "mm", day: "dd" },
  tg: { year: "сссс", month: "мм", day: "рр" },
  th: { year: "ปปปป", month: "ดด", day: "วว" },
  tr: { year: "yyyy", month: "aa", day: "gg" },
  uk: { year: "рррр", month: "мм", day: "дд" },
  "zh-CN": { year: "年", month: "月", day: "日" },
  "zh-TW": { year: "年", month: "月", day: "日" }
};
function getPlaceholderObj(locale) {
  if (!isSupportedLocale(locale)) {
    const localeLanguage = getLocaleLanguage(locale);
    if (!isSupportedLocale(localeLanguage)) {
      return placeholders.en;
    } else {
      return placeholders[localeLanguage];
    }
  } else {
    return placeholders[locale];
  }
}
function getPlaceholder(field, value, locale) {
  if (isPlaceholderField(field))
    return getPlaceholderObj(locale)[field];
  if (isDefaultField(field))
    return value;
  if (isTimeField(field))
    return "––";
  return "";
}
function isSupportedLocale(locale) {
  return supportedLocales.includes(locale);
}
function isPlaceholderField(field) {
  return placeholderFields.includes(field);
}
function isTimeField(field) {
  return field === "hour" || field === "minute" || field === "second";
}
function isDefaultField(field) {
  return field === "era" || field === "dayPeriod";
}
function getLocaleLanguage(locale) {
  if (Intl.Locale) {
    return new Intl.Locale(locale).language;
  }
  return locale.split("-")[0];
}
function initializeSegmentValues(granularity) {
  const calendarDateTimeGranularities = ["hour", "minute", "second"];
  const initialParts = EDITABLE_SEGMENT_PARTS.map((part) => {
    if (part === "dayPeriod") {
      return [part, "AM"];
    }
    return [part, null];
  }).filter(([key]) => {
    if (key === "literal" || key === null)
      return false;
    if (granularity === "day") {
      return !calendarDateTimeGranularities.includes(key);
    } else {
      return true;
    }
  });
  return Object.fromEntries(initialParts);
}
function createContentObj(props) {
  const { segmentValues, formatter, locale, dateRef } = props;
  const content = Object.keys(segmentValues).reduce((obj, part) => {
    if (!isSegmentPart(part))
      return obj;
    if ("hour" in segmentValues && part === "dayPeriod") {
      const value = segmentValues[part];
      if (!isNull(value)) {
        obj[part] = value;
      } else {
        obj[part] = getPlaceholder(part, "AM", locale);
      }
    } else {
      obj[part] = getPartContent(part);
    }
    return obj;
  }, {});
  function getPartContent(part) {
    if ("hour" in segmentValues) {
      const value = segmentValues[part];
      const leadingZero = typeof value === "string" && value?.startsWith("0");
      const intValue = value !== null ? Number.parseInt(value) : null;
      if (value === "0" && part !== "year") {
        return "0";
      } else if (!isNull(value) && !isNull(intValue)) {
        const formatted = formatter.part(dateRef.set({ [part]: value }), part, {
          hourCycle: props.hourCycle === 24 ? "h23" : void 0
        });
        if (part === "hour" && "dayPeriod" in segmentValues && props.hourCycle !== 24) {
          if (intValue > 12) {
            const hour = intValue - 12;
            if (hour === 0) {
              return "12";
            } else if (hour < 10) {
              return `0${hour}`;
            } else {
              return `${hour}`;
            }
          }
          if (intValue === 0) {
            return "12";
          }
          if (intValue < 10) {
            return `0${intValue}`;
          }
          return `${intValue}`;
        }
        if (part === "year") {
          return `${value}`;
        }
        if (leadingZero && formatted.length === 1) {
          return `0${formatted}`;
        }
        return formatted;
      } else {
        return getPlaceholder(part, "", locale);
      }
    } else {
      if (isDateSegmentPart(part)) {
        const value = segmentValues[part];
        const leadingZero = typeof value === "string" && value?.startsWith("0");
        if (value === "0") {
          return "0";
        } else if (!isNull(value)) {
          const formatted = formatter.part(dateRef.set({ [part]: value }), part);
          if (part === "year") {
            return `${value}`;
          }
          if (leadingZero && formatted.length === 1) {
            return `0${formatted}`;
          }
          return formatted;
        } else {
          return getPlaceholder(part, "", locale);
        }
      }
      return "";
    }
  }
  return content;
}
function createContentArr(props) {
  const { granularity, dateRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
  const parts = formatter.toParts(dateRef, getOptsByGranularity(granularity, hourCycle));
  const segmentContentArr = parts.map((part) => {
    const defaultParts = ["literal", "dayPeriod", "timeZoneName", null];
    if (defaultParts.includes(part.type) || !isSegmentPart(part.type)) {
      return {
        part: part.type,
        value: part.value
      };
    }
    return {
      part: part.type,
      value: contentObj[part.type]
    };
  }).filter((segment) => {
    if (isNull(segment.part) || isNull(segment.value))
      return false;
    if (segment.part === "timeZoneName" && (!isZonedDateTime(dateRef) || hideTimeZone)) {
      return false;
    }
    return true;
  });
  return segmentContentArr;
}
function createContent(props) {
  const contentObj = createContentObj(props);
  const contentArr = createContentArr({
    contentObj,
    ...props
  });
  return {
    obj: contentObj,
    arr: contentArr
  };
}
function getOptsByGranularity(granularity, hourCycle) {
  const opts = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hourCycle: hourCycle === 24 ? "h23" : void 0,
    hour12: hourCycle === 24 ? false : void 0
  };
  if (granularity === "day") {
    delete opts.second;
    delete opts.hour;
    delete opts.minute;
    delete opts.timeZoneName;
  }
  if (granularity === "hour") {
    delete opts.minute;
  }
  if (granularity === "minute") {
    delete opts.second;
  }
  return opts;
}
function initSegmentStates() {
  return EDITABLE_SEGMENT_PARTS.reduce((acc, key) => {
    acc[key] = {
      lastKeyZero: false,
      hasLeftFocus: true,
      updating: null
    };
    return acc;
  }, {});
}
function isDateSegmentPart(part) {
  return DATE_SEGMENT_PARTS.includes(part);
}
function isSegmentPart(part) {
  return EDITABLE_SEGMENT_PARTS.includes(part);
}
function isAnySegmentPart(part) {
  return ALL_SEGMENT_PARTS.includes(part);
}
function getUsedSegments(fieldNode) {
  if (!isBrowser || !fieldNode)
    return [];
  const usedSegments = getSegments(fieldNode).map((el) => el.dataset.segment).filter((part) => {
    return EDITABLE_SEGMENT_PARTS.includes(part);
  });
  return usedSegments;
}
function getValueFromSegments(props) {
  const { segmentObj, fieldNode, dateRef } = props;
  const usedSegments = getUsedSegments(fieldNode);
  let date = dateRef;
  for (const part of usedSegments) {
    if ("hour" in segmentObj) {
      const value = segmentObj[part];
      if (isNull(value))
        continue;
      date = date.set({ [part]: segmentObj[part] });
    } else if (isDateSegmentPart(part)) {
      const value = segmentObj[part];
      if (isNull(value))
        continue;
      date = date.set({ [part]: segmentObj[part] });
    }
  }
  return date;
}
function areAllSegmentsFilled(segmentValues, fieldNode) {
  const usedSegments = getUsedSegments(fieldNode);
  for (const part of usedSegments) {
    if ("hour" in segmentValues) {
      if (segmentValues[part] === null) {
        return false;
      }
    } else if (isDateSegmentPart(part)) {
      if (segmentValues[part] === null) {
        return false;
      }
    }
  }
  return true;
}
function isDateAndTimeSegmentObj(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  return Object.entries(obj).every(([key, value]) => {
    const validKey = EDITABLE_TIME_SEGMENT_PARTS.includes(key) || DATE_SEGMENT_PARTS.includes(key);
    const validValue = key === "dayPeriod" ? value === "AM" || value === "PM" || value === null : typeof value === "string" || typeof value === "number" || value === null;
    return validKey && validValue;
  });
}
function inferGranularity(value, granularity) {
  if (granularity)
    return granularity;
  if (hasTime(value))
    return "minute";
  return "day";
}
function isAcceptableSegmentKey(key) {
  const acceptableSegmentKeys = [
    ENTER,
    ARROW_UP,
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    BACKSPACE,
    SPACE
  ];
  if (acceptableSegmentKeys.includes(key))
    return true;
  if (isNumberString(key))
    return true;
  return false;
}
function isFirstSegment(id, fieldNode) {
  if (!isBrowser)
    return false;
  const segments = getSegments(fieldNode);
  return segments.length ? segments[0].id === id : false;
}
function setDescription(props) {
  const { id, formatter, value, doc } = props;
  if (!isBrowser)
    return;
  const valueString = formatter.selectedDate(value);
  const el = doc.getElementById(id);
  if (!el) {
    const div = doc.createElement("div");
    div.style.cssText = styleToString({
      display: "none"
    });
    div.id = id;
    div.innerText = `Selected Date: ${valueString}`;
    doc.body.appendChild(div);
  } else {
    el.innerText = `Selected Date: ${valueString}`;
  }
}
function removeDescriptionElement(id, doc) {
  if (!isBrowser)
    return;
  const el = doc.getElementById(id);
  if (!el)
    return;
  doc.body.removeChild(el);
}
function handleSegmentNavigation(e, fieldNode) {
  const currentTarget = e.currentTarget;
  if (!isHTMLElement(currentTarget))
    return;
  const { prev, next } = getPrevNextSegments(currentTarget, fieldNode);
  if (e.key === ARROW_LEFT) {
    if (!prev)
      return;
    prev.focus();
  } else if (e.key === ARROW_RIGHT) {
    if (!next)
      return;
    next.focus();
  }
}
function getNextSegment(node, segments) {
  const index = segments.indexOf(node);
  if (index === segments.length - 1 || index === -1)
    return null;
  const nextIndex = index + 1;
  const nextSegment = segments[nextIndex];
  return nextSegment;
}
function getPrevSegment(node, segments) {
  const index = segments.indexOf(node);
  if (index === 0 || index === -1)
    return null;
  const prevIndex = index - 1;
  const prevSegment = segments[prevIndex];
  return prevSegment;
}
function getPrevNextSegments(startingNode, fieldNode) {
  const segments = getSegments(fieldNode);
  if (!segments.length) {
    return {
      next: null,
      prev: null
    };
  }
  return {
    next: getNextSegment(startingNode, segments),
    prev: getPrevSegment(startingNode, segments)
  };
}
function moveToNextSegment(e, fieldNode) {
  const node = e.currentTarget;
  if (!isHTMLElement(node))
    return;
  const { next } = getPrevNextSegments(node, fieldNode);
  if (!next)
    return;
  next.focus();
}
function moveToPrevSegment(e, fieldNode) {
  const node = e.currentTarget;
  if (!isHTMLElement(node))
    return;
  const { prev } = getPrevNextSegments(node, fieldNode);
  if (!prev)
    return;
  prev.focus();
}
function isSegmentNavigationKey(key) {
  if (key === ARROW_RIGHT || key === ARROW_LEFT)
    return true;
  return false;
}
function getSegments(fieldNode) {
  if (!fieldNode)
    return [];
  const segments = Array.from(fieldNode.querySelectorAll("[data-segment]")).filter((el) => {
    if (!isHTMLElement(el))
      return false;
    const segment = el.dataset.segment;
    if (segment === "trigger")
      return true;
    if (!isAnySegmentPart(segment) || segment === "literal")
      return false;
    return true;
  });
  return segments;
}
function getFirstSegment(fieldNode) {
  return getSegments(fieldNode)[0];
}
const defaultPartOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function createFormatter(opts) {
  let locale = opts.initialLocale;
  function setLocale(newLocale) {
    locale = newLocale;
  }
  function getLocale() {
    return locale;
  }
  function custom(date, options) {
    return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, options).format(date);
  }
  function selectedDate(date, includeTime = true) {
    if (hasTime(date) && includeTime) {
      return custom(toDate(date), {
        dateStyle: "long",
        timeStyle: "long"
      });
    } else {
      return custom(toDate(date), {
        dateStyle: "long"
      });
    }
  }
  function fullMonthAndYear(date) {
    if (typeof opts.monthFormat.current !== "function" && typeof opts.yearFormat.current !== "function") {
      return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, {
        month: opts.monthFormat.current,
        year: opts.yearFormat.current
      }).format(date);
    }
    const formattedMonth = typeof opts.monthFormat.current === "function" ? opts.monthFormat.current(date.getMonth() + 1) : new $fb18d541ea1ad717$export$ad991b66133851cf(locale, { month: opts.monthFormat.current }).format(date);
    const formattedYear = typeof opts.yearFormat.current === "function" ? opts.yearFormat.current(date.getFullYear()) : new $fb18d541ea1ad717$export$ad991b66133851cf(locale, { year: opts.yearFormat.current }).format(date);
    return `${formattedMonth} ${formattedYear}`;
  }
  function fullMonth(date) {
    return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, { month: "long" }).format(date);
  }
  function fullYear(date) {
    return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, { year: "numeric" }).format(date);
  }
  function toParts(date, options) {
    if (isZonedDateTime(date)) {
      return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, {
        ...options,
        timeZone: date.timeZone
      }).formatToParts(toDate(date));
    } else {
      return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, options).formatToParts(toDate(date));
    }
  }
  function dayOfWeek(date, length = "narrow") {
    return new $fb18d541ea1ad717$export$ad991b66133851cf(locale, { weekday: length }).format(date);
  }
  function dayPeriod(date, hourCycle = void 0) {
    const parts = new $fb18d541ea1ad717$export$ad991b66133851cf(locale, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: hourCycle === 24 ? "h23" : void 0
    }).formatToParts(date);
    const value = parts.find((p2) => p2.type === "dayPeriod")?.value;
    if (value === "PM") {
      return "PM";
    }
    return "AM";
  }
  function part(dateObj, type, options = {}) {
    const opts2 = { ...defaultPartOptions, ...options };
    const parts = toParts(dateObj, opts2);
    const part2 = parts.find((p2) => p2.type === type);
    return part2 ? part2.value : "";
  }
  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek
  };
}
enable_legacy_mode_flag();
var root_1 = /* @__PURE__ */ from_html(`<input/>`);
var root_2$4 = /* @__PURE__ */ from_html(`<input/>`);
function Hidden_input($$anchor, $$props) {
  push($$props, true);
  let value = prop($$props, "value", 15), restProps = /* @__PURE__ */ rest_props($$props, ["$$slots", "$$events", "$$legacy", "value"]);
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, {
    "aria-hidden": "true",
    tabindex: -1,
    style: srOnlyStylesString
  }));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var input = root_1();
      attribute_effect(input, () => ({ ...get(mergedProps), value: value() }));
      append($$anchor2, input);
    };
    var alternate = ($$anchor2) => {
      var input_1 = root_2$4();
      attribute_effect(input_1, () => ({ ...get(mergedProps) }));
      bind_value(input_1, value);
      append($$anchor2, input_1);
    };
    if_block(node, ($$render) => {
      if (get(mergedProps).type === "checkbox") $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
const dateFieldAttrs = createBitsAttrs({
  component: "date-field",
  parts: ["input", "label", "segment"]
});
const SEGMENT_CONFIGS = {
  day: {
    min: 1,
    max: (root2) => {
      const segmentMonthValue = root2.segmentValues.month;
      const placeholder = root2.value.current ?? root2.placeholder.current;
      return segmentMonthValue ? getDaysInMonth(placeholder.set({ month: Number.parseInt(segmentMonthValue) })) : getDaysInMonth(placeholder);
    },
    cycle: 1,
    padZero: true
  },
  month: {
    min: 1,
    max: 12,
    cycle: 1,
    padZero: true,
    getAnnouncement: (month, root2) => {
      if (!root2.placeholder.current) return "";
      return `${month} - ${root2.formatter.fullMonth(toDate(root2.placeholder.current.set({ month })))}`;
    }
  },
  year: { min: 1, max: 9999, cycle: 1, padZero: false },
  hour: {
    min: (root2) => root2.hourCycle.current === 12 ? 1 : 0,
    max: (root2) => {
      if (root2.hourCycle.current === 24) return 23;
      if ("dayPeriod" in root2.segmentValues && root2.segmentValues.dayPeriod !== null) return 12;
      return 23;
    },
    cycle: 1,
    canBeZero: true,
    padZero: true
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: true, padZero: true },
  second: { min: 0, max: 59, cycle: 1, canBeZero: true, padZero: true }
};
const DateFieldRootContext = new Context("DateField.Root");
class DateFieldRootState {
  static create(opts, rangeRoot) {
    return DateFieldRootContext.set(new DateFieldRootState(opts, rangeRoot));
  }
  value;
  placeholder;
  validate;
  minValue;
  maxValue;
  disabled;
  readonly;
  granularity;
  readonlySegments;
  hourCycle;
  locale;
  hideTimeZone;
  required;
  onInvalid;
  errorMessageId;
  isInvalidProp;
  descriptionId = useId();
  formatter;
  initialSegments;
  #segmentValues = /* @__PURE__ */ state();
  get segmentValues() {
    return get(this.#segmentValues);
  }
  set segmentValues(value) {
    set(this.#segmentValues, value, true);
  }
  announcer;
  #readonlySegmentsSet = /* @__PURE__ */ user_derived(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return get(this.#readonlySegmentsSet);
  }
  set readonlySegmentsSet(value) {
    set(this.#readonlySegmentsSet, value);
  }
  segmentStates = initSegmentStates();
  #fieldNode = /* @__PURE__ */ state(null);
  #labelNode = /* @__PURE__ */ state(null);
  #descriptionNode = /* @__PURE__ */ state(null);
  get descriptionNode() {
    return get(this.#descriptionNode);
  }
  set descriptionNode(value) {
    set(this.#descriptionNode, value, true);
  }
  #validationNode = /* @__PURE__ */ state(null);
  get validationNode() {
    return get(this.#validationNode);
  }
  set validationNode(value) {
    set(this.#validationNode, value, true);
  }
  states = initSegmentStates();
  #dayPeriodNode = /* @__PURE__ */ state(null);
  get dayPeriodNode() {
    return get(this.#dayPeriodNode);
  }
  set dayPeriodNode(value) {
    set(this.#dayPeriodNode, value, true);
  }
  rangeRoot = void 0;
  #name = /* @__PURE__ */ state("");
  get name() {
    return get(this.#name);
  }
  set name(value) {
    set(this.#name, value, true);
  }
  domContext = new DOMContext(() => null);
  constructor(props, rangeRoot) {
    this.rangeRoot = rangeRoot;
    this.value = props.value;
    this.placeholder = rangeRoot ? rangeRoot.opts.placeholder : props.placeholder;
    this.validate = rangeRoot ? box(void 0) : props.validate;
    this.minValue = rangeRoot ? rangeRoot.opts.minValue : props.minValue;
    this.maxValue = rangeRoot ? rangeRoot.opts.maxValue : props.maxValue;
    this.disabled = rangeRoot ? rangeRoot.opts.disabled : props.disabled;
    this.readonly = rangeRoot ? rangeRoot.opts.readonly : props.readonly;
    this.granularity = rangeRoot ? rangeRoot.opts.granularity : props.granularity;
    this.readonlySegments = rangeRoot ? rangeRoot.opts.readonlySegments : props.readonlySegments;
    this.hourCycle = rangeRoot ? rangeRoot.opts.hourCycle : props.hourCycle;
    this.locale = rangeRoot ? rangeRoot.opts.locale : props.locale;
    this.hideTimeZone = rangeRoot ? rangeRoot.opts.hideTimeZone : props.hideTimeZone;
    this.required = rangeRoot ? rangeRoot.opts.required : props.required;
    this.onInvalid = rangeRoot ? rangeRoot.opts.onInvalid : props.onInvalid;
    this.errorMessageId = rangeRoot ? rangeRoot.opts.errorMessageId : props.errorMessageId;
    this.isInvalidProp = props.isInvalidProp;
    this.formatter = createFormatter({
      initialLocale: this.locale.current,
      monthFormat: box.with(() => "long"),
      yearFormat: box.with(() => "numeric")
    });
    this.initialSegments = initializeSegmentValues(this.inferredGranularity);
    this.segmentValues = this.initialSegments;
    this.announcer = getAnnouncer(null);
    this.getFieldNode = this.getFieldNode.bind(this);
    this.updateSegment = this.updateSegment.bind(this);
    this.handleSegmentClick = this.handleSegmentClick.bind(this);
    this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this);
    user_effect(() => {
      untrack$1(() => {
        this.initialSegments = initializeSegmentValues(this.inferredGranularity);
      });
    });
    onMount(() => {
      this.announcer = getAnnouncer(this.domContext.getDocument());
    });
    onDestroyEffect(() => {
      if (rangeRoot) return;
      removeDescriptionElement(this.descriptionId, this.domContext.getDocument());
    });
    user_effect(() => {
      if (rangeRoot) return;
      if (this.formatter.getLocale() === this.locale.current) return;
      this.formatter.setLocale(this.locale.current);
    });
    user_effect(() => {
      if (rangeRoot) return;
      if (this.value.current) {
        const descriptionId = untrack$1(() => this.descriptionId);
        setDescription({
          id: descriptionId,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const placeholder = untrack$1(() => this.placeholder.current);
      if (this.value.current && placeholder !== this.value.current) {
        untrack$1(() => {
          if (this.value.current) {
            this.placeholder.current = this.value.current;
          }
        });
      }
    });
    if (this.value.current) {
      this.syncSegmentValues(this.value.current);
    }
    user_effect(() => {
      this.locale.current;
      if (this.value.current) {
        this.syncSegmentValues(this.value.current);
      }
      this.#clearUpdating();
    });
    user_effect(() => {
      if (this.value.current === void 0) {
        this.segmentValues = initializeSegmentValues(this.inferredGranularity);
      }
    });
    watch(() => this.validationStatus, () => {
      if (this.validationStatus !== false) {
        this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
      }
    });
  }
  setName(name) {
    this.name = name;
  }
  /**
   * Sets the field node for the `DateFieldRootState` instance. We use this method so we can
   * keep `#fieldNode` private to prevent accidental usage of the incorrect field node.
   */
  setFieldNode(node) {
    set(this.#fieldNode, node, true);
  }
  /**
   * Gets the correct field node for the date field regardless of whether it's being
   * used in a standalone context or within a `DateRangeField` component.
   */
  getFieldNode() {
    if (!this.rangeRoot) {
      return get(this.#fieldNode);
    } else {
      return this.rangeRoot.fieldNode;
    }
  }
  /**
   * Sets the label node for the `DateFieldRootState` instance. We use this method so we can
   * keep `#labelNode` private to prevent accidental usage of the incorrect label node.
   */
  setLabelNode(node) {
    set(this.#labelNode, node, true);
  }
  /**
   * Gets the correct label node for the date field regardless of whether it's being used in
   * a standalone context or within a `DateRangeField` component.
   */
  getLabelNode() {
    if (!this.rangeRoot) {
      return get(this.#labelNode);
    }
    return this.rangeRoot.labelNode;
  }
  #clearUpdating() {
    this.states.day.updating = null;
    this.states.month.updating = null;
    this.states.year.updating = null;
    this.states.hour.updating = null;
    this.states.minute.updating = null;
    this.states.dayPeriod.updating = null;
  }
  setValue(value) {
    this.value.current = value;
  }
  syncSegmentValues(value) {
    const dateValues = DATE_SEGMENT_PARTS.map((part) => {
      const partValue = value[part];
      if (part === "month") {
        if (this.states.month.updating) {
          return [part, this.states.month.updating];
        }
        if (partValue < 10) {
          return [part, `0${partValue}`];
        }
      }
      if (part === "day") {
        if (this.states.day.updating) {
          return [part, this.states.day.updating];
        }
        if (partValue < 10) {
          return [part, `0${partValue}`];
        }
      }
      if (part === "year") {
        if (this.states.year.updating) {
          return [part, this.states.year.updating];
        }
        const valueDigits = `${partValue}`.length;
        const diff = 4 - valueDigits;
        if (diff > 0) {
          return [part, `${"0".repeat(diff)}${partValue}`];
        }
      }
      return [part, `${partValue}`];
    });
    if ("hour" in value) {
      const timeValues = EDITABLE_TIME_SEGMENT_PARTS.map((part) => {
        if (part === "dayPeriod") {
          if (this.states.dayPeriod.updating) {
            return [part, this.states.dayPeriod.updating];
          } else {
            return [part, this.formatter.dayPeriod(toDate(value))];
          }
        } else if (part === "hour") {
          if (this.states.hour.updating) {
            return [part, this.states.hour.updating];
          }
          if (value[part] !== void 0 && value[part] < 10) {
            return [part, `0${value[part]}`];
          }
          if (value[part] === 0) {
            if (this.dayPeriodNode) {
              return [part, "12"];
            }
          }
        } else if (part === "minute") {
          if (this.states.minute.updating) {
            return [part, this.states.minute.updating];
          }
          if (value[part] !== void 0 && value[part] < 10) {
            return [part, `0${value[part]}`];
          }
        } else if (part === "second") {
          if (this.states.second.updating) {
            return [part, this.states.second.updating];
          }
          if (value[part] !== void 0 && value[part] < 10) {
            return [part, `0${value[part]}`];
          }
        }
        return [part, `${value[part]}`];
      });
      const mergedSegmentValues = [...dateValues, ...timeValues];
      this.segmentValues = Object.fromEntries(mergedSegmentValues);
      this.#clearUpdating();
      return;
    }
    this.segmentValues = Object.fromEntries(dateValues);
  }
  #validationStatus = /* @__PURE__ */ user_derived(() => {
    const value = this.value.current;
    if (!value) return false;
    const msg = this.validate.current?.(value);
    if (msg) {
      return { reason: "custom", message: msg };
    }
    const minValue = this.minValue.current;
    if (minValue && isBefore(value, minValue)) {
      return { reason: "min" };
    }
    const maxValue = this.maxValue.current;
    if (maxValue && isBefore(maxValue, value)) {
      return { reason: "max" };
    }
    return false;
  });
  get validationStatus() {
    return get(this.#validationStatus);
  }
  set validationStatus(value) {
    set(this.#validationStatus, value);
  }
  #isInvalid = /* @__PURE__ */ user_derived(() => {
    if (this.validationStatus === false) return false;
    if (this.isInvalidProp.current) return true;
    return true;
  });
  get isInvalid() {
    return get(this.#isInvalid);
  }
  set isInvalid(value) {
    set(this.#isInvalid, value);
  }
  #inferredGranularity = /* @__PURE__ */ user_derived(() => {
    const granularity = this.granularity.current;
    if (granularity) return granularity;
    const inferred = inferGranularity(this.placeholder.current, this.granularity.current);
    return inferred;
  });
  get inferredGranularity() {
    return get(this.#inferredGranularity);
  }
  set inferredGranularity(value) {
    set(this.#inferredGranularity, value);
  }
  #dateRef = /* @__PURE__ */ user_derived(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return get(this.#dateRef);
  }
  set dateRef(value) {
    set(this.#dateRef, value);
  }
  #allSegmentContent = /* @__PURE__ */ user_derived(() => {
    return createContent({
      segmentValues: this.segmentValues,
      formatter: this.formatter,
      locale: this.locale.current,
      granularity: this.inferredGranularity,
      dateRef: this.dateRef,
      hideTimeZone: this.hideTimeZone.current,
      hourCycle: this.hourCycle.current
    });
  });
  get allSegmentContent() {
    return get(this.#allSegmentContent);
  }
  set allSegmentContent(value) {
    set(this.#allSegmentContent, value);
  }
  #segmentContents = /* @__PURE__ */ user_derived(() => this.allSegmentContent.arr);
  get segmentContents() {
    return get(this.#segmentContents);
  }
  set segmentContents(value) {
    set(this.#segmentContents, value);
  }
  sharedSegmentAttrs = {
    role: "spinbutton",
    contenteditable: "true",
    tabindex: 0,
    spellcheck: false,
    inputmode: "numeric",
    autocorrect: "off",
    enterkeyhint: "next",
    style: { caretColor: "transparent" }
  };
  #getLabelledBy(segmentId) {
    return `${segmentId} ${this.getLabelNode()?.id ?? ""}`;
  }
  updateSegment(part, cb) {
    const disabled = this.disabled.current;
    const readonly = this.readonly.current;
    const readonlySegmentsSet = this.readonlySegmentsSet;
    if (disabled || readonly || readonlySegmentsSet.has(part)) return;
    const prev = this.segmentValues;
    let newSegmentValues = prev;
    const dateRef = this.placeholder.current;
    if (isDateAndTimeSegmentObj(prev)) {
      const pVal = prev[part];
      const castCb = cb;
      if (part === "month") {
        const next = castCb(pVal);
        this.states.month.updating = next;
        if (next !== null && prev.day !== null) {
          const date = dateRef.set({ month: Number.parseInt(next) });
          const daysInMonth = getDaysInMonth(toDate(date));
          const prevDay = Number.parseInt(prev.day);
          if (prevDay > daysInMonth) {
            prev.day = `${daysInMonth}`;
          }
        }
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "dayPeriod") {
        const next = castCb(pVal);
        this.states.dayPeriod.updating = next;
        const date = this.value.current;
        if (date && "hour" in date) {
          const trueHour = date.hour;
          if (next === "AM") {
            if (trueHour >= 12) {
              prev.hour = `${trueHour - 12}`;
            }
          } else if (next === "PM") {
            if (trueHour < 12) {
              prev.hour = `${trueHour + 12}`;
            }
          }
        }
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "hour") {
        const next = castCb(pVal);
        this.states.hour.updating = next;
        if (next !== null && prev.dayPeriod !== null) {
          const dayPeriod = this.formatter.dayPeriod(toDate(dateRef.set({ hour: Number.parseInt(next) })), this.hourCycle.current);
          if (dayPeriod === "AM" || dayPeriod === "PM") {
            prev.dayPeriod = dayPeriod;
          }
        }
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "minute") {
        const next = castCb(pVal);
        this.states.minute.updating = next;
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "second") {
        const next = castCb(pVal);
        this.states.second.updating = next;
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "year") {
        const next = castCb(pVal);
        this.states.year.updating = next;
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "day") {
        const next = castCb(pVal);
        this.states.day.updating = next;
        newSegmentValues = { ...prev, [part]: next };
      } else {
        const next = castCb(pVal);
        newSegmentValues = { ...prev, [part]: next };
      }
    } else if (isDateSegmentPart(part)) {
      const pVal = prev[part];
      const castCb = cb;
      const next = castCb(pVal);
      if (part === "month" && next !== null && prev.day !== null) {
        this.states.month.updating = next;
        const date = dateRef.set({ month: Number.parseInt(next) });
        const daysInMonth = getDaysInMonth(toDate(date));
        if (Number.parseInt(prev.day) > daysInMonth) {
          prev.day = `${daysInMonth}`;
        }
        newSegmentValues = { ...prev, [part]: next };
      } else if (part === "year") {
        const next2 = castCb(pVal);
        this.states.year.updating = next2;
        newSegmentValues = { ...prev, [part]: next2 };
      } else if (part === "day") {
        const next2 = castCb(pVal);
        this.states.day.updating = next2;
        newSegmentValues = { ...prev, [part]: next2 };
      } else {
        newSegmentValues = { ...prev, [part]: next };
      }
    }
    this.segmentValues = newSegmentValues;
    if (areAllSegmentsFilled(newSegmentValues, get(this.#fieldNode))) {
      this.setValue(getValueFromSegments({
        segmentObj: newSegmentValues,
        fieldNode: get(this.#fieldNode),
        dateRef: this.placeholder.current
      }));
    } else {
      this.setValue(void 0);
      this.segmentValues = newSegmentValues;
    }
  }
  handleSegmentClick(e) {
    if (this.disabled.current) {
      e.preventDefault();
    }
  }
  getBaseSegmentAttrs(part, segmentId) {
    const inReadonlySegments = this.readonlySegmentsSet.has(part);
    const defaultAttrs = {
      "aria-invalid": getAriaInvalid(this.isInvalid),
      "aria-disabled": getAriaDisabled(this.disabled.current),
      "aria-readonly": getAriaReadonly(this.readonly.current || inReadonlySegments),
      "data-invalid": getDataInvalid(this.isInvalid),
      "data-disabled": getDataDisabled(this.disabled.current),
      "data-readonly": getDataReadonly(this.readonly.current || inReadonlySegments),
      "data-segment": `${part}`,
      [dateFieldAttrs.segment]: ""
    };
    if (part === "literal") return defaultAttrs;
    const descriptionId = this.descriptionNode?.id;
    const hasDescription = isFirstSegment(segmentId, get(this.#fieldNode)) && descriptionId;
    const errorMsgId = this.errorMessageId?.current;
    const describedBy = hasDescription ? `${descriptionId} ${this.isInvalid && errorMsgId ? errorMsgId : ""}` : void 0;
    const contenteditable = !(this.readonly.current || inReadonlySegments || this.disabled.current);
    return {
      ...defaultAttrs,
      "aria-labelledby": this.#getLabelledBy(segmentId),
      contenteditable: contenteditable ? "true" : void 0,
      "aria-describedby": describedBy,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class DateFieldInputState {
  static create(opts) {
    return new DateFieldInputState(opts, DateFieldRootContext.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(opts, root2) {
    this.opts = opts;
    this.root = root2;
    this.domContext = new DOMContext(opts.ref);
    this.root.domContext = this.domContext;
    this.attachment = attachRef(opts.ref, (v) => this.root.setFieldNode(v));
    watch(() => this.opts.name.current, (v) => {
      this.root.setName(v);
    });
  }
  #ariaDescribedBy = /* @__PURE__ */ user_derived(() => {
    if (!isBrowser) return void 0;
    const doesDescriptionExist = this.domContext.getElementById(this.root.descriptionId);
    if (!doesDescriptionExist) return void 0;
    return this.root.descriptionId;
  });
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": get(this.#ariaDescribedBy),
    "aria-disabled": getAriaDisabled(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": getDataDisabled(this.root.disabled.current),
    [dateFieldAttrs.input]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateFieldHiddenInputState {
  static create() {
    return new DateFieldHiddenInputState(DateFieldRootContext.get());
  }
  root;
  #shouldRender = /* @__PURE__ */ user_derived(() => this.root.name !== "");
  get shouldRender() {
    return get(this.#shouldRender);
  }
  set shouldRender(value) {
    set(this.#shouldRender, value);
  }
  #isoValue = /* @__PURE__ */ user_derived(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return get(this.#isoValue);
  }
  set isoValue(value) {
    set(this.#isoValue, value);
  }
  constructor(root2) {
    this.root = root2;
  }
  #props = /* @__PURE__ */ user_derived(() => {
    return {
      name: this.root.name,
      value: this.isoValue,
      required: this.root.required.current
    };
  });
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class BaseNumericSegmentState {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(opts, root2, part, config) {
    this.opts = opts;
    this.root = root2;
    this.part = part;
    this.config = config;
    this.announcer = root2.announcer;
    this.onkeydown = this.onkeydown.bind(this);
    this.onfocusout = this.onfocusout.bind(this);
    this.attachment = attachRef(opts.ref);
  }
  #getMax() {
    return typeof this.config.max === "function" ? this.config.max(this.root) : this.config.max;
  }
  #getMin() {
    return typeof this.config.min === "function" ? this.config.min(this.root) : this.config.min;
  }
  #getAnnouncement(value) {
    if (this.config.getAnnouncement) {
      return this.config.getAnnouncement(value, this.root);
    }
    return value;
  }
  #formatValue(value, forDisplay = true) {
    const str = String(value);
    if (forDisplay && this.config.padZero && str.length === 1) {
      return `0${value}`;
    }
    return str;
  }
  onkeydown(e) {
    const placeholder = this.root.value.current ?? this.root.placeholder.current;
    if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;
    if ((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in placeholder)) return;
    if (e.key !== TAB) e.preventDefault();
    if (!isAcceptableSegmentKey(e.key)) return;
    if (isArrowUp(e.key)) {
      this.#handleArrowUp(placeholder);
      return;
    }
    if (isArrowDown(e.key)) {
      this.#handleArrowDown(placeholder);
      return;
    }
    if (isNumberString(e.key)) {
      this.#handleNumberKey(e);
      return;
    }
    if (isBackspace(e.key)) {
      this.#handleBackspace(e);
      return;
    }
    if (isSegmentNavigationKey(e.key)) {
      handleSegmentNavigation(e, this.root.getFieldNode());
    }
  }
  #handleArrowUp(placeholder) {
    const stateKey = this.part;
    if (stateKey in this.root.states) {
      this.root.states[stateKey].hasLeftFocus = false;
    }
    this.root.updateSegment(this.part, (prev) => {
      if (prev === null) {
        const next2 = placeholder[this.part];
        this.announcer.announce(this.#getAnnouncement(next2));
        return this.#formatValue(next2);
      }
      const current = placeholder.set({ [this.part]: Number.parseInt(prev) });
      const next = current.cycle(this.part, this.config.cycle)[this.part];
      this.announcer.announce(this.#getAnnouncement(next));
      return this.#formatValue(next);
    });
  }
  #handleArrowDown(placeholder) {
    const stateKey = this.part;
    if (stateKey in this.root.states) {
      this.root.states[stateKey].hasLeftFocus = false;
    }
    this.root.updateSegment(this.part, (prev) => {
      if (prev === null) {
        const next2 = placeholder[this.part];
        this.announcer.announce(this.#getAnnouncement(next2));
        return this.#formatValue(next2);
      }
      const current = placeholder.set({ [this.part]: Number.parseInt(prev) });
      const next = current.cycle(this.part, -this.config.cycle)[this.part];
      this.announcer.announce(this.#getAnnouncement(next));
      return this.#formatValue(next);
    });
  }
  #handleNumberKey(e) {
    const num = Number.parseInt(e.key);
    let moveToNext = false;
    const max = this.#getMax();
    const maxStart = Math.floor(max / 10);
    const numIsZero = num === 0;
    const stateKey = this.part;
    this.root.updateSegment(this.part, (prev) => {
      if (stateKey in this.root.states && this.root.states[stateKey].hasLeftFocus) {
        prev = null;
        this.root.states[stateKey].hasLeftFocus = false;
      }
      if (prev === null) {
        if (numIsZero) {
          if (stateKey in this.root.states) {
            this.root.states[stateKey].lastKeyZero = true;
          }
          this.announcer.announce("0");
          return "0";
        }
        if (stateKey in this.root.states && (this.root.states[stateKey].lastKeyZero || num > maxStart)) {
          moveToNext = true;
        }
        if (stateKey in this.root.states) {
          this.root.states[stateKey].lastKeyZero = false;
        }
        if (moveToNext && String(num).length === 1) {
          this.announcer.announce(num);
          return `0${num}`;
        }
        return `${num}`;
      }
      if (stateKey in this.root.states && this.root.states[stateKey].lastKeyZero) {
        if (num !== 0) {
          moveToNext = true;
          this.root.states[stateKey].lastKeyZero = false;
          return `0${num}`;
        }
        if (this.part === "hour" && num === 0 && this.root.hourCycle.current === 24) {
          moveToNext = true;
          this.root.states[stateKey].lastKeyZero = false;
          return `00`;
        }
        if ((this.part === "minute" || this.part === "second") && num === 0) {
          moveToNext = true;
          this.root.states[stateKey].lastKeyZero = false;
          return "00";
        }
        return prev;
      }
      const total = Number.parseInt(prev + num.toString());
      if (total > max) {
        moveToNext = true;
        return `0${num}`;
      }
      moveToNext = true;
      return `${total}`;
    });
    if (moveToNext) {
      moveToNextSegment(e, this.root.getFieldNode());
    }
  }
  #handleBackspace(e) {
    const stateKey = this.part;
    if (stateKey in this.root.states) {
      this.root.states[stateKey].hasLeftFocus = false;
    }
    let moveToPrev = false;
    this.root.updateSegment(this.part, (prev) => {
      if (prev === null) {
        moveToPrev = true;
        this.announcer.announce(null);
        return null;
      }
      if (prev.length === 2 && prev.startsWith("0")) {
        this.announcer.announce(null);
        return null;
      }
      const str = prev.toString();
      if (str.length === 1) {
        this.announcer.announce(null);
        return null;
      }
      const next = Number.parseInt(str.slice(0, -1));
      this.announcer.announce(this.#getAnnouncement(next));
      return `${next}`;
    });
    if (moveToPrev) {
      moveToPrevSegment(e, this.root.getFieldNode());
    }
  }
  onfocusout(_) {
    const stateKey = this.part;
    if (stateKey in this.root.states) {
      this.root.states[stateKey].hasLeftFocus = true;
    }
    if (this.config.padZero) {
      this.root.updateSegment(this.part, (prev) => {
        if (prev && prev.length === 1) {
          return `0${prev}`;
        }
        return prev;
      });
    }
  }
  getSegmentProps() {
    const segmentValues = this.root.segmentValues;
    const placeholder = this.root.placeholder.current;
    const isEmpty = segmentValues[this.part] === null;
    let date = placeholder;
    if (segmentValues[this.part]) {
      date = placeholder.set({ [this.part]: Number.parseInt(segmentValues[this.part]) });
    }
    const valueNow = date[this.part];
    const valueMin = this.#getMin();
    const valueMax = this.#getMax();
    let valueText = isEmpty ? "Empty" : `${valueNow}`;
    if (this.part === "hour" && "dayPeriod" in segmentValues && segmentValues.dayPeriod) {
      valueText = isEmpty ? "Empty" : `${valueNow} ${segmentValues.dayPeriod}`;
    }
    return {
      "aria-label": `${this.part}, `,
      "aria-valuemin": valueMin,
      "aria-valuemax": valueMax,
      "aria-valuenow": valueNow,
      "aria-valuetext": valueText
    };
  }
  #props = /* @__PURE__ */ user_derived(() => {
    return {
      ...this.root.sharedSegmentAttrs,
      id: this.opts.id.current,
      ...this.getSegmentProps(),
      onkeydown: this.onkeydown,
      onfocusout: this.onfocusout,
      onclick: this.root.handleSegmentClick,
      ...this.root.getBaseSegmentAttrs(this.part, this.opts.id.current),
      ...this.attachment
    };
  });
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateFieldYearSegmentState extends BaseNumericSegmentState {
  #pressedKeys = [];
  #backspaceCount = 0;
  constructor(opts, root2) {
    super(opts, root2, "year", SEGMENT_CONFIGS.year);
  }
  onkeydown(e) {
    if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;
    if (e.key !== TAB) e.preventDefault();
    if (!isAcceptableSegmentKey(e.key)) return;
    if (isArrowUp(e.key)) {
      this.#resetBackspaceCount();
      super.onkeydown(e);
      return;
    }
    if (isArrowDown(e.key)) {
      this.#resetBackspaceCount();
      super.onkeydown(e);
      return;
    }
    if (isNumberString(e.key)) {
      this.#handleYearNumberKey(e);
      return;
    }
    if (isBackspace(e.key)) {
      this.#handleYearBackspace(e);
      return;
    }
    if (isSegmentNavigationKey(e.key)) {
      handleSegmentNavigation(e, this.root.getFieldNode());
    }
  }
  #resetBackspaceCount() {
    this.#backspaceCount = 0;
  }
  #incrementBackspaceCount() {
    this.#backspaceCount++;
  }
  #handleYearNumberKey(e) {
    this.#pressedKeys.push(e.key);
    let moveToNext = false;
    const num = Number.parseInt(e.key);
    this.root.updateSegment("year", (prev) => {
      if (this.root.states.year.hasLeftFocus) {
        prev = null;
        this.root.states.year.hasLeftFocus = false;
      }
      if (prev === null) {
        this.announcer.announce(num);
        return `000${num}`;
      }
      const str = prev.toString() + num.toString();
      const mergedInt = Number.parseInt(str);
      const mergedIntDigits = String(mergedInt).length;
      if (mergedIntDigits < 4) {
        if (this.#backspaceCount > 0 && this.#pressedKeys.length <= this.#backspaceCount && str.length <= 4) {
          this.announcer.announce(mergedInt);
          return str;
        }
        this.announcer.announce(mergedInt);
        return prependYearZeros(mergedInt);
      }
      this.announcer.announce(mergedInt);
      moveToNext = true;
      const mergedIntStr = `${mergedInt}`;
      if (mergedIntStr.length > 4) {
        return mergedIntStr.slice(0, 4);
      }
      return mergedIntStr;
    });
    if (this.#pressedKeys.length === 4 || this.#pressedKeys.length === this.#backspaceCount) {
      moveToNext = true;
    }
    if (moveToNext) {
      moveToNextSegment(e, this.root.getFieldNode());
    }
  }
  #handleYearBackspace(e) {
    this.#pressedKeys = [];
    this.#incrementBackspaceCount();
    let moveToPrev = false;
    this.root.updateSegment("year", (prev) => {
      this.root.states.year.hasLeftFocus = false;
      if (prev === null) {
        moveToPrev = true;
        this.announcer.announce(null);
        return null;
      }
      const str = prev.toString();
      if (str.length === 1) {
        this.announcer.announce(null);
        return null;
      }
      const next = str.slice(0, -1);
      this.announcer.announce(next);
      return `${next}`;
    });
    if (moveToPrev) {
      moveToPrevSegment(e, this.root.getFieldNode());
    }
  }
  onfocusout(_) {
    this.root.states.year.hasLeftFocus = true;
    this.#pressedKeys = [];
    this.#resetBackspaceCount();
    this.root.updateSegment("year", (prev) => {
      if (prev && prev.length !== 4) {
        return prependYearZeros(Number.parseInt(prev));
      }
      return prev;
    });
  }
}
class DateFieldDaySegmentState extends BaseNumericSegmentState {
  constructor(opts, root2) {
    super(opts, root2, "day", SEGMENT_CONFIGS.day);
  }
}
class DateFieldMonthSegmentState extends BaseNumericSegmentState {
  constructor(opts, root2) {
    super(opts, root2, "month", SEGMENT_CONFIGS.month);
  }
}
class DateFieldHourSegmentState extends BaseNumericSegmentState {
  constructor(opts, root2) {
    super(opts, root2, "hour", SEGMENT_CONFIGS.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (isNumberString(e.key)) {
      const oldUpdateSegment = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (part, cb) => {
        const result = oldUpdateSegment(part, cb);
        if (part === "hour" && "hour" in this.root.segmentValues) {
          const hourValue = this.root.segmentValues.hour;
          if (hourValue === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24) {
            this.root.segmentValues.hour = "12";
          }
        }
        return result;
      };
    }
    super.onkeydown(e);
    this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class DateFieldMinuteSegmentState extends BaseNumericSegmentState {
  constructor(opts, root2) {
    super(opts, root2, "minute", SEGMENT_CONFIGS.minute);
  }
}
class DateFieldSecondSegmentState extends BaseNumericSegmentState {
  constructor(opts, root2) {
    super(opts, root2, "second", SEGMENT_CONFIGS.second);
  }
}
class DateFieldDayPeriodSegmentState {
  static create(opts) {
    return new DateFieldDayPeriodSegmentState(opts, DateFieldRootContext.get());
  }
  opts;
  root;
  attachment;
  #announcer;
  constructor(opts, root2) {
    this.opts = opts;
    this.root = root2;
    this.#announcer = this.root.announcer;
    this.onkeydown = this.onkeydown.bind(this);
    this.attachment = attachRef(opts.ref, (v) => this.root.dayPeriodNode = v);
  }
  onkeydown(e) {
    if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;
    if (e.key !== TAB) e.preventDefault();
    if (!isAcceptableDayPeriodKey(e.key)) return;
    if (isArrowUp(e.key) || isArrowDown(e.key)) {
      this.root.updateSegment("dayPeriod", (prev) => {
        if (prev === "AM") {
          const next2 = "PM";
          this.#announcer.announce(next2);
          return next2;
        }
        const next = "AM";
        this.#announcer.announce(next);
        return next;
      });
      return;
    }
    if (isBackspace(e.key)) {
      this.root.states.dayPeriod.hasLeftFocus = false;
      this.root.updateSegment("dayPeriod", () => {
        const next = "AM";
        this.#announcer.announce(next);
        return next;
      });
    }
    if (e.key === A || e.key === P || a) {
      this.root.updateSegment("dayPeriod", () => {
        const next = e.key === A || e.key === a ? "AM" : "PM";
        this.#announcer.announce(next);
        return next;
      });
    }
    if (isSegmentNavigationKey(e.key)) {
      handleSegmentNavigation(e, this.root.getFieldNode());
    }
  }
  #props = /* @__PURE__ */ user_derived(() => {
    const segmentValues = this.root.segmentValues;
    if (!("dayPeriod" in segmentValues)) return;
    const valueMin = 0;
    const valueMax = 12;
    const valueNow = segmentValues.dayPeriod === "AM" ? 0 : 12;
    const valueText = segmentValues.dayPeriod ?? "AM";
    return {
      ...this.root.sharedSegmentAttrs,
      id: this.opts.id.current,
      inputmode: "text",
      "aria-label": "AM/PM",
      "aria-valuemin": valueMin,
      "aria-valuemax": valueMax,
      "aria-valuenow": valueNow,
      "aria-valuetext": valueText,
      onkeydown: this.onkeydown,
      onclick: this.root.handleSegmentClick,
      ...this.root.getBaseSegmentAttrs("dayPeriod", this.opts.id.current),
      ...this.attachment
    };
  });
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateFieldLiteralSegmentState {
  static create(opts) {
    return new DateFieldLiteralSegmentState(opts, DateFieldRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root2) {
    this.opts = opts;
    this.root = root2;
    this.attachment = attachRef(opts.ref);
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "aria-hidden": getAriaHidden(true),
    ...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateFieldTimeZoneSegmentState {
  static create(opts) {
    return new DateFieldTimeZoneSegmentState(opts, DateFieldRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root2) {
    this.opts = opts;
    this.root = root2;
    this.onkeydown = this.onkeydown.bind(this);
    this.attachment = attachRef(opts.ref);
  }
  onkeydown(e) {
    if (e.key !== TAB) e.preventDefault();
    if (this.root.disabled.current) return;
    if (isSegmentNavigationKey(e.key)) {
      handleSegmentNavigation(e, this.root.getFieldNode());
    }
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": getDataReadonly(true),
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateFieldSegmentState {
  static create(part, opts) {
    const root2 = DateFieldRootContext.get();
    switch (part) {
      case "day":
        return new DateFieldDaySegmentState(opts, root2);
      case "month":
        return new DateFieldMonthSegmentState(opts, root2);
      case "year":
        return new DateFieldYearSegmentState(opts, root2);
      case "hour":
        return new DateFieldHourSegmentState(opts, root2);
      case "minute":
        return new DateFieldMinuteSegmentState(opts, root2);
      case "second":
        return new DateFieldSecondSegmentState(opts, root2);
      case "dayPeriod":
        return new DateFieldDayPeriodSegmentState(opts, root2);
      case "literal":
        return new DateFieldLiteralSegmentState(opts, root2);
      case "timeZoneName":
        return new DateFieldTimeZoneSegmentState(opts, root2);
    }
  }
}
function isAcceptableDayPeriodKey(key) {
  return isAcceptableSegmentKey(key) || key === A || key === P || key === a || key === p;
}
function isArrowUp(key) {
  return key === ARROW_UP;
}
function isArrowDown(key) {
  return key === ARROW_DOWN;
}
function isBackspace(key) {
  return key === BACKSPACE;
}
function prependYearZeros(year) {
  const digits = String(year).length;
  const diff = 4 - digits;
  return `${"0".repeat(diff)}${year}`;
}
function Date_field_hidden_input($$anchor, $$props) {
  push($$props, false);
  const hiddenInputState = DateFieldHiddenInputState.create();
  init();
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      Hidden_input($$anchor2, spread_props(() => hiddenInputState.props));
    };
    if_block(node, ($$render) => {
      if (hiddenInputState.shouldRender) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$3 = /* @__PURE__ */ from_html(`<span><!></span>`);
function Date_field_segment($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "children",
    "child",
    "part"
  ]);
  const segmentState = DateFieldSegmentState.create($$props.part, {
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, segmentState.props));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps) }));
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var span = root_2$3();
      attribute_effect(span, () => ({ ...get(mergedProps) }));
      var node_2 = child(span);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, span);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
const dateRangeFieldAttrs = createBitsAttrs({ component: "date-range-field", parts: ["root", "label"] });
const DateRangeFieldRootContext = new Context("DateRangeField.Root");
class DateRangeFieldRootState {
  static create(opts) {
    return DateRangeFieldRootContext.set(new DateRangeFieldRootState(opts));
  }
  opts;
  startFieldState = void 0;
  endFieldState = void 0;
  descriptionId = useId();
  formatter;
  #fieldNode = /* @__PURE__ */ state(null);
  get fieldNode() {
    return get(this.#fieldNode);
  }
  set fieldNode(value) {
    set(this.#fieldNode, value, true);
  }
  #labelNode = /* @__PURE__ */ state(null);
  get labelNode() {
    return get(this.#labelNode);
  }
  set labelNode(value) {
    set(this.#labelNode, value, true);
  }
  #descriptionNode = /* @__PURE__ */ state(null);
  get descriptionNode() {
    return get(this.#descriptionNode);
  }
  set descriptionNode(value) {
    set(this.#descriptionNode, value, true);
  }
  #startValueComplete = /* @__PURE__ */ user_derived(() => this.opts.startValue.current !== void 0);
  get startValueComplete() {
    return get(this.#startValueComplete);
  }
  set startValueComplete(value) {
    set(this.#startValueComplete, value);
  }
  #endValueComplete = /* @__PURE__ */ user_derived(() => this.opts.endValue.current !== void 0);
  get endValueComplete() {
    return get(this.#endValueComplete);
  }
  set endValueComplete(value) {
    set(this.#endValueComplete, value);
  }
  #rangeComplete = /* @__PURE__ */ user_derived(() => this.startValueComplete && this.endValueComplete);
  get rangeComplete() {
    return get(this.#rangeComplete);
  }
  set rangeComplete(value) {
    set(this.#rangeComplete, value);
  }
  domContext;
  attachment;
  constructor(opts) {
    this.opts = opts;
    this.formatter = createFormatter({
      initialLocale: this.opts.locale.current,
      monthFormat: box.with(() => "long"),
      yearFormat: box.with(() => "numeric")
    });
    this.domContext = new DOMContext(this.opts.ref);
    this.attachment = attachRef(this.opts.ref, (v) => this.fieldNode = v);
    onDestroyEffect(() => {
      removeDescriptionElement(this.descriptionId, this.domContext.getDocument());
    });
    user_effect(() => {
      if (this.formatter.getLocale() === this.opts.locale.current) return;
      this.formatter.setLocale(this.opts.locale.current);
    });
    watch(() => this.opts.value.current, (value) => {
      if (value.start && value.end) {
        this.opts.startValue.current = value.start;
        this.opts.endValue.current = value.end;
      } else if (value.start) {
        this.opts.startValue.current = value.start;
        this.opts.endValue.current = void 0;
      } else if (value.start === void 0 && value.end === void 0) {
        this.opts.startValue.current = void 0;
        this.opts.endValue.current = void 0;
      }
    });
    watch(() => this.opts.value.current, (value) => {
      const startValue = value.start;
      if (startValue && this.opts.placeholder.current !== startValue) {
        this.opts.placeholder.current = startValue;
      }
    });
    watch(
      [
        () => this.opts.startValue.current,
        () => this.opts.endValue.current
      ],
      ([startValue, endValue]) => {
        if (this.opts.value.current && this.opts.value.current.start === startValue && this.opts.value.current.end === endValue) {
          return;
        }
        if (startValue && endValue) {
          this.#updateValue((prev) => {
            if (prev.start === startValue && prev.end === endValue) {
              return prev;
            }
            return { start: startValue, end: endValue };
          });
        } else if (this.opts.value.current && this.opts.value.current.start && this.opts.value.current.end) {
          this.opts.value.current.start = void 0;
          this.opts.value.current.end = void 0;
        }
      }
    );
  }
  #validationStatus = /* @__PURE__ */ user_derived(() => {
    const value = this.opts.value.current;
    if (value === void 0) return false;
    if (value.start === void 0 || value.end === void 0) return false;
    const msg = this.opts.validate.current?.({ start: value.start, end: value.end });
    if (msg) {
      return { reason: "custom", message: msg };
    }
    const minValue = this.opts.minValue.current;
    if (minValue && value.start && isBefore(value.start, minValue)) {
      return { reason: "min" };
    }
    const maxValue = this.opts.maxValue.current;
    if (maxValue && value.end && isBefore(maxValue, value.end) || maxValue && value.start && isBefore(maxValue, value.start)) {
      return { reason: "max" };
    }
    return false;
  });
  get validationStatus() {
    return get(this.#validationStatus);
  }
  set validationStatus(value) {
    set(this.#validationStatus, value);
  }
  #isInvalid = /* @__PURE__ */ user_derived(() => {
    if (this.validationStatus === false) return false;
    return true;
  });
  get isInvalid() {
    return get(this.#isInvalid);
  }
  set isInvalid(value) {
    set(this.#isInvalid, value);
  }
  #updateValue(cb) {
    const value = this.opts.value.current;
    const newValue = cb(value);
    this.opts.value.current = newValue;
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    role: "group",
    [dateRangeFieldAttrs.root]: "",
    "data-invalid": getDataInvalid(this.isInvalid),
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateRangeFieldLabelState {
  static create(opts) {
    return new DateRangeFieldLabelState(opts, DateRangeFieldRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root2) {
    this.opts = opts;
    this.root = root2;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.labelNode = v);
  }
  #onclick = () => {
    if (this.root.opts.disabled.current) return;
    const firstSegment = getFirstSegment(this.root.fieldNode);
    if (!firstSegment) return;
    firstSegment.focus();
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-invalid": getDataInvalid(this.root.isInvalid),
    "data-disabled": getDataDisabled(this.root.opts.disabled.current),
    [dateRangeFieldAttrs.label]: "",
    onclick: this.#onclick,
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class DateRangeFieldInputState {
  static create(opts, type) {
    const root2 = DateRangeFieldRootContext.get();
    const fieldState = DateFieldRootState.create(
      {
        value: type === "start" ? root2.opts.startValue : root2.opts.endValue,
        disabled: root2.opts.disabled,
        readonly: root2.opts.readonly,
        readonlySegments: root2.opts.readonlySegments,
        validate: box.with(() => void 0),
        minValue: root2.opts.minValue,
        maxValue: root2.opts.maxValue,
        hourCycle: root2.opts.hourCycle,
        locale: root2.opts.locale,
        hideTimeZone: root2.opts.hideTimeZone,
        required: root2.opts.required,
        granularity: root2.opts.granularity,
        placeholder: root2.opts.placeholder,
        onInvalid: root2.opts.onInvalid,
        errorMessageId: root2.opts.errorMessageId,
        isInvalidProp: box.with(() => root2.isInvalid)
      },
      root2
    );
    return new DateFieldInputState({ name: opts.name, id: opts.id, ref: opts.ref }, fieldState);
  }
}
var root_2$2 = /* @__PURE__ */ from_html(`<div><!></div>`);
function Date_range_field($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), value = prop($$props, "value", 15), onValueChange = prop($$props, "onValueChange", 3, noop), placeholder = prop($$props, "placeholder", 15), onPlaceholderChange = prop($$props, "onPlaceholderChange", 3, noop), disabled = prop($$props, "disabled", 3, false), readonly = prop($$props, "readonly", 3, false), required = prop($$props, "required", 3, false), hideTimeZone = prop($$props, "hideTimeZone", 3, false), validate = prop($$props, "validate", 3, noop), onInvalid = prop($$props, "onInvalid", 3, noop), readonlySegments = prop($$props, "readonlySegments", 19, () => []), onStartValueChange = prop($$props, "onStartValueChange", 3, noop), onEndValueChange = prop($$props, "onEndValueChange", 3, noop), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "value",
    "onValueChange",
    "placeholder",
    "onPlaceholderChange",
    "disabled",
    "readonly",
    "required",
    "hourCycle",
    "granularity",
    "locale",
    "hideTimeZone",
    "validate",
    "onInvalid",
    "maxValue",
    "minValue",
    "readonlySegments",
    "children",
    "child",
    "onStartValueChange",
    "onEndValueChange",
    "errorMessageId"
  ]);
  let startValue = /* @__PURE__ */ state(proxy(value()?.start));
  let endValue = /* @__PURE__ */ state(proxy(value()?.end));
  function handleDefaultPlaceholder() {
    if (placeholder() !== void 0) return;
    const defaultPlaceholder = getDefaultDate({
      granularity: $$props.granularity,
      defaultValue: value()?.start
    });
    placeholder(defaultPlaceholder);
  }
  handleDefaultPlaceholder();
  watch.pre(() => placeholder(), () => {
    handleDefaultPlaceholder();
  });
  function handleDefaultValue() {
    if (value() !== void 0) return;
    const defaultValue = { start: void 0, end: void 0 };
    value(defaultValue);
  }
  handleDefaultValue();
  watch.pre(() => value(), () => {
    handleDefaultValue();
  });
  const rootState = DateRangeFieldRootState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v)),
    disabled: box.with(() => disabled()),
    readonly: box.with(() => readonly()),
    required: box.with(() => required()),
    hourCycle: box.with(() => $$props.hourCycle),
    granularity: box.with(() => $$props.granularity),
    locale: resolveLocaleProp(() => $$props.locale),
    hideTimeZone: box.with(() => hideTimeZone()),
    validate: box.with(() => validate()),
    maxValue: box.with(() => $$props.maxValue),
    minValue: box.with(() => $$props.minValue),
    placeholder: box.with(() => placeholder(), (v) => {
      placeholder(v);
      onPlaceholderChange()(v);
    }),
    readonlySegments: box.with(() => readonlySegments()),
    value: box.with(() => value(), (v) => {
      value(v);
      onValueChange()(v);
    }),
    startValue: box.with(() => get(startValue), (v) => {
      set(startValue, v, true);
      onStartValueChange()(v);
    }),
    endValue: box.with(() => get(endValue), (v) => {
      set(endValue, v, true);
      onEndValueChange()(v);
    }),
    onInvalid: box.with(() => onInvalid()),
    errorMessageId: box.with(() => $$props.errorMessageId)
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, rootState.props));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps) }));
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var div = root_2$2();
      attribute_effect(div, () => ({ ...get(mergedProps) }));
      var node_2 = child(div);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$1 = /* @__PURE__ */ from_html(`<div><!></div>`);
var root = /* @__PURE__ */ from_html(`<!> <!>`, 1);
function Date_range_field_input($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), name = prop($$props, "name", 3, ""), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "name",
    "child",
    "children",
    "type"
  ]);
  const inputState = DateRangeFieldInputState.create(
    {
      id: box.with(() => id()),
      ref: box.with(() => ref(), (v) => ref(v)),
      name: box.with(() => name())
    },
    $$props.type
  );
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, inputState.props, { role: "presentation" }));
  var fragment = root();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({
        props: get(mergedProps),
        segments: inputState.root.segmentContents
      }));
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var div = root_2$1();
      attribute_effect(div, () => ({ ...get(mergedProps) }));
      var node_2 = child(div);
      snippet(node_2, () => $$props.children ?? noop$1, () => ({ segments: inputState.root.segmentContents }));
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  var node_3 = sibling(node, 2);
  Date_field_hidden_input(node_3, {});
  append($$anchor, fragment);
  pop();
}
var root_2 = /* @__PURE__ */ from_html(`<span><!></span>`);
function Date_range_field_label($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "children",
    "child"
  ]);
  const labelState = DateRangeFieldLabelState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, labelState.props));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps) }));
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var span = root_2();
      attribute_effect(span, () => ({ ...get(mergedProps) }));
      var node_2 = child(span);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, span);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
function TestDateRangeFieldComponent() {
  const refs = [
    Date_range_field,
    Date_range_field_input,
    Date_range_field_label,
    Date_field_segment
  ];
  return refs;
}
const allExports = [
  Date_range_field,
  Date_range_field_input,
  Date_range_field_label,
  Date_field_segment
];
export {
  TestDateRangeFieldComponent,
  allExports
};
