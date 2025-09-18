import { tick, untrack as untrack$1, hasContext, getContext, setContext, getAllContexts, mount, unmount } from "svelte";
const PUBLIC_VERSION = "5";
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
}
const PROPS_IS_IMMUTABLE = 1;
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
function props_invalid_value(key2) {
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
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function not_equal(a, b) {
  return a !== b;
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
let tracing_mode_flag = false;
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
    l: null
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
  return true;
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
      var p = fn();
    } catch (error) {
      p = Promise.reject(error);
    }
    var r2 = () => p;
    promise = prev?.then(r2, r2) ?? Promise.resolve(p);
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
    function next(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next(promise);
        }
      }
      p.then(go, go);
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
  const d = derived;
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
    if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
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
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
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
            var p = proxy(exists ? target[prop2] : UNINITIALIZED);
            var s2 = /* @__PURE__ */ state(p);
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
              var p = has ? proxy(target[prop2]) : UNINITIALIZED;
              var s2 = /* @__PURE__ */ state(p);
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
          var p = with_parent(() => proxy(value2));
          set(s, p);
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
        var own_keys = Reflect.ownKeys(target).filter((key3) => {
          var source3 = sources.get(key3);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key2, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key2 in target)) {
            own_keys.push(key2);
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
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
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
function template_effect(fn, sync = [], async = []) {
  flatten(sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
  });
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
function key(node, get_key, render_fn) {
  var anchor = node;
  var key2 = UNINITIALIZED;
  var effect2;
  var pending_effect;
  var offscreen_fragment = null;
  var changed = not_equal;
  function commit() {
    if (effect2) {
      pause_effect(effect2);
    }
    if (offscreen_fragment !== null) {
      offscreen_fragment.lastChild.remove();
      anchor.before(offscreen_fragment);
      offscreen_fragment = null;
    }
    effect2 = pending_effect;
  }
  block(() => {
    if (changed(key2, key2 = get_key())) {
      var target = anchor;
      var defer = should_defer_append();
      if (defer) {
        offscreen_fragment = document.createDocumentFragment();
        offscreen_fragment.append(target = create_text());
      }
      pending_effect = branch(() => render_fn(target));
      if (defer) {
        current_batch.add_callback(commit);
      } else {
        commit();
      }
    }
  });
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
    for (var key2 in directives) {
      if (directives[key2]) {
        classname = classname ? classname + " " + key2 : key2;
      } else if (classname.length) {
        var len = key2.length;
        var a = 0;
        while ((a = classname.indexOf(key2, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
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
  for (var key2 in styles) {
    var value = styles[key2];
    if (value != null && value !== "") {
      css += " " + key2 + ": " + value + separator;
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
    for (var key2 in next_classes) {
      var is_present = !!next_classes[key2];
      if (prev_classes == null || is_present !== !!prev_classes[key2]) {
        dom.classList.toggle(key2, is_present);
      }
    }
  }
  return next_classes;
}
function update_styles(dom, prev = {}, next, priority) {
  for (var key2 in next) {
    var value = next[key2];
    if (prev[key2] !== value) {
      if (next[key2] == null) {
        dom.style.removeProperty(key2);
      } else {
        dom.style.setProperty(key2, value, priority);
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
  for (var key2 in prev) {
    if (!(key2 in next)) {
      next[key2] = null;
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
  for (const key3 in next) {
    let value = next[key3];
    if (is_option_element && key3 === "value" && value == null) {
      element.value = element.__value = "";
      current[key3] = value;
      continue;
    }
    if (key3 === "class") {
      var is_html = element.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
      current[key3] = value;
      current[CLASS] = next[CLASS];
      continue;
    }
    if (key3 === "style") {
      set_style(element, value, prev?.[STYLE], next[STYLE]);
      current[key3] = value;
      current[STYLE] = next[STYLE];
      continue;
    }
    var prev_value = current[key3];
    if (value === prev_value && !(value === void 0 && element.hasAttribute(key3))) {
      continue;
    }
    current[key3] = value;
    var prefix = key3[0] + key3[1];
    if (prefix === "$$") continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key3;
      let event_name = key3.slice(2);
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
            current[key3].call(this, evt);
          };
          current[event_handle_key] = create_event(event_name, element, handle, opts);
        } else {
          element[`__${event_name}`] = value;
          delegate([event_name]);
        }
      } else if (delegated) {
        element[`__${event_name}`] = void 0;
      }
    } else if (key3 === "style") {
      set_attribute(element, key3, value);
    } else if (key3 === "autofocus") {
      autofocus(
        /** @type {HTMLElement} */
        element,
        Boolean(value)
      );
    } else if (!is_custom_element && (key3 === "__value" || key3 === "value" && value != null)) {
      element.value = element.__value = value;
    } else if (key3 === "selected" && is_option_element) {
      set_selected(
        /** @type {HTMLOptionElement} */
        element,
        value
      );
    } else {
      var name = key3;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key3] = null;
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
          element.removeAttribute(key3);
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
    for (var key2 in descriptors) {
      if (descriptors[key2].set) {
        setters.push(key2);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
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
  get(target, key2) {
    if (target.exclude.includes(key2)) return;
    return target.props[key2];
  },
  set(target, key2) {
    return false;
  },
  getOwnPropertyDescriptor(target, key2) {
    if (target.exclude.includes(key2)) return;
    if (key2 in target.props) {
      return {
        enumerable: true,
        configurable: true,
        value: target.props[key2]
      };
    }
  },
  has(target, key2) {
    if (target.exclude.includes(key2)) return false;
    return key2 in target.props;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target.props).filter((key2) => !target.exclude.includes(key2));
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
  get(target, key2) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key2 in p) return p[key2];
    }
  },
  set(target, key2, value) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      const desc = get_descriptor(p, key2);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key2) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key2 in p) {
        const descriptor = get_descriptor(p, key2);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target, key2) {
    if (key2 === STATE_SYMBOL || key2 === LEGACY_PROPS) return false;
    for (let p of target.props) {
      if (is_function(p)) p = p();
      if (p != null && key2 in p) return true;
    }
    return false;
  },
  ownKeys(target) {
    const keys = [];
    for (let p of target.props) {
      if (is_function(p)) p = p();
      if (!p) continue;
      for (const key2 in p) {
        if (!keys.includes(key2)) keys.push(key2);
      }
      for (const key2 of Object.getOwnPropertySymbols(p)) {
        if (!keys.includes(key2)) keys.push(key2);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key2, flags, fallback) {
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
    setter = get_descriptor(props, key2)?.set ?? (is_entry_props && key2 in props ? (v) => props[key2] = v : void 0);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key2]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key2];
  }
  if (initial_value === void 0 && fallback !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      props_invalid_value();
      setter(initial_value);
    }
  }
  var getter;
  {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key2]
      );
      if (value === void 0) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  }
  if ((flags & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return (
      /** @type {() => V} */
      (function(value, mutation) {
        if (arguments.length > 0) {
          if (!mutation || legacy_parent || is_store_sub) {
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
        const new_value = mutation ? get(d) : bindable ? proxy(value) : value;
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
function isFunction$1(value) {
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
  if (isFunction$1(value)) return box.with(value);
  return box(value);
}
function boxFlatten(boxes) {
  return Object.entries(boxes).reduce(
    (acc, [key2, b]) => {
      if (!box.isBox(b)) {
        return Object.assign(acc, { [key2]: b });
      }
      if (box.isWritableBox(b)) {
        Object.defineProperty(acc, key2, {
          get() {
            return b.current;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set(v) {
            b.current = v;
          }
        });
      } else {
        Object.defineProperty(acc, key2, {
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
  return splitByCase(str).map((p) => upperFirst(p)).join("");
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
styleToString(srOnlyStyles);
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
function isEventHandler(key2) {
  return EVENT_LIST_SET.has(key2);
}
function mergeProps(...args) {
  const result = { ...args[0] };
  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    if (!props)
      continue;
    for (const key2 of Object.keys(props)) {
      const a = result[key2];
      const b = props[key2];
      const aIsFunction = typeof a === "function";
      const bIsFunction = typeof b === "function";
      if (aIsFunction && typeof bIsFunction && isEventHandler(key2)) {
        const aHandler = a;
        const bHandler = b;
        result[key2] = composeHandlers(aHandler, bHandler);
      } else if (aIsFunction && bIsFunction) {
        result[key2] = executeCallbacks(a, b);
      } else if (key2 === "class") {
        const aIsClassValue = isClassValue(a);
        const bIsClassValue = isClassValue(b);
        if (aIsClassValue && bIsClassValue) {
          result[key2] = clsx$1(a, b);
        } else if (aIsClassValue) {
          result[key2] = clsx$1(a);
        } else if (bIsClassValue) {
          result[key2] = clsx$1(b);
        }
      } else if (key2 === "style") {
        const aIsObject = typeof a === "object";
        const bIsObject = typeof b === "object";
        const aIsString = typeof a === "string";
        const bIsString = typeof b === "string";
        if (aIsObject && bIsObject) {
          result[key2] = { ...a, ...b };
        } else if (aIsObject && bIsString) {
          const parsedStyle = cssToStyleObj(b);
          result[key2] = { ...a, ...parsedStyle };
        } else if (aIsString && bIsObject) {
          const parsedStyle = cssToStyleObj(a);
          result[key2] = { ...parsedStyle, ...b };
        } else if (aIsString && bIsString) {
          const parsedStyleA = cssToStyleObj(a);
          const parsedStyleB = cssToStyleObj(b);
          result[key2] = { ...parsedStyleA, ...parsedStyleB };
        } else if (aIsObject) {
          result[key2] = a;
        } else if (bIsObject) {
          result[key2] = b;
        } else if (aIsString) {
          result[key2] = a;
        } else if (bIsString) {
          result[key2] = b;
        }
      } else {
        result[key2] = b !== void 0 ? b : a;
      }
    }
    for (const key2 of Object.getOwnPropertySymbols(props)) {
      const a = result[key2];
      const b = props[key2];
      result[key2] = b !== void 0 ? b : a;
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
class SvelteMap extends Map {
  /** @type {Map<K, Source<number>>} */
  #sources = /* @__PURE__ */ new Map();
  #version = /* @__PURE__ */ state(0);
  #size = /* @__PURE__ */ state(0);
  #update_version = update_version || -1;
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(value) {
    super();
    if (value) {
      for (var [key2, v] of value) {
        super.set(key2, v);
      }
      this.#size.v = super.size;
    }
  }
  /**
   * If the source is being created inside the same reaction as the SvelteMap instance,
   * we use `state` so that it will not be a dependency of the reaction. Otherwise we
   * use `source` so it will be.
   *
   * @template T
   * @param {T} value
   * @returns {Source<T>}
   */
  #source(value) {
    return update_version === this.#update_version ? /* @__PURE__ */ state(value) : source(value);
  }
  /** @param {K} key */
  has(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    if (s === void 0) {
      var ret = super.get(key2);
      if (ret !== void 0) {
        s = this.#source(0);
        sources.set(key2, s);
      } else {
        get(this.#version);
        return false;
      }
    }
    get(s);
    return true;
  }
  /**
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn
   * @param {any} [this_arg]
   */
  forEach(callbackfn, this_arg) {
    this.#read_all();
    super.forEach(callbackfn, this_arg);
  }
  /** @param {K} key */
  get(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    if (s === void 0) {
      var ret = super.get(key2);
      if (ret !== void 0) {
        s = this.#source(0);
        sources.set(key2, s);
      } else {
        get(this.#version);
        return void 0;
      }
    }
    get(s);
    return super.get(key2);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(key2, value) {
    var sources = this.#sources;
    var s = sources.get(key2);
    var prev_res = super.get(key2);
    var res = super.set(key2, value);
    var version = this.#version;
    if (s === void 0) {
      s = this.#source(0);
      sources.set(key2, s);
      set(this.#size, super.size);
      increment(version);
    } else if (prev_res !== value) {
      increment(s);
      var v_reactions = version.reactions === null ? null : new Set(version.reactions);
      var needs_version_increase = v_reactions === null || !s.reactions?.every(
        (r2) => (
          /** @type {NonNullable<typeof v_reactions>} */
          v_reactions.has(r2)
        )
      );
      if (needs_version_increase) {
        increment(version);
      }
    }
    return res;
  }
  /** @param {K} key */
  delete(key2) {
    var sources = this.#sources;
    var s = sources.get(key2);
    var res = super.delete(key2);
    if (s !== void 0) {
      sources.delete(key2);
      set(this.#size, super.size);
      set(s, -1);
      increment(this.#version);
    }
    return res;
  }
  clear() {
    if (super.size === 0) {
      return;
    }
    super.clear();
    var sources = this.#sources;
    set(this.#size, 0);
    for (var s of sources.values()) {
      set(s, -1);
    }
    increment(this.#version);
    sources.clear();
  }
  #read_all() {
    get(this.#version);
    var sources = this.#sources;
    if (this.#size.v !== sources.size) {
      for (var key2 of super.keys()) {
        if (!sources.has(key2)) {
          var s = this.#source(0);
          sources.set(key2, s);
        }
      }
    }
    for ([, s] of this.#sources) {
      get(s);
    }
  }
  keys() {
    get(this.#version);
    return super.keys();
  }
  values() {
    this.#read_all();
    return super.values();
  }
  entries() {
    this.#read_all();
    return super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    get(this.#size);
    return super.size;
  }
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
function afterSleep(ms, cb) {
  return setTimeout(cb, ms);
}
function afterTick(fn) {
  tick().then(fn);
}
function onMountEffect(fn) {
  user_effect(() => {
    const cleanup = untrack$1(() => fn());
    return cleanup;
  });
}
const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;
function isHTMLElement$1(node) {
  return isObject(node) && node.nodeType === ELEMENT_NODE && typeof node.nodeName === "string";
}
function isDocument(node) {
  return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
  return isObject(node) && node.constructor?.name === "VisualViewport";
}
function isNode(node) {
  return isObject(node) && node.nodeType !== void 0;
}
function isShadowRoot(node) {
  return isNode(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in node;
}
function getDocument(node) {
  if (isDocument(node))
    return node;
  if (isWindow(node))
    return node.document;
  return node?.ownerDocument ?? document;
}
function getWindow(node) {
  if (isShadowRoot(node))
    return getWindow(node.host);
  if (isDocument(node))
    return node.defaultView ?? window;
  if (isHTMLElement$1(node))
    return node.ownerDocument?.defaultView ?? window;
  return window;
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
function isFunction(value) {
  return typeof value === "function";
}
function extract(value, defaultValue) {
  if (isFunction(value)) {
    const getter = value;
    const gotten = getter();
    if (gotten === void 0) return defaultValue;
    return gotten;
  }
  if (value === void 0) return defaultValue;
  return value;
}
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
function useDebounce(callback, wait) {
  let context = /* @__PURE__ */ state(null);
  const wait$ = /* @__PURE__ */ user_derived(() => extract(wait, 250));
  function debounced(...args) {
    if (get(context)) {
      if (get(context).timeout) {
        clearTimeout(get(context).timeout);
      }
    } else {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      set(context, { timeout: null, runner: null, promise, resolve, reject }, true);
    }
    get(context).runner = async () => {
      if (!get(context)) return;
      const ctx = get(context);
      set(context, null);
      try {
        ctx.resolve(await callback.apply(this, args));
      } catch (error) {
        ctx.reject(error);
      }
    };
    get(context).timeout = setTimeout(get(context).runner, get(wait$));
    return get(context).promise;
  }
  debounced.cancel = async () => {
    if (!get(context) || get(context).timeout === null) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!get(context) || get(context).timeout === null) return;
    }
    clearTimeout(get(context).timeout);
    get(context).reject("Cancelled");
    set(context, null);
  };
  debounced.runScheduledNow = async () => {
    if (!get(context) || !get(context).timeout) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!get(context) || !get(context).timeout) return;
    }
    clearTimeout(get(context).timeout);
    get(context).timeout = null;
    await get(context).runner?.();
  };
  Object.defineProperty(debounced, "pending", {
    enumerable: true,
    get() {
      return !!get(context)?.timeout;
    }
  });
  return debounced;
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
class Previous {
  #previous = /* @__PURE__ */ state(void 0);
  constructor(getter, initialValue) {
    if (initialValue !== void 0) set(this.#previous, initialValue, true);
    watch(() => getter(), (_, v) => {
      set(this.#previous, v, true);
    });
  }
  get current() {
    return get(this.#previous);
  }
}
function getDataOpenClosed(condition) {
  return condition ? "open" : "closed";
}
function getAriaExpanded(condition) {
  return condition ? "true" : "false";
}
function getDataDisabled(condition) {
  return condition ? "" : void 0;
}
function getDataOrientation(orientation) {
  return orientation;
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
const END = "End";
const ESCAPE = "Escape";
const HOME = "Home";
const TAB = "Tab";
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function getNextKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
    vertical: ARROW_DOWN
  }[orientation];
}
function getPrevKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
    vertical: ARROW_UP
  }[orientation];
}
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
  if (!["ltr", "rtl"].includes(dir))
    dir = "ltr";
  if (!["horizontal", "vertical"].includes(orientation))
    orientation = "horizontal";
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
}
const isBrowser = typeof document !== "undefined";
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isElement(element) {
  return element instanceof Element;
}
class RovingFocusGroup {
  #opts;
  #currentTabStopId = box(null);
  constructor(opts) {
    this.#opts = opts;
  }
  getCandidateNodes() {
    if (!this.#opts.rootNode.current)
      return [];
    if (this.#opts.candidateSelector) {
      const candidates = Array.from(this.#opts.rootNode.current.querySelectorAll(this.#opts.candidateSelector));
      return candidates;
    } else if (this.#opts.candidateAttr) {
      const candidates = Array.from(this.#opts.rootNode.current.querySelectorAll(`[${this.#opts.candidateAttr}]:not([data-disabled])`));
      return candidates;
    }
    return [];
  }
  focusFirstCandidate() {
    const items = this.getCandidateNodes();
    if (!items.length)
      return;
    items[0]?.focus();
  }
  handleKeydown(node, e, both = false) {
    const rootNode = this.#opts.rootNode.current;
    if (!rootNode || !node)
      return;
    const items = this.getCandidateNodes();
    if (!items.length)
      return;
    const currentIndex = items.indexOf(node);
    const dir = getElemDirection(rootNode);
    const { nextKey, prevKey } = getDirectionalKeys(dir, this.#opts.orientation.current);
    const loop = this.#opts.loop.current;
    const keyToIndex = {
      [nextKey]: currentIndex + 1,
      [prevKey]: currentIndex - 1,
      [HOME]: 0,
      [END]: items.length - 1
    };
    if (both) {
      const altNextKey = nextKey === ARROW_DOWN ? ARROW_RIGHT : ARROW_DOWN;
      const altPrevKey = prevKey === ARROW_UP ? ARROW_LEFT : ARROW_UP;
      keyToIndex[altNextKey] = currentIndex + 1;
      keyToIndex[altPrevKey] = currentIndex - 1;
    }
    let itemIndex = keyToIndex[e.key];
    if (itemIndex === void 0)
      return;
    e.preventDefault();
    if (itemIndex < 0 && loop) {
      itemIndex = items.length - 1;
    } else if (itemIndex === items.length && loop) {
      itemIndex = 0;
    }
    const itemToFocus = items[itemIndex];
    if (!itemToFocus)
      return;
    itemToFocus.focus();
    this.#currentTabStopId.current = itemToFocus.id;
    this.#opts.onCandidateFocus?.(itemToFocus);
    return itemToFocus;
  }
  getTabIndex(node) {
    const items = this.getCandidateNodes();
    const anyActive = this.#currentTabStopId.current !== null;
    if (node && !anyActive && items[0] === node) {
      this.#currentTabStopId.current = node.id;
      return 0;
    } else if (node?.id === this.#currentTabStopId.current) {
      return 0;
    }
    return -1;
  }
  setCurrentTabStopId(id) {
    this.#currentTabStopId.current = id;
  }
  focusCurrentTabStop() {
    const currentTabStopId = this.#currentTabStopId.current;
    if (!currentTabStopId)
      return;
    const currentTabStop = this.#opts.rootNode.current?.querySelector(`#${currentTabStopId}`);
    if (!currentTabStop || !isHTMLElement(currentTabStop))
      return;
    currentTabStop.focus();
  }
}
function noop() {
}
function createId(prefixOrUid, uid) {
  return `bits-${prefixOrUid}`;
}
class StateMachine {
  state;
  #machine;
  constructor(initialState, machine) {
    this.state = box(initialState);
    this.#machine = machine;
    this.dispatch = this.dispatch.bind(this);
  }
  #reducer(event) {
    const nextState = this.#machine[this.state.current][event];
    return nextState ?? this.state.current;
  }
  dispatch(event) {
    this.state.current = this.#reducer(event);
  }
}
const presenceMachine = {
  mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
  unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
  unmounted: { MOUNT: "mounted" }
};
class Presence {
  opts;
  #prevAnimationNameState = /* @__PURE__ */ state("none");
  get prevAnimationNameState() {
    return get(this.#prevAnimationNameState);
  }
  set prevAnimationNameState(value) {
    set(this.#prevAnimationNameState, value, true);
  }
  #styles = /* @__PURE__ */ state(proxy({}));
  get styles() {
    return get(this.#styles);
  }
  set styles(value) {
    set(this.#styles, value, true);
  }
  initialStatus;
  previousPresent;
  machine;
  present;
  constructor(opts) {
    this.opts = opts;
    this.present = this.opts.open;
    this.initialStatus = opts.open.current ? "mounted" : "unmounted";
    this.previousPresent = new Previous(() => this.present.current);
    this.machine = new StateMachine(this.initialStatus, presenceMachine);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    this.handleAnimationStart = this.handleAnimationStart.bind(this);
    watchPresenceChange(this);
    watchStatusChange(this);
    watchRefChange(this);
  }
  /**
   * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
   * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
   * make sure we only trigger ANIMATION_END for the currently active animation.
   */
  handleAnimationEnd(event) {
    if (!this.opts.ref.current) return;
    const currAnimationName = getAnimationName(this.opts.ref.current);
    const isCurrentAnimation = currAnimationName.includes(event.animationName) || currAnimationName === "none";
    if (event.target === this.opts.ref.current && isCurrentAnimation) {
      this.machine.dispatch("ANIMATION_END");
    }
  }
  handleAnimationStart(event) {
    if (!this.opts.ref.current) return;
    if (event.target === this.opts.ref.current) {
      this.prevAnimationNameState = getAnimationName(this.opts.ref.current);
    }
  }
  #isPresent = /* @__PURE__ */ user_derived(() => {
    return ["mounted", "unmountSuspended"].includes(this.machine.state.current);
  });
  get isPresent() {
    return get(this.#isPresent);
  }
  set isPresent(value) {
    set(this.#isPresent, value);
  }
}
function watchPresenceChange(state2) {
  watch(() => state2.present.current, () => {
    if (!state2.opts.ref.current) return;
    const hasPresentChanged = state2.present.current !== state2.previousPresent.current;
    if (!hasPresentChanged) return;
    const prevAnimationName = state2.prevAnimationNameState;
    const currAnimationName = getAnimationName(state2.opts.ref.current);
    if (state2.present.current) {
      state2.machine.dispatch("MOUNT");
    } else if (currAnimationName === "none" || state2.styles.display === "none") {
      state2.machine.dispatch("UNMOUNT");
    } else {
      const isAnimating = prevAnimationName !== currAnimationName;
      if (state2.previousPresent.current && isAnimating) {
        state2.machine.dispatch("ANIMATION_OUT");
      } else {
        state2.machine.dispatch("UNMOUNT");
      }
    }
  });
}
function watchStatusChange(state2) {
  watch(() => state2.machine.state.current, () => {
    if (!state2.opts.ref.current) return;
    const currAnimationName = getAnimationName(state2.opts.ref.current);
    state2.prevAnimationNameState = state2.machine.state.current === "mounted" ? currAnimationName : "none";
  });
}
function watchRefChange(state2) {
  watch(() => state2.opts.ref.current, () => {
    if (!state2.opts.ref.current) return;
    state2.styles = getComputedStyle(state2.opts.ref.current);
    return executeCallbacks(on(state2.opts.ref.current, "animationstart", state2.handleAnimationStart), on(state2.opts.ref.current, "animationcancel", state2.handleAnimationEnd), on(state2.opts.ref.current, "animationend", state2.handleAnimationEnd));
  });
}
function getAnimationName(node) {
  return node ? getComputedStyle(node).animationName || "none" : "none";
}
function Presence_layer($$anchor, $$props) {
  push($$props, true);
  const presenceState = new Presence({ open: box.with(() => $$props.open), ref: $$props.ref });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.presence ?? noop$1, () => ({ present: presenceState.isPresent }));
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if ($$props.forceMount || $$props.open || presenceState.isPresent) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}
function Portal_consumer($$anchor, $$props) {
  var fragment = comment();
  var node = first_child(fragment);
  key(node, () => $$props.children, ($$anchor2) => {
    var fragment_1 = comment();
    var node_1 = first_child(fragment_1);
    snippet(node_1, () => $$props.children ?? noop$1);
    append($$anchor2, fragment_1);
  });
  append($$anchor, fragment);
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
const resolvePortalToProp = createPropResolver((config) => config.defaultPortalTo, "body");
function Portal($$anchor, $$props) {
  push($$props, true);
  const to = resolvePortalToProp(() => $$props.to);
  const context = getAllContexts();
  let target = /* @__PURE__ */ user_derived(getTarget);
  function getTarget() {
    if (!isBrowser || $$props.disabled) return null;
    let localTarget = null;
    if (typeof to.current === "string") {
      const target2 = document.querySelector(to.current);
      localTarget = target2;
    } else {
      localTarget = to.current;
    }
    return localTarget;
  }
  let instance;
  function unmountInstance() {
    if (instance) {
      unmount(instance);
      instance = null;
    }
  }
  watch([() => get(target), () => $$props.disabled], ([target2, disabled]) => {
    if (!target2 || disabled) {
      unmountInstance();
      return;
    }
    instance = mount(Portal_consumer, { target: target2, props: { children: $$props.children }, context });
    return () => {
      unmountInstance();
    };
  });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.children ?? noop$1);
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if ($$props.disabled) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
class CustomEventDispatcher {
  eventName;
  options;
  constructor(eventName, options = { bubbles: true, cancelable: true }) {
    this.eventName = eventName;
    this.options = options;
  }
  createEvent(detail) {
    return new CustomEvent(this.eventName, {
      ...this.options,
      detail
    });
  }
  dispatch(element, detail) {
    const event = this.createEvent(detail);
    element.dispatchEvent(event);
    return event;
  }
  listen(element, callback, options) {
    const handler = (event) => {
      callback(event);
    };
    return on(element, this.eventName, handler, options);
  }
}
function debounce(fn, wait = 500) {
  let timeout = null;
  const debounced = (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
  debounced.destroy = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
function isClickTrulyOutside(event, contentNode) {
  const { clientX, clientY } = event;
  const rect = contentNode.getBoundingClientRect();
  return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
class DismissibleLayerState {
  static create(opts) {
    return new DismissibleLayerState(opts);
  }
  opts;
  #interactOutsideProp;
  #behaviorType;
  #interceptedEvents = { pointerdown: false };
  #isResponsibleLayer = false;
  #isFocusInsideDOMTree = false;
  #documentObj = void 0;
  #onFocusOutside;
  #unsubClickListener = noop;
  constructor(opts) {
    this.opts = opts;
    this.#behaviorType = opts.interactOutsideBehavior;
    this.#interactOutsideProp = opts.onInteractOutside;
    this.#onFocusOutside = opts.onFocusOutside;
    user_effect(() => {
      this.#documentObj = getOwnerDocument(this.opts.ref.current);
    });
    let unsubEvents = noop;
    const cleanup = () => {
      this.#resetState();
      globalThis.bitsDismissableLayers.delete(this);
      this.#handleInteractOutside.destroy();
      unsubEvents();
    };
    watch([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
      if (!this.opts.enabled.current || !this.opts.ref.current) return;
      afterSleep(1, () => {
        if (!this.opts.ref.current) return;
        globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
        unsubEvents();
        unsubEvents = this.#addEventListeners();
      });
      return cleanup;
    });
    onDestroyEffect(() => {
      this.#resetState.destroy();
      globalThis.bitsDismissableLayers.delete(this);
      this.#handleInteractOutside.destroy();
      this.#unsubClickListener();
      unsubEvents();
    });
  }
  #handleFocus = (event) => {
    if (event.defaultPrevented) return;
    if (!this.opts.ref.current) return;
    afterTick(() => {
      if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target)) return;
      if (event.target && !this.#isFocusInsideDOMTree) {
        this.#onFocusOutside.current?.(event);
      }
    });
  };
  #addEventListeners() {
    return executeCallbacks(
      /**
       * CAPTURE INTERACTION START
       * mark interaction-start event as intercepted.
       * mark responsible layer during interaction start
       * to avoid checking if is responsible layer during interaction end
       * when a new floating element may have been opened.
       */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
      /**
       * BUBBLE INTERACTION START
       * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
       * to avoid prematurely checking if other events were intercepted.
       */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
      /**
       * HANDLE FOCUS OUTSIDE
       */
      on(this.#documentObj, "focusin", this.#handleFocus)
    );
  }
  #handleDismiss = (e) => {
    let event = e;
    if (event.defaultPrevented) {
      event = createWrappedEvent(e);
    }
    this.#interactOutsideProp.current(e);
  };
  #handleInteractOutside = debounce(
    (e) => {
      if (!this.opts.ref.current) {
        this.#unsubClickListener();
        return;
      }
      const isEventValid = this.opts.isValidEvent.current(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);
      if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
        this.#unsubClickListener();
        return;
      }
      let event = e;
      if (event.defaultPrevented) {
        event = createWrappedEvent(event);
      }
      if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
        this.#unsubClickListener();
        return;
      }
      if (e.pointerType === "touch") {
        this.#unsubClickListener();
        this.#unsubClickListener = addEventListener(this.#documentObj, "click", this.#handleDismiss, { once: true });
      } else {
        this.#interactOutsideProp.current(event);
      }
    },
    10
  );
  #markInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = true;
  };
  #markNonInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = false;
  };
  #markResponsibleLayer = () => {
    if (!this.opts.ref.current) return;
    this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
  };
  #isTargetWithinLayer = (target) => {
    if (!this.opts.ref.current) return false;
    return isOrContainsTarget(this.opts.ref.current, target);
  };
  #resetState = debounce(
    () => {
      for (const eventType in this.#interceptedEvents) {
        this.#interceptedEvents[eventType] = false;
      }
      this.#isResponsibleLayer = false;
    },
    20
  );
  #isAnyEventIntercepted() {
    const i = Object.values(this.#interceptedEvents).some(Boolean);
    return i;
  }
  #onfocuscapture = () => {
    this.#isFocusInsideDOMTree = true;
  };
  #onblurcapture = () => {
    this.#isFocusInsideDOMTree = false;
  };
  props = {
    onfocuscapture: this.#onfocuscapture,
    onblurcapture: this.#onblurcapture
  };
}
function getTopMostLayer(layersArr) {
  return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
  const layersArr = [...globalThis.bitsDismissableLayers];
  const topMostLayer = getTopMostLayer(layersArr);
  if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode.opts.ref.current === node;
}
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0) return false;
  const target = e.target;
  if (!isElement(target)) return false;
  const ownerDocument = getOwnerDocument(target);
  const isValid = ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
  return isValid;
}
function createWrappedEvent(e) {
  const capturedCurrentTarget = e.currentTarget;
  const capturedTarget = e.target;
  let newEvent;
  if (e instanceof PointerEvent) {
    newEvent = new PointerEvent(e.type, e);
  } else {
    newEvent = new PointerEvent("pointerdown", e);
  }
  let isPrevented = false;
  const wrappedEvent = new Proxy(newEvent, {
    get: (target, prop2) => {
      if (prop2 === "currentTarget") {
        return capturedCurrentTarget;
      }
      if (prop2 === "target") {
        return capturedTarget;
      }
      if (prop2 === "preventDefault") {
        return () => {
          isPrevented = true;
          if (typeof target.preventDefault === "function") {
            target.preventDefault();
          }
        };
      }
      if (prop2 === "defaultPrevented") {
        return isPrevented;
      }
      if (prop2 in target) {
        return target[prop2];
      }
      return e[prop2];
    }
  });
  return wrappedEvent;
}
function Dismissible_layer($$anchor, $$props) {
  push($$props, true);
  let interactOutsideBehavior = prop($$props, "interactOutsideBehavior", 3, "close"), onInteractOutside = prop($$props, "onInteractOutside", 3, noop), onFocusOutside = prop($$props, "onFocusOutside", 3, noop), isValidEvent2 = prop($$props, "isValidEvent", 3, () => false);
  const dismissibleLayerState = DismissibleLayerState.create({
    id: box.with(() => $$props.id),
    interactOutsideBehavior: box.with(() => interactOutsideBehavior()),
    onInteractOutside: box.with(() => onInteractOutside()),
    enabled: box.with(() => $$props.enabled),
    onFocusOutside: box.with(() => onFocusOutside()),
    isValidEvent: box.with(() => isValidEvent2()),
    ref: $$props.ref
  });
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.children ?? noop$1, () => ({ props: dismissibleLayerState.props }));
  append($$anchor, fragment);
  pop();
}
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
class EscapeLayerState {
  static create(opts) {
    return new EscapeLayerState(opts);
  }
  opts;
  domContext;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(this.opts.ref);
    let unsubEvents = noop;
    watch(() => opts.enabled.current, (enabled) => {
      if (enabled) {
        globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
        unsubEvents = this.#addEventListener();
      }
      return () => {
        unsubEvents();
        globalThis.bitsEscapeLayers.delete(this);
      };
    });
  }
  #addEventListener = () => {
    return on(this.domContext.getDocument(), "keydown", this.#onkeydown, { passive: false });
  };
  #onkeydown = (e) => {
    if (e.key !== ESCAPE || !isResponsibleEscapeLayer(this)) return;
    const clonedEvent = new KeyboardEvent(e.type, e);
    e.preventDefault();
    const behaviorType = this.opts.escapeKeydownBehavior.current;
    if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
    this.opts.onEscapeKeydown.current(clonedEvent);
  };
}
function isResponsibleEscapeLayer(instance) {
  const layersArr = [...globalThis.bitsEscapeLayers];
  const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
  if (topMostLayer) return topMostLayer[0] === instance;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode === instance;
}
function Escape_layer($$anchor, $$props) {
  push($$props, true);
  let escapeKeydownBehavior = prop($$props, "escapeKeydownBehavior", 3, "close"), onEscapeKeydown = prop($$props, "onEscapeKeydown", 3, noop);
  EscapeLayerState.create({
    escapeKeydownBehavior: box.with(() => escapeKeydownBehavior()),
    onEscapeKeydown: box.with(() => onEscapeKeydown()),
    enabled: box.with(() => $$props.enabled),
    ref: $$props.ref
  });
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.children ?? noop$1);
  append($$anchor, fragment);
  pop();
}
globalThis.bitsIdCounter ??= { current: 0 };
function useId(prefix = "bits") {
  globalThis.bitsIdCounter.current++;
  return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
const defaultOptions = { afterMs: 1e4, onChange: noop };
function boxAutoReset(defaultValue, options) {
  const { afterMs, onChange, getWindow: getWindow2 } = { ...defaultOptions, ...options };
  let timeout = null;
  let value = /* @__PURE__ */ state(proxy(defaultValue));
  function resetAfter() {
    return getWindow2().setTimeout(
      () => {
        set(value, defaultValue, true);
        onChange?.(defaultValue);
      },
      afterMs
    );
  }
  user_effect(() => {
    return () => {
      if (timeout) getWindow2().clearTimeout(timeout);
    };
  });
  return box.with(() => get(value), (v) => {
    set(value, v, true);
    onChange?.(v);
    if (timeout) getWindow2().clearTimeout(timeout);
    timeout = resetAfter();
  });
}
function Mounted($$anchor, $$props) {
  push($$props, true);
  let mounted = prop($$props, "mounted", 15, false), onMountedChange = prop($$props, "onMountedChange", 3, noop);
  onMountEffect(() => {
    mounted(true);
    onMountedChange()(true);
    return () => {
      mounted(false);
      onMountedChange()(false);
    };
  });
  pop();
}
function getTabbableCandidates(container) {
  const nodes = [];
  const doc = getDocument(container);
  const walker = doc.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    // oxlint-disable-next-line no-explicit-any
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode())
    nodes.push(walker.currentNode);
  return nodes;
}
const ignoredElement = ["INPUT", "TEXTAREA"];
function useArrowNavigation(e, currentElement, parentElement, options) {
  if (!currentElement || ignoredElement.includes(currentElement.nodeName)) {
    return null;
  }
  const { arrowKeyOptions = "both", itemsArray = [], loop = true, dir = "ltr", preventScroll = true, focus = false } = options;
  const [right, left, up, down, home, end] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ];
  const goingVertical = up || down;
  const goingHorizontal = right || left;
  if (!home && !end && (!goingVertical && !goingHorizontal || arrowKeyOptions === "vertical" && goingHorizontal || arrowKeyOptions === "horizontal" && goingVertical))
    return null;
  const allCollectionItems = itemsArray;
  if (!allCollectionItems.length)
    return null;
  if (preventScroll)
    e.preventDefault();
  let item = null;
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === "ltr" ? right : left;
    item = findNextFocusableElement(allCollectionItems, currentElement, {
      goForward,
      loop
    });
  } else if (home) {
    item = allCollectionItems.at(0) || null;
  } else if (end) {
    item = allCollectionItems.at(-1) || null;
  }
  if (focus)
    item?.focus();
  return item;
}
function findNextFocusableElement(elements, currentElement, { goForward, loop }, iterations = elements.length) {
  if (--iterations === 0)
    return null;
  const index = elements.indexOf(currentElement);
  const newIndex = goForward ? index + 1 : index - 1;
  if (!loop && (newIndex < 0 || newIndex >= elements.length))
    return null;
  const adjustedNewIndex = (newIndex + elements.length) % elements.length;
  const candidate = elements[adjustedNewIndex];
  if (!candidate)
    return null;
  const isDisabled = candidate.hasAttribute("disabled") && candidate.getAttribute("disabled") !== "false";
  if (isDisabled) {
    return findNextFocusableElement(elements, candidate, { goForward, loop }, iterations);
  }
  return candidate;
}
class SvelteResizeObserver {
  #node;
  #onResize;
  constructor(node, onResize) {
    this.#node = node;
    this.#onResize = onResize;
    this.handler = this.handler.bind(this);
    user_effect(this.handler);
  }
  handler() {
    let rAF = 0;
    const _node = this.#node();
    if (!_node) return;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rAF);
      rAF = window.requestAnimationFrame(this.#onResize);
    });
    resizeObserver.observe(_node);
    return () => {
      window.cancelAnimationFrame(rAF);
      resizeObserver.unobserve(_node);
    };
  }
}
const navigationMenuAttrs = createBitsAttrs({
  component: "navigation-menu",
  parts: [
    "root",
    "sub",
    "item",
    "list",
    "trigger",
    "content",
    "link",
    "viewport",
    "menu",
    "indicator"
  ]
});
const NavigationMenuProviderContext = new Context("NavigationMenu.Root");
const NavigationMenuItemContext = new Context("NavigationMenu.Item");
const NavigationMenuListContext = new Context("NavigationMenu.List");
const NavigationMenuContentContext = new Context("NavigationMenu.Content");
const NavigationMenuSubContext = new Context("NavigationMenu.Sub");
class NavigationMenuProviderState {
  static create(opts) {
    return NavigationMenuProviderContext.set(new NavigationMenuProviderState(opts));
  }
  opts;
  indicatorTrackRef = box(null);
  viewportRef = box(null);
  viewportContent = new SvelteMap();
  onTriggerEnter;
  onTriggerLeave = noop;
  onContentEnter = noop;
  onContentLeave = noop;
  onItemSelect;
  onItemDismiss;
  activeItem = null;
  prevActiveItem = null;
  constructor(opts) {
    this.opts = opts;
    this.onTriggerEnter = opts.onTriggerEnter;
    this.onTriggerLeave = opts.onTriggerLeave ?? noop;
    this.onContentEnter = opts.onContentEnter ?? noop;
    this.onContentLeave = opts.onContentLeave ?? noop;
    this.onItemDismiss = opts.onItemDismiss;
    this.onItemSelect = opts.onItemSelect;
  }
  setActiveItem = (item) => {
    this.prevActiveItem = this.activeItem;
    this.activeItem = item;
  };
}
class NavigationMenuRootState {
  static create(opts) {
    return new NavigationMenuRootState(opts);
  }
  opts;
  attachment;
  provider;
  previousValue = box("");
  isDelaySkipped;
  #derivedDelay = /* @__PURE__ */ user_derived(() => {
    const isOpen = this.opts?.value?.current !== "";
    if (isOpen || this.isDelaySkipped.current) {
      return 100;
    } else {
      return this.opts.delayDuration.current;
    }
  });
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(this.opts.ref);
    this.isDelaySkipped = boxAutoReset(false, {
      afterMs: this.opts.skipDelayDuration.current,
      getWindow: () => getWindow(opts.ref.current)
    });
    this.provider = NavigationMenuProviderState.create({
      value: this.opts.value,
      previousValue: this.previousValue,
      dir: this.opts.dir,
      orientation: this.opts.orientation,
      rootNavigationMenuRef: this.opts.ref,
      isRootMenu: true,
      onTriggerEnter: (itemValue, itemState) => {
        this.#onTriggerEnter(itemValue, itemState);
      },
      onTriggerLeave: this.#onTriggerLeave,
      onContentEnter: this.#onContentEnter,
      onContentLeave: this.#onContentLeave,
      onItemSelect: this.#onItemSelect,
      onItemDismiss: this.#onItemDismiss
    });
  }
  #debouncedFn = useDebounce(
    (val, itemState) => {
      if (typeof val === "string") {
        this.setValue(val, itemState);
      }
    },
    () => get(this.#derivedDelay)
  );
  #onTriggerEnter = (itemValue, itemState) => {
    this.#debouncedFn(itemValue, itemState);
  };
  #onTriggerLeave = () => {
    this.isDelaySkipped.current = false;
    this.#debouncedFn("", null);
  };
  #onContentEnter = () => {
    this.#debouncedFn(void 0, null);
  };
  #onContentLeave = () => {
    if (this.provider.activeItem && this.provider.activeItem.opts.openOnHover.current === false) {
      return;
    }
    this.#debouncedFn("", null);
  };
  #onItemSelect = (itemValue, itemState) => {
    this.setValue(itemValue, itemState);
  };
  #onItemDismiss = () => {
    this.setValue("", null);
  };
  setValue = (newValue, itemState) => {
    this.previousValue.current = this.opts.value.current;
    this.opts.value.current = newValue;
    this.provider.setActiveItem(itemState);
    if (newValue === "") {
      this.previousValue.current = "";
    }
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    dir: this.opts.dir.current,
    [navigationMenuAttrs.root]: "",
    [navigationMenuAttrs.menu]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuSubState {
  static create(opts) {
    return new NavigationMenuSubState(opts, NavigationMenuProviderContext.get());
  }
  opts;
  context;
  previousValue = box("");
  subProvider;
  attachment;
  constructor(opts, context) {
    this.opts = opts;
    this.context = context;
    this.attachment = attachRef(this.opts.ref);
    this.subProvider = NavigationMenuProviderState.create({
      isRootMenu: false,
      value: this.opts.value,
      dir: this.context.opts.dir,
      orientation: this.opts.orientation,
      rootNavigationMenuRef: this.opts.ref,
      onTriggerEnter: this.setValue,
      onItemSelect: this.setValue,
      onItemDismiss: () => this.setValue("", null),
      previousValue: this.previousValue
    });
  }
  setValue = (newValue, itemState) => {
    this.previousValue.current = this.opts.value.current;
    this.opts.value.current = newValue;
    this.subProvider.setActiveItem(itemState);
    if (newValue === "") {
      this.previousValue.current = "";
    }
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [navigationMenuAttrs.sub]: "",
    [navigationMenuAttrs.menu]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuListState {
  static create(opts) {
    return NavigationMenuListContext.set(new NavigationMenuListState(opts, NavigationMenuProviderContext.get()));
  }
  wrapperId = box(useId());
  wrapperRef = box(null);
  opts;
  context;
  attachment;
  wrapperAttachment = attachRef(this.wrapperRef, (v) => this.context.indicatorTrackRef.current = v);
  #listTriggers = /* @__PURE__ */ state([]);
  get listTriggers() {
    return get(this.#listTriggers);
  }
  set listTriggers(value) {
    set(this.#listTriggers, value);
  }
  rovingFocusGroup;
  #wrapperMounted = /* @__PURE__ */ state(false);
  get wrapperMounted() {
    return get(this.#wrapperMounted);
  }
  set wrapperMounted(value) {
    set(this.#wrapperMounted, value, true);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.context = context;
    this.attachment = attachRef(this.opts.ref);
    this.rovingFocusGroup = new RovingFocusGroup({
      rootNode: opts.ref,
      candidateSelector: `${navigationMenuAttrs.selector("trigger")}:not([data-disabled]), ${navigationMenuAttrs.selector("link")}:not([data-disabled])`,
      loop: box.with(() => false),
      orientation: this.context.opts.orientation
    });
  }
  registerTrigger(trigger) {
    if (trigger) this.listTriggers.push(trigger);
    return () => {
      this.listTriggers = this.listTriggers.filter((t) => t.id !== trigger.id);
    };
  }
  #wrapperProps = /* @__PURE__ */ user_derived(() => ({ id: this.wrapperId.current, ...this.wrapperAttachment }));
  get wrapperProps() {
    return get(this.#wrapperProps);
  }
  set wrapperProps(value) {
    set(this.#wrapperProps, value);
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.context.opts.orientation.current),
    [navigationMenuAttrs.list]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuItemState {
  static create(opts) {
    return NavigationMenuItemContext.set(new NavigationMenuItemState(opts, NavigationMenuListContext.get()));
  }
  opts;
  attachment;
  listContext;
  #contentNode = /* @__PURE__ */ state(null);
  get contentNode() {
    return get(this.#contentNode);
  }
  set contentNode(value) {
    set(this.#contentNode, value, true);
  }
  #triggerNode = /* @__PURE__ */ state(null);
  get triggerNode() {
    return get(this.#triggerNode);
  }
  set triggerNode(value) {
    set(this.#triggerNode, value, true);
  }
  #focusProxyNode = /* @__PURE__ */ state(null);
  get focusProxyNode() {
    return get(this.#focusProxyNode);
  }
  set focusProxyNode(value) {
    set(this.#focusProxyNode, value, true);
  }
  restoreContentTabOrder = noop;
  wasEscapeClose = false;
  #contentId = /* @__PURE__ */ user_derived(() => this.contentNode?.id);
  get contentId() {
    return get(this.#contentId);
  }
  set contentId(value) {
    set(this.#contentId, value);
  }
  #triggerId = /* @__PURE__ */ user_derived(() => this.triggerNode?.id);
  get triggerId() {
    return get(this.#triggerId);
  }
  set triggerId(value) {
    set(this.#triggerId, value);
  }
  contentChildren = box(void 0);
  contentChild = box(void 0);
  contentProps = box({});
  domContext;
  constructor(opts, listContext) {
    this.opts = opts;
    this.listContext = listContext;
    this.domContext = new DOMContext(opts.ref);
    this.attachment = attachRef(this.opts.ref);
  }
  #handleContentEntry = (side = "start") => {
    if (!this.contentNode) return;
    this.restoreContentTabOrder();
    const candidates = getTabbableCandidates(this.contentNode);
    if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse(), () => this.domContext.getActiveElement());
  };
  #handleContentExit = () => {
    if (!this.contentNode) return;
    const candidates = getTabbableCandidates(this.contentNode);
    if (candidates.length) this.restoreContentTabOrder = removeFromTabOrder(candidates);
  };
  onEntryKeydown = this.#handleContentEntry;
  onFocusProxyEnter = this.#handleContentEntry;
  onRootContentClose = this.#handleContentExit;
  onContentFocusOutside = this.#handleContentExit;
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    [navigationMenuAttrs.item]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuTriggerState {
  static create(opts) {
    return new NavigationMenuTriggerState(opts, {
      provider: NavigationMenuProviderContext.get(),
      item: NavigationMenuItemContext.get(),
      list: NavigationMenuListContext.get(),
      sub: NavigationMenuSubContext.getOr(null)
    });
  }
  opts;
  attachment;
  focusProxyId = box(useId());
  focusProxyRef = box(null);
  focusProxyAttachment = attachRef(this.focusProxyRef, (v) => this.itemContext.focusProxyNode = v);
  context;
  itemContext;
  listContext;
  hasPointerMoveOpened = box(false);
  wasClickClose = false;
  #focusProxyMounted = /* @__PURE__ */ state(false);
  get focusProxyMounted() {
    return get(this.#focusProxyMounted);
  }
  set focusProxyMounted(value) {
    set(this.#focusProxyMounted, value, true);
  }
  #open = /* @__PURE__ */ user_derived(() => this.itemContext.opts.value.current === this.context.opts.value.current);
  get open() {
    return get(this.#open);
  }
  set open(value) {
    set(this.#open, value);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.attachment = attachRef(this.opts.ref, (v) => this.itemContext.triggerNode = v);
    this.hasPointerMoveOpened = boxAutoReset(false, { afterMs: 300, getWindow: () => getWindow(opts.ref.current) });
    this.context = context.provider;
    this.itemContext = context.item;
    this.listContext = context.list;
    watch(() => this.opts.ref.current, () => {
      const node = this.opts.ref.current;
      if (!node) return;
      return this.listContext.registerTrigger(node);
    });
  }
  onpointerenter = (_) => {
    this.wasClickClose = false;
    this.itemContext.wasEscapeClose = false;
  };
  onpointermove = whenMouse(() => {
    if (this.opts.disabled.current || this.wasClickClose || this.itemContext.wasEscapeClose || this.hasPointerMoveOpened.current || !this.itemContext.opts.openOnHover.current) {
      return;
    }
    this.context.onTriggerEnter(this.itemContext.opts.value.current, this.itemContext);
    this.hasPointerMoveOpened.current = true;
  });
  onpointerleave = whenMouse(() => {
    if (this.opts.disabled.current || !this.itemContext.opts.openOnHover.current) return;
    this.context.onTriggerLeave();
    this.hasPointerMoveOpened.current = false;
  });
  onclick = () => {
    if (this.hasPointerMoveOpened.current) return;
    const shouldClose = this.open && (!this.itemContext.opts.openOnHover.current || this.context.opts.isRootMenu);
    if (shouldClose) {
      this.context.onItemSelect("", null);
    } else if (!this.open) {
      this.context.onItemSelect(this.itemContext.opts.value.current, this.itemContext);
    }
    this.wasClickClose = shouldClose;
  };
  onkeydown = (e) => {
    const verticalEntryKey = this.context.opts.dir.current === "rtl" ? ARROW_LEFT : ARROW_RIGHT;
    const entryKey = { horizontal: ARROW_DOWN, vertical: verticalEntryKey }[this.context.opts.orientation.current];
    if (this.open && e.key === entryKey) {
      this.itemContext.onEntryKeydown();
      e.preventDefault();
      return;
    }
    this.itemContext.listContext.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
  };
  focusProxyOnFocus = (e) => {
    const content = this.itemContext.contentNode;
    const prevFocusedElement = e.relatedTarget;
    const wasTriggerFocused = this.opts.ref.current && prevFocusedElement === this.opts.ref.current;
    const wasFocusFromContent = content?.contains(prevFocusedElement);
    if (wasTriggerFocused || !wasFocusFromContent) {
      this.itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
    }
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    disabled: this.opts.disabled.current,
    "data-disabled": getDataDisabled(Boolean(this.opts.disabled.current)),
    "data-state": getDataOpenClosed(this.open),
    "data-value": this.itemContext.opts.value.current,
    "aria-expanded": getAriaExpanded(this.open),
    "aria-controls": this.itemContext.contentId,
    [navigationMenuAttrs.trigger]: "",
    onpointermove: this.onpointermove,
    onpointerleave: this.onpointerleave,
    onpointerenter: this.onpointerenter,
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
  #focusProxyProps = /* @__PURE__ */ user_derived(() => ({
    id: this.focusProxyId.current,
    tabindex: 0,
    onfocus: this.focusProxyOnFocus,
    ...this.focusProxyAttachment
  }));
  get focusProxyProps() {
    return get(this.#focusProxyProps);
  }
  set focusProxyProps(value) {
    set(this.#focusProxyProps, value);
  }
}
const LINK_SELECT_EVENT = new CustomEventDispatcher("bitsLinkSelect", { bubbles: true, cancelable: true });
const ROOT_CONTENT_DISMISS_EVENT = new CustomEventDispatcher("bitsRootContentDismiss", { cancelable: true, bubbles: true });
class NavigationMenuLinkState {
  static create(opts) {
    return new NavigationMenuLinkState(opts, {
      provider: NavigationMenuProviderContext.get(),
      item: NavigationMenuItemContext.get()
    });
  }
  opts;
  context;
  attachment;
  #isFocused = /* @__PURE__ */ state(false);
  get isFocused() {
    return get(this.#isFocused);
  }
  set isFocused(value) {
    set(this.#isFocused, value, true);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.context = context;
    this.attachment = attachRef(this.opts.ref);
  }
  onclick = (e) => {
    const currTarget = e.currentTarget;
    LINK_SELECT_EVENT.listen(currTarget, (e2) => this.opts.onSelect.current(e2), { once: true });
    const linkSelectEvent = LINK_SELECT_EVENT.dispatch(currTarget);
    if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
      ROOT_CONTENT_DISMISS_EVENT.dispatch(currTarget);
    }
  };
  onkeydown = (e) => {
    if (this.context.item.contentNode) return;
    this.context.item.listContext.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
  };
  onfocus = (_) => {
    this.isFocused = true;
  };
  onblur = (_) => {
    this.isFocused = false;
  };
  #handlePointerDismiss = () => {
    const currentlyOpenValue = this.context.provider.opts.value.current;
    const isInsideOpenSubmenu = this.context.item.opts.value.current === currentlyOpenValue;
    const activeItem = this.context.item.listContext.context.activeItem;
    if (activeItem && !activeItem.opts.openOnHover.current) return;
    if (currentlyOpenValue && !isInsideOpenSubmenu) {
      this.context.provider.onItemDismiss();
    }
  };
  onpointerenter = () => {
    this.#handlePointerDismiss();
  };
  onpointermove = whenMouse(() => {
    this.#handlePointerDismiss();
  });
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-active": this.opts.active.current ? "" : void 0,
    "aria-current": this.opts.active.current ? "page" : void 0,
    "data-focused": this.isFocused ? "" : void 0,
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    onfocus: this.onfocus,
    onblur: this.onblur,
    onpointerenter: this.onpointerenter,
    onpointermove: this.onpointermove,
    [navigationMenuAttrs.link]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuIndicatorState {
  static create() {
    return new NavigationMenuIndicatorState(NavigationMenuProviderContext.get());
  }
  context;
  #isVisible = /* @__PURE__ */ user_derived(() => Boolean(this.context.opts.value.current));
  get isVisible() {
    return get(this.#isVisible);
  }
  set isVisible(value) {
    set(this.#isVisible, value);
  }
  constructor(context) {
    this.context = context;
  }
}
class NavigationMenuIndicatorImplState {
  static create(opts) {
    return new NavigationMenuIndicatorImplState(opts, {
      provider: NavigationMenuProviderContext.get(),
      list: NavigationMenuListContext.get()
    });
  }
  opts;
  attachment;
  context;
  listContext;
  #position = /* @__PURE__ */ state(null);
  get position() {
    return get(this.#position);
  }
  set position(value) {
    set(this.#position, value);
  }
  #isHorizontal = /* @__PURE__ */ user_derived(() => this.context.opts.orientation.current === "horizontal");
  get isHorizontal() {
    return get(this.#isHorizontal);
  }
  set isHorizontal(value) {
    set(this.#isHorizontal, value);
  }
  #isVisible = /* @__PURE__ */ user_derived(() => !!this.context.opts.value.current);
  get isVisible() {
    return get(this.#isVisible);
  }
  set isVisible(value) {
    set(this.#isVisible, value);
  }
  #activeTrigger = /* @__PURE__ */ user_derived(() => {
    const items = this.listContext.listTriggers;
    const triggerNode = items.find((item) => item.getAttribute("data-value") === this.context.opts.value.current);
    return triggerNode ?? null;
  });
  get activeTrigger() {
    return get(this.#activeTrigger);
  }
  set activeTrigger(value) {
    set(this.#activeTrigger, value);
  }
  #shouldRender = /* @__PURE__ */ user_derived(() => this.position !== null);
  get shouldRender() {
    return get(this.#shouldRender);
  }
  set shouldRender(value) {
    set(this.#shouldRender, value);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.context = context.provider;
    this.listContext = context.list;
    this.attachment = attachRef(this.opts.ref);
    new SvelteResizeObserver(() => this.activeTrigger, this.handlePositionChange);
    new SvelteResizeObserver(() => this.context.indicatorTrackRef.current, this.handlePositionChange);
  }
  handlePositionChange = () => {
    if (!this.activeTrigger) return;
    this.position = {
      size: this.isHorizontal ? this.activeTrigger.offsetWidth : this.activeTrigger.offsetHeight,
      offset: this.isHorizontal ? this.activeTrigger.offsetLeft : this.activeTrigger.offsetTop
    };
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-state": this.isVisible ? "visible" : "hidden",
    "data-orientation": getDataOrientation(this.context.opts.orientation.current),
    style: {
      position: "absolute",
      ...this.isHorizontal ? {
        left: 0,
        width: `${this.position?.size}px`,
        transform: `translateX(${this.position?.offset}px)`
      } : {
        top: 0,
        height: `${this.position?.size}px`,
        transform: `translateY(${this.position?.offset}px)`
      }
    },
    [navigationMenuAttrs.indicator]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuContentState {
  static create(opts) {
    return NavigationMenuContentContext.set(new NavigationMenuContentState(opts, {
      provider: NavigationMenuProviderContext.get(),
      item: NavigationMenuItemContext.get(),
      list: NavigationMenuListContext.get()
    }));
  }
  opts;
  context;
  itemContext;
  listContext;
  attachment;
  #mounted = /* @__PURE__ */ state(false);
  get mounted() {
    return get(this.#mounted);
  }
  set mounted(value) {
    set(this.#mounted, value, true);
  }
  #open = /* @__PURE__ */ user_derived(() => this.itemContext.opts.value.current === this.context.opts.value.current);
  get open() {
    return get(this.#open);
  }
  set open(value) {
    set(this.#open, value);
  }
  #value = /* @__PURE__ */ user_derived(() => this.itemContext.opts.value.current);
  get value() {
    return get(this.#value);
  }
  set value(value) {
    set(this.#value, value);
  }
  #isLastActiveValue = /* @__PURE__ */ user_derived(() => {
    if (this.context.viewportRef.current) {
      if (!this.context.opts.value.current && this.context.opts.previousValue.current) {
        return this.context.opts.previousValue.current === this.itemContext.opts.value.current;
      }
    }
    return false;
  });
  get isLastActiveValue() {
    return get(this.#isLastActiveValue);
  }
  set isLastActiveValue(value) {
    set(this.#isLastActiveValue, value);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.context = context.provider;
    this.itemContext = context.item;
    this.listContext = context.list;
    this.attachment = attachRef(this.opts.ref, (v) => this.itemContext.contentNode = v);
  }
  onpointerenter = (_) => {
    this.context.onContentEnter();
  };
  onpointerleave = whenMouse(() => {
    if (!this.itemContext.opts.openOnHover.current) return;
    this.context.onContentLeave();
  });
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    onpointerenter: this.onpointerenter,
    onpointerleave: this.onpointerleave,
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuContentImplState {
  static create(opts, itemState) {
    return new NavigationMenuContentImplState(opts, itemState ?? NavigationMenuItemContext.get());
  }
  opts;
  itemContext;
  context;
  listContext;
  attachment;
  #prevMotionAttribute = /* @__PURE__ */ state(null);
  get prevMotionAttribute() {
    return get(this.#prevMotionAttribute);
  }
  set prevMotionAttribute(value) {
    set(this.#prevMotionAttribute, value, true);
  }
  #motionAttribute = /* @__PURE__ */ user_derived(() => {
    const items = this.listContext.listTriggers;
    const values = items.map((item) => item.getAttribute("data-value")).filter(Boolean);
    if (this.context.opts.dir.current === "rtl") values.reverse();
    const index = values.indexOf(this.context.opts.value.current);
    const prevIndex = values.indexOf(this.context.opts.previousValue.current);
    const isSelected = this.itemContext.opts.value.current === this.context.opts.value.current;
    const wasSelected = prevIndex === values.indexOf(this.itemContext.opts.value.current);
    if (!this.context.opts.value.current && !this.context.opts.previousValue.current) {
      untrack$1(() => this.prevMotionAttribute = null);
      return null;
    }
    if (!isSelected && !wasSelected) return untrack$1(() => this.prevMotionAttribute);
    const attribute = (() => {
      if (index !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index > prevIndex ? "from-end" : "from-start";
        if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
      }
      return null;
    })();
    untrack$1(() => this.prevMotionAttribute = attribute);
    return attribute;
  });
  get motionAttribute() {
    return get(this.#motionAttribute);
  }
  set motionAttribute(value) {
    set(this.#motionAttribute, value);
  }
  domContext;
  constructor(opts, itemContext) {
    this.opts = opts;
    this.attachment = attachRef(this.opts.ref);
    this.itemContext = itemContext;
    this.listContext = itemContext.listContext;
    this.context = itemContext.listContext.context;
    this.domContext = new DOMContext(opts.ref);
    watch(
      [
        () => this.itemContext.opts.value.current,
        () => this.itemContext.triggerNode,
        () => this.opts.ref.current
      ],
      () => {
        const content = this.opts.ref.current;
        if (!(content && this.context.opts.isRootMenu)) return;
        const handleClose = () => {
          this.context.onItemDismiss();
          this.itemContext.onRootContentClose();
          if (content.contains(this.domContext.getActiveElement())) {
            this.itemContext.triggerNode?.focus();
          }
        };
        const removeListener = ROOT_CONTENT_DISMISS_EVENT.listen(content, handleClose);
        return () => {
          removeListener();
        };
      }
    );
  }
  onFocusOutside = (e) => {
    this.itemContext.onContentFocusOutside();
    const target = e.target;
    if (this.context.opts.rootNavigationMenuRef.current?.contains(target)) {
      e.preventDefault();
      return;
    }
    this.context.onItemDismiss();
  };
  onInteractOutside = (e) => {
    const target = e.target;
    const isTrigger = this.listContext.listTriggers.some((trigger) => trigger.contains(target));
    const isRootViewport = this.context.opts.isRootMenu && this.context.viewportRef.current?.contains(target);
    if (!this.context.opts.isRootMenu && !isTrigger) {
      this.context.onItemDismiss();
      return;
    }
    if (isTrigger || isRootViewport) {
      e.preventDefault();
      return;
    }
    if (!this.itemContext.opts.openOnHover.current) {
      this.context.onItemSelect("", null);
    }
  };
  onkeydown = (e) => {
    const target = e.target;
    if (!isElement(target)) return;
    if (target.closest(navigationMenuAttrs.selector("menu")) !== this.context.opts.rootNavigationMenuRef.current) return;
    const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
    const isTabKey = e.key === TAB && !isMetaKey;
    const candidates = getTabbableCandidates(e.currentTarget);
    if (isTabKey) {
      const focusedElement = this.domContext.getActiveElement();
      const index = candidates.findIndex((candidate) => candidate === focusedElement);
      const isMovingBackwards = e.shiftKey;
      const nextCandidates = isMovingBackwards ? candidates.slice(0, index).reverse() : candidates.slice(index + 1, candidates.length);
      if (focusFirst(nextCandidates, () => this.domContext.getActiveElement())) {
        e.preventDefault();
        return;
      } else {
        handleProxyFocus(this.itemContext.focusProxyNode);
        return;
      }
    }
    let activeEl = this.domContext.getActiveElement();
    if (this.itemContext.contentNode) {
      const focusedNode = this.itemContext.contentNode.querySelector("[data-focused]");
      if (focusedNode) {
        activeEl = focusedNode;
      }
    }
    if (activeEl === this.itemContext.triggerNode) return;
    const newSelectedElement = useArrowNavigation(e, activeEl, void 0, {
      itemsArray: candidates,
      candidateSelector: navigationMenuAttrs.selector("link"),
      loop: false
    });
    newSelectedElement?.focus();
  };
  onEscapeKeydown = (_) => {
    this.context.onItemDismiss();
    this.itemContext.triggerNode?.focus();
    this.itemContext.wasEscapeClose = true;
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "aria-labelledby": this.itemContext.triggerId,
    "data-motion": this.motionAttribute ?? void 0,
    "data-orientation": getDataOrientation(this.context.opts.orientation.current),
    "data-state": getDataOpenClosed(this.context.opts.value.current === this.itemContext.opts.value.current),
    onkeydown: this.onkeydown,
    [navigationMenuAttrs.content]: "",
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class NavigationMenuViewportState {
  static create(opts) {
    return new NavigationMenuViewportState(opts, NavigationMenuProviderContext.get());
  }
  opts;
  context;
  attachment;
  #open = /* @__PURE__ */ user_derived(() => !!this.context.opts.value.current);
  get open() {
    return get(this.#open);
  }
  set open(value) {
    set(this.#open, value);
  }
  #viewportWidth = /* @__PURE__ */ user_derived(() => this.size ? `${this.size.width}px` : void 0);
  get viewportWidth() {
    return get(this.#viewportWidth);
  }
  set viewportWidth(value) {
    set(this.#viewportWidth, value);
  }
  #viewportHeight = /* @__PURE__ */ user_derived(() => this.size ? `${this.size.height}px` : void 0);
  get viewportHeight() {
    return get(this.#viewportHeight);
  }
  set viewportHeight(value) {
    set(this.#viewportHeight, value);
  }
  #activeContentValue = /* @__PURE__ */ user_derived(() => this.context.opts.value.current);
  get activeContentValue() {
    return get(this.#activeContentValue);
  }
  set activeContentValue(value) {
    set(this.#activeContentValue, value);
  }
  #size = /* @__PURE__ */ state(null);
  get size() {
    return get(this.#size);
  }
  set size(value) {
    set(this.#size, value, true);
  }
  #contentNode = /* @__PURE__ */ state(null);
  get contentNode() {
    return get(this.#contentNode);
  }
  set contentNode(value) {
    set(this.#contentNode, value, true);
  }
  #mounted = /* @__PURE__ */ state(false);
  get mounted() {
    return get(this.#mounted);
  }
  set mounted(value) {
    set(this.#mounted, value, true);
  }
  constructor(opts, context) {
    this.opts = opts;
    this.context = context;
    this.attachment = attachRef(this.opts.ref, (v) => this.context.viewportRef.current = v);
    watch([() => this.activeContentValue, () => this.open], () => {
      afterTick(() => {
        const currNode = this.context.viewportRef.current;
        if (!currNode) return;
        const el = currNode.querySelector("[data-state=open]")?.children?.[0] ?? null;
        this.contentNode = el;
      });
    });
    new SvelteResizeObserver(() => this.contentNode, () => {
      if (this.contentNode) {
        this.size = {
          width: this.contentNode.offsetWidth,
          height: this.contentNode.offsetHeight
        };
      }
    });
    watch(() => this.mounted, () => {
      if (!this.mounted && this.size) {
        this.size = null;
      }
    });
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-state": getDataOpenClosed(this.open),
    "data-orientation": getDataOrientation(this.context.opts.orientation.current),
    style: {
      pointerEvents: !this.open && this.context.opts.isRootMenu ? "none" : void 0,
      "--bits-navigation-menu-viewport-width": this.viewportWidth,
      "--bits-navigation-menu-viewport-height": this.viewportHeight
    },
    [navigationMenuAttrs.viewport]: "",
    onpointerenter: this.context.onContentEnter,
    onpointerleave: this.context.onContentLeave,
    ...this.attachment
  }));
  get props() {
    return get(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
function focusFirst(candidates, getActiveElement2) {
  const previouslyFocusedElement = getActiveElement2();
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return getActiveElement2() !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function whenMouse(handler) {
  return (e) => e.pointerType === "mouse" ? handler(e) : void 0;
}
function handleProxyFocus(guard, focusOptions) {
  if (!guard) return;
  const ariaHidden = guard.getAttribute("aria-hidden");
  guard.removeAttribute("aria-hidden");
  guard.focus(focusOptions);
  afterSleep(0, () => {
    if (ariaHidden === null) {
      guard.setAttribute("aria-hidden", "");
    } else {
      guard.setAttribute("aria-hidden", ariaHidden);
    }
  });
}
var root_2$8 = /* @__PURE__ */ from_html(`<nav><!></nav>`);
function Navigation_menu($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), value = prop($$props, "value", 15, ""), onValueChange = prop($$props, "onValueChange", 3, noop), delayDuration = prop($$props, "delayDuration", 3, 200), skipDelayDuration = prop($$props, "skipDelayDuration", 3, 300), dir = prop($$props, "dir", 3, "ltr"), orientation = prop($$props, "orientation", 3, "horizontal"), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "child",
    "children",
    "id",
    "ref",
    "value",
    "onValueChange",
    "delayDuration",
    "skipDelayDuration",
    "dir",
    "orientation"
  ]);
  const rootState = NavigationMenuRootState.create({
    id: box.with(() => id()),
    value: box.with(() => value(), (v) => {
      value(v);
      onValueChange()(v);
    }),
    delayDuration: box.with(() => delayDuration()),
    skipDelayDuration: box.with(() => skipDelayDuration()),
    dir: box.with(() => dir()),
    orientation: box.with(() => orientation()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps({ "aria-label": "main" }, restProps, rootState.props));
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
      var nav = root_2$8();
      attribute_effect(nav, () => ({ ...get(mergedProps) }));
      var node_2 = child(nav);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, nav);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_4$1 = /* @__PURE__ */ from_html(`<div><!></div>`);
function Navigation_menu_content_impl($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let ref = prop($$props, "ref", 15, null), id = prop($$props, "id", 19, () => createId(uid)), onInteractOutside = prop($$props, "onInteractOutside", 3, noop), onFocusOutside = prop($$props, "onFocusOutside", 3, noop), onEscapeKeydown = prop($$props, "onEscapeKeydown", 3, noop), escapeKeydownBehavior = prop($$props, "escapeKeydownBehavior", 3, "close"), interactOutsideBehavior = prop($$props, "interactOutsideBehavior", 3, "close"), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "ref",
    "id",
    "child",
    "children",
    "onInteractOutside",
    "onFocusOutside",
    "onEscapeKeydown",
    "escapeKeydownBehavior",
    "interactOutsideBehavior",
    "itemState",
    "onRefChange"
  ]);
  const contentImplState = NavigationMenuContentImplState.create(
    {
      id: box.with(() => id()),
      ref: box.with(() => ref(), (v) => {
        ref(v);
        untrack$1(() => $$props.onRefChange?.(v));
      })
    },
    $$props.itemState
  );
  if ($$props.itemState) {
    NavigationMenuItemContext.set($$props.itemState);
  }
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, contentImplState.props));
  {
    const children = ($$anchor2, $$arg0) => {
      let dismissibleProps = () => $$arg0?.().props;
      Escape_layer($$anchor2, {
        enabled: true,
        get ref() {
          return contentImplState.opts.ref;
        },
        onEscapeKeydown: (e) => {
          onEscapeKeydown()(e);
          if (e.defaultPrevented) return;
          contentImplState.onEscapeKeydown(e);
        },
        get escapeKeydownBehavior() {
          return escapeKeydownBehavior();
        },
        children: ($$anchor3, $$slotProps) => {
          const finalProps = /* @__PURE__ */ user_derived(() => mergeProps(get(mergedProps), dismissibleProps()));
          var fragment_2 = comment();
          var node = first_child(fragment_2);
          {
            var consequent = ($$anchor4) => {
              var fragment_3 = comment();
              var node_1 = first_child(fragment_3);
              snippet(node_1, () => $$props.child, () => ({ props: get(finalProps) }));
              append($$anchor4, fragment_3);
            };
            var alternate = ($$anchor4) => {
              var div = root_4$1();
              attribute_effect(div, () => ({ ...get(finalProps) }));
              var node_2 = child(div);
              snippet(node_2, () => $$props.children ?? noop$1);
              append($$anchor4, div);
            };
            if_block(node, ($$render) => {
              if ($$props.child) $$render(consequent);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, fragment_2);
        },
        $$slots: { default: true }
      });
    };
    Dismissible_layer($$anchor, {
      get id() {
        return id();
      },
      get ref() {
        return contentImplState.opts.ref;
      },
      enabled: true,
      onInteractOutside: (e) => {
        onInteractOutside()(e);
        if (e.defaultPrevented) return;
        contentImplState.onInteractOutside(e);
      },
      onFocusOutside: (e) => {
        onFocusOutside()(e);
        if (e.defaultPrevented) return;
        contentImplState.onFocusOutside(e);
      },
      get interactOutsideBehavior() {
        return interactOutsideBehavior();
      },
      children,
      $$slots: { default: true }
    });
  }
  pop();
}
var root_2$7 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
function Navigation_menu_content($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let ref = prop($$props, "ref", 15, null), id = prop($$props, "id", 19, () => createId(uid)), forceMount = prop($$props, "forceMount", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "ref",
    "id",
    "children",
    "child",
    "forceMount"
  ]);
  const contentState = NavigationMenuContentState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, contentState.props));
  {
    let $0 = /* @__PURE__ */ user_derived(() => contentState.context.viewportRef.current || void 0);
    let $1 = /* @__PURE__ */ user_derived(() => !contentState.context.viewportRef.current);
    Portal($$anchor, {
      get to() {
        return get($0);
      },
      get disabled() {
        return get($1);
      },
      children: ($$anchor2, $$slotProps) => {
        {
          const presence = ($$anchor3) => {
            var fragment_2 = root_2$7();
            var node = first_child(fragment_2);
            Navigation_menu_content_impl(node, spread_props(() => get(mergedProps), {
              get children() {
                return $$props.children;
              },
              get child() {
                return $$props.child;
              }
            }));
            var node_1 = sibling(node, 2);
            Mounted(node_1, {
              get mounted() {
                return contentState.mounted;
              },
              set mounted($$value) {
                contentState.mounted = $$value;
              }
            });
            append($$anchor3, fragment_2);
          };
          let $02 = /* @__PURE__ */ user_derived(() => forceMount() || contentState.open || contentState.isLastActiveValue);
          Presence_layer($$anchor2, {
            get open() {
              return get($02);
            },
            get ref() {
              return contentState.opts.ref;
            },
            presence,
            $$slots: { presence: true }
          });
        }
      },
      $$slots: { default: true }
    });
  }
  pop();
}
var root_2$6 = /* @__PURE__ */ from_html(`<div><!></div>`);
function Navigation_menu_indicator_impl($$anchor, $$props) {
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
  const indicatorState = NavigationMenuIndicatorImplState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, indicatorState.props));
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
      var div = root_2$6();
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
function Navigation_menu_indicator($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), forceMount = prop($$props, "forceMount", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "children",
    "child",
    "forceMount"
  ]);
  const indicatorState = NavigationMenuIndicatorState.create();
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      Portal($$anchor2, {
        get to() {
          return indicatorState.context.indicatorTrackRef.current;
        },
        children: ($$anchor3, $$slotProps) => {
          {
            const presence = ($$anchor4) => {
              Navigation_menu_indicator_impl($$anchor4, spread_props(() => get(mergedProps), {
                get children() {
                  return $$props.children;
                },
                get child() {
                  return $$props.child;
                },
                get id() {
                  return id();
                },
                get ref() {
                  return ref();
                },
                set ref($$value) {
                  ref($$value);
                }
              }));
            };
            let $0 = /* @__PURE__ */ user_derived(() => forceMount() || indicatorState.isVisible);
            let $1 = /* @__PURE__ */ user_derived(() => box.with(() => ref()));
            Presence_layer($$anchor3, {
              get open() {
                return get($0);
              },
              get ref() {
                return get($1);
              },
              presence,
              $$slots: { presence: true }
            });
          }
        },
        $$slots: { default: true }
      });
    };
    if_block(node, ($$render) => {
      if (indicatorState.context.indicatorTrackRef.current) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$5 = /* @__PURE__ */ from_html(`<li><!></li>`);
function Navigation_menu_item($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  const defaultId = createId(uid);
  let id = prop($$props, "id", 3, defaultId), value = prop($$props, "value", 3, defaultId), ref = prop($$props, "ref", 15, null), openOnHover = prop($$props, "openOnHover", 3, true), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "value",
    "ref",
    "child",
    "children",
    "openOnHover"
  ]);
  const itemState = NavigationMenuItemState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v)),
    value: box.with(() => value()),
    openOnHover: box.with(() => openOnHover())
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, itemState.props));
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
      var li = root_2$5();
      attribute_effect(li, () => ({ ...get(mergedProps) }));
      var node_2 = child(li);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, li);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$4 = /* @__PURE__ */ from_html(`<a><!></a>`);
function Navigation_menu_link($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), active = prop($$props, "active", 3, false), onSelect = prop($$props, "onSelect", 3, noop), tabindex = prop($$props, "tabindex", 3, 0), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "child",
    "children",
    "active",
    "onSelect",
    "tabindex"
  ]);
  const linkState = NavigationMenuLinkState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v)),
    active: box.with(() => active()),
    onSelect: box.with(() => onSelect())
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, linkState.props, { tabindex: tabindex() }));
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
      var a = root_2$4();
      attribute_effect(a, () => ({ ...get(mergedProps) }));
      var node_2 = child(a);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, a);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_1$1 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
var root_2$3 = /* @__PURE__ */ from_html(`<div><ul><!></ul></div> <!>`, 1);
function Navigation_menu_list($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "children",
    "child",
    "ref"
  ]);
  const listState = NavigationMenuListState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, listState.props));
  const wrapperProps = /* @__PURE__ */ user_derived(() => mergeProps(listState.wrapperProps));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_1$1();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps), wrapperProps: get(wrapperProps) }));
      var node_2 = sibling(node_1, 2);
      Mounted(node_2, {
        get mounted() {
          return listState.wrapperMounted;
        },
        set mounted($$value) {
          listState.wrapperMounted = $$value;
        }
      });
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_2$3();
      var div = first_child(fragment_2);
      attribute_effect(div, () => ({ ...get(wrapperProps) }));
      var ul = child(div);
      attribute_effect(ul, () => ({ ...get(mergedProps) }));
      var node_3 = child(ul);
      snippet(node_3, () => $$props.children ?? noop$1);
      var node_4 = sibling(div, 2);
      Mounted(node_4, {
        get mounted() {
          return listState.wrapperMounted;
        },
        set mounted($$value) {
          listState.wrapperMounted = $$value;
        }
      });
      append($$anchor2, fragment_2);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_2$2 = /* @__PURE__ */ from_html(`<span><!></span>`);
function Visually_hidden($$anchor, $$props) {
  push($$props, true);
  let restProps = /* @__PURE__ */ rest_props($$props, ["$$slots", "$$events", "$$legacy", "children", "child"]);
  const style = {
    position: "absolute",
    border: 0,
    width: "1px",
    display: "inline-block",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal"
  };
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, { style }));
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
      var span = root_2$2();
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
var root_2$1 = /* @__PURE__ */ from_html(`<button><!></button>`);
var root_4 = /* @__PURE__ */ from_html(`<span></span>`);
var root_3$1 = /* @__PURE__ */ from_html(`<!> <!> <!>`, 1);
var root = /* @__PURE__ */ from_html(`<!> <!>`, 1);
function Navigation_menu_trigger($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), disabled = prop($$props, "disabled", 3, false), ref = prop($$props, "ref", 15, null), tabindex = prop($$props, "tabindex", 3, 0), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "disabled",
    "children",
    "child",
    "ref",
    "tabindex"
  ]);
  const triggerState = NavigationMenuTriggerState.create({
    id: box.with(() => id()),
    disabled: box.with(() => disabled() ?? false),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, triggerState.props, { tabindex: tabindex() }));
  var fragment = root();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps) }));
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var button = root_2$1();
      attribute_effect(button, () => ({ ...get(mergedProps) }));
      var node_2 = child(button);
      snippet(node_2, () => $$props.children ?? noop$1);
      append($$anchor2, button);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  var node_3 = sibling(node, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment_2 = root_3$1();
      var node_4 = first_child(fragment_2);
      Visually_hidden(node_4, spread_props(() => triggerState.focusProxyProps));
      var node_5 = sibling(node_4, 2);
      Mounted(node_5, {
        get mounted() {
          return triggerState.focusProxyMounted;
        },
        set mounted($$value) {
          triggerState.focusProxyMounted = $$value;
        }
      });
      var node_6 = sibling(node_5, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var span = root_4();
          template_effect(() => set_attribute(span, "aria-owns", triggerState.itemContext.contentId ?? void 0));
          append($$anchor3, span);
        };
        if_block(node_6, ($$render) => {
          if (triggerState.context.viewportRef.current) $$render(consequent_1);
        });
      }
      append($$anchor2, fragment_2);
    };
    if_block(node_3, ($$render) => {
      if (triggerState.open) $$render(consequent_2);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_3 = /* @__PURE__ */ from_html(`<div><!></div>`);
var root_1 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
function Navigation_menu_viewport($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), forceMount = prop($$props, "forceMount", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "ref",
    "forceMount",
    "child",
    "children"
  ]);
  const viewportState = NavigationMenuViewportState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, viewportState.props));
  {
    const presence = ($$anchor2) => {
      var fragment_1 = root_1();
      var node = first_child(fragment_1);
      {
        var consequent = ($$anchor3) => {
          var fragment_2 = comment();
          var node_1 = first_child(fragment_2);
          snippet(node_1, () => $$props.child, () => ({ props: get(mergedProps) }));
          append($$anchor3, fragment_2);
        };
        var alternate = ($$anchor3) => {
          var div = root_3();
          attribute_effect(div, () => ({ ...get(mergedProps) }));
          var node_2 = child(div);
          snippet(node_2, () => $$props.children ?? noop$1);
          append($$anchor3, div);
        };
        if_block(node, ($$render) => {
          if ($$props.child) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      var node_3 = sibling(node, 2);
      Mounted(node_3, {
        get mounted() {
          return viewportState.mounted;
        },
        set mounted($$value) {
          viewportState.mounted = $$value;
        }
      });
      append($$anchor2, fragment_1);
    };
    let $0 = /* @__PURE__ */ user_derived(() => forceMount() || viewportState.open);
    Presence_layer($$anchor, {
      get open() {
        return get($0);
      },
      get ref() {
        return viewportState.opts.ref;
      },
      presence,
      $$slots: { presence: true }
    });
  }
  pop();
}
var root_2 = /* @__PURE__ */ from_html(`<div><!></div>`);
function Navigation_menu_sub($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), value = prop($$props, "value", 15, ""), onValueChange = prop($$props, "onValueChange", 3, noop), orientation = prop($$props, "orientation", 3, "horizontal"), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "child",
    "children",
    "id",
    "ref",
    "value",
    "onValueChange",
    "orientation"
  ]);
  const rootState = NavigationMenuSubState.create({
    id: box.with(() => id()),
    value: box.with(() => value(), (v) => {
      value(v);
      onValueChange()(v);
    }),
    orientation: box.with(() => orientation()),
    ref: box.with(() => ref(), (v) => ref(v))
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
      var div = root_2();
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
function TestNavigationMenuComponent() {
  const refs = [
    Navigation_menu,
    Navigation_menu_content,
    Navigation_menu_indicator,
    Navigation_menu_item,
    Navigation_menu_link,
    Navigation_menu_list,
    Navigation_menu_trigger,
    Navigation_menu_viewport,
    Navigation_menu_sub
  ];
  return refs;
}
const allExports = [
  Navigation_menu,
  Navigation_menu_content,
  Navigation_menu_indicator,
  Navigation_menu_item,
  Navigation_menu_link,
  Navigation_menu_list,
  Navigation_menu_trigger,
  Navigation_menu_viewport,
  Navigation_menu_sub
];
export {
  TestNavigationMenuComponent,
  allExports
};
