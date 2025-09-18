import { tick, untrack as untrack$1, hasContext, getContext, setContext, getAllContexts, mount, unmount, onMount } from "svelte";
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
const BROWSER = true;
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
      get$2(version);
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
    for (const root of root_effects) {
      this.#traverse_effect_tree(root);
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
  #traverse_effect_tree(root) {
    root.f ^= CLEAN;
    var effect2 = root.first;
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
          var v = get$2(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop2, receiver);
      },
      getOwnPropertyDescriptor(target, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s) descriptor.value = get$2(s);
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
          var value2 = get$2(s);
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
        get$2(version);
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
function effect_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT, fn, true);
  return () => {
    destroy_effect(effect2);
  };
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
    create_effect(RENDER_EFFECT, () => fn(...values.map(get$2)), true);
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
function schedule_possible_effect_self_invalidation(signal, effect2, root = true) {
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
      if (root) {
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
function get$2(signal) {
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
// @__NO_SIDE_EFFECTS__
function from_namespace(content, flags, ns = "svg") {
  var has_start = !content.startsWith("<!>");
  var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
  var node;
  return () => {
    if (!node) {
      var fragment = (
        /** @type {DocumentFragment} */
        create_fragment_from_html(wrapped)
      );
      var root = (
        /** @type {Element} */
        /* @__PURE__ */ get_first_child(fragment)
      );
      {
        node = /** @type {Element} */
        /* @__PURE__ */ get_first_child(root);
      }
    }
    var clone = (
      /** @type {TemplateNode} */
      node.cloneNode(true)
    );
    {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
// @__NO_SIDE_EFFECTS__
function from_svg(content, flags) {
  return /* @__PURE__ */ from_namespace(content, flags, "svg");
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
      var next = fn(...values.map(get$2));
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
  if (bindable) get$2(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return (
    /** @type {() => V} */
    (function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get$2(d) : bindable ? proxy(value) : value;
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
      return get$2(d);
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
      return get$2(current);
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
        return get$2(derived2);
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
        get$2(this.#version);
        return false;
      }
    }
    get$2(s);
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
        get$2(this.#version);
        return void 0;
      }
    }
    get$2(s);
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
    get$2(this.#version);
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
      get$2(s);
    }
  }
  keys() {
    get$2(this.#version);
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
    get$2(this.#size);
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
function isHTMLElement$2(node) {
  return isObject(node) && node.nodeType === ELEMENT_NODE && typeof node.nodeName === "string";
}
function isDocument(node) {
  return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
  return isObject(node) && node.constructor?.name === "VisualViewport";
}
function isNode$1(node) {
  return isObject(node) && node.nodeType !== void 0;
}
function isShadowRoot$1(node) {
  return isNode$1(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in node;
}
function contains(parent, child2) {
  if (!parent || !child2)
    return false;
  if (!isHTMLElement$2(parent) || !isHTMLElement$2(child2))
    return false;
  const rootNode = child2.getRootNode?.();
  if (parent === child2)
    return true;
  if (parent.contains(child2))
    return true;
  if (rootNode && isShadowRoot$1(rootNode)) {
    let next = child2;
    while (next) {
      if (parent === next)
        return true;
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getDocument(node) {
  if (isDocument(node))
    return node;
  if (isWindow(node))
    return node.document;
  return node?.ownerDocument ?? document;
}
function getWindow$1(node) {
  if (isShadowRoot$1(node))
    return getWindow$1(node.host);
  if (isDocument(node))
    return node.defaultView ?? window;
  if (isHTMLElement$2(node))
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
    return get$2(this.#root);
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
function get$1(value) {
  if (isFunction(value)) {
    return value();
  }
  return value;
}
class ElementSize {
  // no need to use `$state` here since we are using createSubscriber
  #size = { width: 0, height: 0 };
  #observed = false;
  #options;
  #node;
  #window;
  // we use a derived here to extract the width so that if the width doesn't change we don't get a state update
  // which we would get if we would just use a getter since the version of the subscriber will be changing
  #width = /* @__PURE__ */ user_derived(() => {
    get$2(this.#subscribe)?.();
    return this.getSize().width;
  });
  // we use a derived here to extract the height so that if the height doesn't change we don't get a state update
  // which we would get if we would just use a getter since the version of the subscriber will be changing
  #height = /* @__PURE__ */ user_derived(() => {
    get$2(this.#subscribe)?.();
    return this.getSize().height;
  });
  // we need to use a derived here because the class will be created before the node is bound to the ref
  #subscribe = /* @__PURE__ */ user_derived(() => {
    const node$ = get$1(this.#node);
    if (!node$) return;
    return createSubscriber((update) => {
      if (!this.#window) return;
      const observer = new this.#window.ResizeObserver((entries) => {
        this.#observed = true;
        for (const entry of entries) {
          const boxSize = this.#options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
          const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
          this.#size.width = boxSizeArr.reduce((acc, size2) => Math.max(acc, size2.inlineSize), 0);
          this.#size.height = boxSizeArr.reduce((acc, size2) => Math.max(acc, size2.blockSize), 0);
        }
        update();
      });
      observer.observe(node$);
      return () => {
        this.#observed = false;
        observer.disconnect();
      };
    });
  });
  constructor(node, options = { box: "border-box" }) {
    this.#window = options.window ?? defaultWindow;
    this.#options = options;
    this.#node = node;
    this.#size = { width: 0, height: 0 };
  }
  calculateSize() {
    const element = get$1(this.#node);
    if (!element || !this.#window) {
      return;
    }
    const offsetWidth = element.offsetWidth;
    const offsetHeight = element.offsetHeight;
    if (this.#options.box === "border-box") {
      return { width: offsetWidth, height: offsetHeight };
    }
    const style = this.#window.getComputedStyle(element);
    const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const borderWidth = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const contentWidth = offsetWidth - paddingWidth - borderWidth;
    const contentHeight = offsetHeight - paddingHeight - borderHeight;
    return { width: contentWidth, height: contentHeight };
  }
  getSize() {
    return this.#observed ? this.#size : this.calculateSize() ?? this.#size;
  }
  get current() {
    get$2(this.#subscribe)?.();
    return this.getSize();
  }
  get width() {
    return get$2(this.#width);
  }
  get height() {
    return get$2(this.#height);
  }
}
class Previous {
  #previous = /* @__PURE__ */ state(void 0);
  constructor(getter, initialValue) {
    if (initialValue !== void 0) set(this.#previous, initialValue, true);
    watch(() => getter(), (_, v) => {
      set(this.#previous, v, true);
    });
  }
  get current() {
    return get$2(this.#previous);
  }
}
function getDataDisabled(condition) {
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
const ESCAPE = "Escape";
const isBrowser = typeof document !== "undefined";
const isIOS = getIsIOS();
function getIsIOS() {
  return isBrowser && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
  window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function isHTMLElement$1(element) {
  return element instanceof HTMLElement;
}
function isElement$1(element) {
  return element instanceof Element;
}
function isFocusVisible(element) {
  return element.matches(":focus-visible");
}
function isNotNull(value) {
  return value !== null;
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
    return get$2(this.#prevAnimationNameState);
  }
  set prevAnimationNameState(value) {
    set(this.#prevAnimationNameState, value, true);
  }
  #styles = /* @__PURE__ */ state(proxy({}));
  get styles() {
    return get$2(this.#styles);
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
    return get$2(this.#isPresent);
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
class AnimationsComplete {
  #opts;
  #currentFrame = void 0;
  #isRunning = false;
  constructor(opts) {
    this.#opts = opts;
    onDestroyEffect(() => this.#cleanup());
  }
  #cleanup() {
    if (this.#currentFrame) {
      window.cancelAnimationFrame(this.#currentFrame);
      this.#currentFrame = void 0;
    }
    this.#isRunning = false;
  }
  run(fn) {
    if (this.#isRunning)
      return;
    this.#cleanup();
    this.#isRunning = true;
    const node = this.#opts.ref.current;
    if (!node) {
      this.#isRunning = false;
      return;
    }
    if (typeof node.getAnimations !== "function") {
      this.#executeCallback(fn);
      return;
    }
    this.#currentFrame = window.requestAnimationFrame(() => {
      const animations = node.getAnimations();
      if (animations.length === 0) {
        this.#executeCallback(fn);
        return;
      }
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        this.#executeCallback(fn);
      });
    });
  }
  #executeCallback(fn) {
    const execute = () => {
      fn();
      this.#isRunning = false;
    };
    if (this.#opts.afterTick) {
      afterTick(execute);
    } else {
      execute();
    }
  }
}
class OpenChangeComplete {
  #opts;
  #enabled;
  #afterAnimations;
  constructor(opts) {
    this.#opts = opts;
    this.#enabled = opts.enabled ?? true;
    this.#afterAnimations = new AnimationsComplete({
      ref: this.#opts.ref,
      afterTick: this.#opts.open
    });
    watch([() => this.#opts.open.current], ([open]) => {
      if (!this.#enabled)
        return;
      this.#afterAnimations.run(() => {
        if (open === this.#opts.open.current) {
          this.#opts.onComplete();
        }
      });
    });
  }
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
  watch([() => get$2(target), () => $$props.disabled], ([target2, disabled]) => {
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
  if (!isElement$1(target)) return false;
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
class FocusScopeManager {
  static instance;
  #scopeStack = box([]);
  #focusHistory = /* @__PURE__ */ new WeakMap();
  #preFocusHistory = /* @__PURE__ */ new WeakMap();
  static getInstance() {
    if (!this.instance) {
      this.instance = new FocusScopeManager();
    }
    return this.instance;
  }
  register(scope) {
    const current = this.getActive();
    if (current && current !== scope) {
      current.pause();
    }
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.#preFocusHistory.set(scope, activeElement);
    }
    this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
    this.#scopeStack.current.unshift(scope);
  }
  unregister(scope) {
    this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
    const next = this.getActive();
    if (next) {
      next.resume();
    }
  }
  getActive() {
    return this.#scopeStack.current[0];
  }
  setFocusMemory(scope, element) {
    this.#focusHistory.set(scope, element);
  }
  getFocusMemory(scope) {
    return this.#focusHistory.get(scope);
  }
  isActiveScope(scope) {
    return this.getActive() === scope;
  }
  setPreFocusMemory(scope, element) {
    this.#preFocusHistory.set(scope, element);
  }
  getPreFocusMemory(scope) {
    return this.#preFocusHistory.get(scope);
  }
  clearPreFocusMemory(scope) {
    this.#preFocusHistory.delete(scope);
  }
}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var isInert = function isInert2(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && isInert2(node.parentNode);
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r2 = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child2) {
    return child2.tagName === "SUMMARY";
  });
  return r2;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child2 = parentNode.children.item(i);
          if (child2.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child2.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};
class FocusScope {
  #paused = false;
  #container = null;
  #manager = FocusScopeManager.getInstance();
  #cleanupFns = [];
  #opts;
  constructor(opts) {
    this.#opts = opts;
  }
  get paused() {
    return this.#paused;
  }
  pause() {
    this.#paused = true;
  }
  resume() {
    this.#paused = false;
  }
  #cleanup() {
    for (const fn of this.#cleanupFns) {
      fn();
    }
    this.#cleanupFns = [];
  }
  mount(container) {
    if (this.#container) {
      this.unmount();
    }
    this.#container = container;
    this.#manager.register(this);
    this.#setupEventListeners();
    this.#handleOpenAutoFocus();
  }
  unmount() {
    if (!this.#container) return;
    this.#cleanup();
    this.#handleCloseAutoFocus();
    this.#manager.unregister(this);
    this.#manager.clearPreFocusMemory(this);
    this.#container = null;
  }
  #handleOpenAutoFocus() {
    if (!this.#container) return;
    const event = new CustomEvent("focusScope.onOpenAutoFocus", { bubbles: false, cancelable: true });
    this.#opts.onOpenAutoFocus.current(event);
    if (!event.defaultPrevented) {
      requestAnimationFrame(() => {
        if (!this.#container) return;
        const firstTabbable = this.#getFirstTabbable();
        if (firstTabbable) {
          firstTabbable.focus();
          this.#manager.setFocusMemory(this, firstTabbable);
        } else {
          this.#container.focus();
        }
      });
    }
  }
  #handleCloseAutoFocus() {
    const event = new CustomEvent("focusScope.onCloseAutoFocus", { bubbles: false, cancelable: true });
    this.#opts.onCloseAutoFocus.current?.(event);
    if (!event.defaultPrevented) {
      const preFocusedElement = this.#manager.getPreFocusMemory(this);
      if (preFocusedElement && document.contains(preFocusedElement)) {
        try {
          preFocusedElement.focus();
        } catch {
          document.body.focus();
        }
      }
    }
  }
  #setupEventListeners() {
    if (!this.#container || !this.#opts.trap.current) return;
    const container = this.#container;
    const doc = container.ownerDocument;
    const handleFocus = (e) => {
      if (this.#paused || !this.#manager.isActiveScope(this)) return;
      const target = e.target;
      if (!target) return;
      const isInside = container.contains(target);
      if (isInside) {
        this.#manager.setFocusMemory(this, target);
      } else {
        const lastFocused = this.#manager.getFocusMemory(this);
        if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
          e.preventDefault();
          lastFocused.focus();
        } else {
          const firstTabbable = this.#getFirstTabbable();
          const firstFocusable = this.#getAllFocusables()[0];
          (firstTabbable || firstFocusable || container).focus();
        }
      }
    };
    const handleKeydown = (e) => {
      if (!this.#opts.loop || this.#paused || e.key !== "Tab") return;
      if (!this.#manager.isActiveScope(this)) return;
      const tabbables = this.#getTabbables();
      if (tabbables.length < 2) return;
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };
    this.#cleanupFns.push(on(doc, "focusin", handleFocus, { capture: true }), on(container, "keydown", handleKeydown));
    const observer = new MutationObserver(() => {
      const lastFocused = this.#manager.getFocusMemory(this);
      if (lastFocused && !container.contains(lastFocused)) {
        const firstTabbable = this.#getFirstTabbable();
        const firstFocusable = this.#getAllFocusables()[0];
        const elementToFocus = firstTabbable || firstFocusable;
        if (elementToFocus) {
          elementToFocus.focus();
          this.#manager.setFocusMemory(this, elementToFocus);
        } else {
          container.focus();
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    this.#cleanupFns.push(() => observer.disconnect());
  }
  #getTabbables() {
    if (!this.#container) return [];
    return tabbable(this.#container, { includeContainer: false, getShadowRoot: true });
  }
  #getFirstTabbable() {
    const tabbables = this.#getTabbables();
    return tabbables[0] || null;
  }
  #getAllFocusables() {
    if (!this.#container) return [];
    return focusable(this.#container, { includeContainer: false, getShadowRoot: true });
  }
  static use(opts) {
    let scope = null;
    watch([() => opts.ref.current, () => opts.enabled.current], ([ref, enabled]) => {
      if (ref && enabled) {
        if (!scope) {
          scope = new FocusScope(opts);
        }
        scope.mount(ref);
      } else if (scope) {
        scope.unmount();
        scope = null;
      }
    });
    onDestroyEffect(() => {
      scope?.unmount();
    });
    return {
      get props() {
        return { tabindex: -1 };
      }
    };
  }
}
function Focus_scope($$anchor, $$props) {
  push($$props, true);
  let enabled = prop($$props, "enabled", 3, false), trapFocus = prop($$props, "trapFocus", 3, false), loop = prop($$props, "loop", 3, false), onCloseAutoFocus = prop($$props, "onCloseAutoFocus", 3, noop), onOpenAutoFocus = prop($$props, "onOpenAutoFocus", 3, noop);
  const focusScopeState = FocusScope.use({
    enabled: box.with(() => enabled()),
    trap: box.with(() => trapFocus()),
    loop: loop(),
    onCloseAutoFocus: box.with(() => onCloseAutoFocus()),
    onOpenAutoFocus: box.with(() => onOpenAutoFocus()),
    ref: $$props.ref
  });
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.focusScope ?? noop$1, () => ({ props: focusScopeState.props }));
  append($$anchor, fragment);
  pop();
}
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
class TextSelectionLayerState {
  static create(opts) {
    return new TextSelectionLayerState(opts);
  }
  opts;
  domContext;
  #unsubSelectionLock = noop;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(opts.ref);
    let unsubEvents = noop;
    watch(() => this.opts.enabled.current, (isEnabled) => {
      if (isEnabled) {
        globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
        unsubEvents();
        unsubEvents = this.#addEventListeners();
      }
      return () => {
        unsubEvents();
        this.#resetSelectionLock();
        globalThis.bitsTextSelectionLayers.delete(this);
      };
    });
  }
  #addEventListeners() {
    return executeCallbacks(on(this.domContext.getDocument(), "pointerdown", this.#pointerdown), on(this.domContext.getDocument(), "pointerup", composeHandlers(this.#resetSelectionLock, this.opts.onPointerUp.current)));
  }
  #pointerdown = (e) => {
    const node = this.opts.ref.current;
    const target = e.target;
    if (!isHTMLElement$1(node) || !isHTMLElement$1(target) || !this.opts.enabled.current) return;
    if (!isHighestLayer(this) || !contains(node, target)) return;
    this.opts.onPointerDown.current(e);
    if (e.defaultPrevented) return;
    this.#unsubSelectionLock = preventTextSelectionOverflow(node, this.domContext.getDocument().body);
  };
  #resetSelectionLock = () => {
    this.#unsubSelectionLock();
    this.#unsubSelectionLock = noop;
  };
}
const getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node, body) {
  const originalBodyUserSelect = getUserSelect(body);
  const originalNodeUserSelect = getUserSelect(node);
  setUserSelect(body, "none");
  setUserSelect(node, "text");
  return () => {
    setUserSelect(body, originalBodyUserSelect);
    setUserSelect(node, originalNodeUserSelect);
  };
}
function setUserSelect(node, value) {
  node.style.userSelect = value;
  node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
  const layersArr = [...globalThis.bitsTextSelectionLayers];
  if (!layersArr.length) return false;
  const highestLayer = layersArr.at(-1);
  if (!highestLayer) return false;
  return highestLayer[0] === instance;
}
function Text_selection_layer($$anchor, $$props) {
  push($$props, true);
  let preventOverflowTextSelection = prop($$props, "preventOverflowTextSelection", 3, true), onPointerDown = prop($$props, "onPointerDown", 3, noop), onPointerUp = prop($$props, "onPointerUp", 3, noop);
  TextSelectionLayerState.create({
    id: box.with(() => $$props.id),
    onPointerDown: box.with(() => onPointerDown()),
    onPointerUp: box.with(() => onPointerUp()),
    enabled: box.with(() => $$props.enabled && preventOverflowTextSelection()),
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
class SharedState {
  #factory;
  #subscribers = 0;
  #state = /* @__PURE__ */ state();
  #scope;
  constructor(factory) {
    this.#factory = factory;
  }
  #dispose() {
    this.#subscribers -= 1;
    if (this.#scope && this.#subscribers <= 0) {
      this.#scope();
      set(this.#state, void 0);
      this.#scope = void 0;
    }
  }
  get(...args) {
    this.#subscribers += 1;
    if (get$2(this.#state) === void 0) {
      this.#scope = effect_root(() => {
        set(this.#state, this.#factory(...args), true);
      });
    }
    user_effect(() => {
      return () => {
        this.#dispose();
      };
    });
    return get$2(this.#state);
  }
}
const lockMap = new SvelteMap();
let initialBodyStyle = /* @__PURE__ */ state(null);
let stopTouchMoveListener = null;
let cleanupTimeoutId = null;
let isInCleanupTransition = false;
const anyLocked = box.with(() => {
  for (const value of lockMap.values()) {
    if (value) return true;
  }
  return false;
});
let cleanupScheduledAt = null;
const bodyLockStackCount = new SharedState(() => {
  function resetBodyStyle() {
    document.body.setAttribute("style", get$2(initialBodyStyle) ?? "");
    document.body.style.removeProperty("--scrollbar-width");
    isIOS && stopTouchMoveListener?.();
    set(initialBodyStyle, null);
  }
  function cancelPendingCleanup() {
    if (cleanupTimeoutId === null) return;
    window.clearTimeout(cleanupTimeoutId);
    cleanupTimeoutId = null;
  }
  function scheduleCleanupIfNoNewLocks(delay, callback) {
    cancelPendingCleanup();
    isInCleanupTransition = true;
    cleanupScheduledAt = Date.now();
    const currentCleanupId = cleanupScheduledAt;
    const cleanupFn = () => {
      cleanupTimeoutId = null;
      if (cleanupScheduledAt !== currentCleanupId) return;
      if (!isAnyLocked(lockMap)) {
        isInCleanupTransition = false;
        callback();
      } else {
        isInCleanupTransition = false;
      }
    };
    const actualDelay = delay === null ? 24 : delay;
    cleanupTimeoutId = window.setTimeout(cleanupFn, actualDelay);
  }
  function ensureInitialStyleCaptured() {
    if (get$2(initialBodyStyle) === null && lockMap.size === 0 && !isInCleanupTransition) {
      set(initialBodyStyle, document.body.getAttribute("style"), true);
    }
  }
  watch(() => anyLocked.current, () => {
    if (!anyLocked.current) return;
    ensureInitialStyleCaptured();
    isInCleanupTransition = false;
    const bodyStyle = getComputedStyle(document.body);
    const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const paddingRight = Number.parseInt(bodyStyle.paddingRight ?? "0", 10);
    const config = {
      padding: paddingRight + verticalScrollbarWidth,
      margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10)
    };
    if (verticalScrollbarWidth > 0) {
      document.body.style.paddingRight = `${config.padding}px`;
      document.body.style.marginRight = `${config.margin}px`;
      document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
      document.body.style.overflow = "hidden";
    }
    if (isIOS) {
      stopTouchMoveListener = addEventListener(
        document,
        "touchmove",
        (e) => {
          if (e.target !== document.documentElement) return;
          if (e.touches.length > 1) return;
          e.preventDefault();
        },
        { passive: false }
      );
    }
    afterTick(() => {
      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";
    });
  });
  onDestroyEffect(() => {
    return () => {
      stopTouchMoveListener?.();
    };
  });
  return {
    get lockMap() {
      return lockMap;
    },
    resetBodyStyle,
    scheduleCleanupIfNoNewLocks,
    cancelPendingCleanup,
    ensureInitialStyleCaptured
  };
});
class BodyScrollLock {
  #id = useId();
  #initialState;
  #restoreScrollDelay = () => null;
  #countState;
  locked;
  constructor(initialState, restoreScrollDelay = () => null) {
    this.#initialState = initialState;
    this.#restoreScrollDelay = restoreScrollDelay;
    this.#countState = bodyLockStackCount.get();
    if (!this.#countState) return;
    this.#countState.cancelPendingCleanup();
    this.#countState.ensureInitialStyleCaptured();
    this.#countState.lockMap.set(this.#id, this.#initialState ?? false);
    this.locked = box.with(() => this.#countState.lockMap.get(this.#id) ?? false, (v) => this.#countState.lockMap.set(this.#id, v));
    onDestroyEffect(() => {
      this.#countState.lockMap.delete(this.#id);
      if (isAnyLocked(this.#countState.lockMap)) return;
      const restoreScrollDelay2 = this.#restoreScrollDelay();
      this.#countState.scheduleCleanupIfNoNewLocks(restoreScrollDelay2, () => {
        this.#countState.resetBodyStyle();
      });
    });
  }
}
function isAnyLocked(map) {
  for (const [_, value] of map) {
    if (value) return true;
  }
  return false;
}
function Scroll_lock($$anchor, $$props) {
  push($$props, true);
  let preventScroll = prop($$props, "preventScroll", 3, true), restoreScrollDelay = prop($$props, "restoreScrollDelay", 3, null);
  if (preventScroll()) {
    new BodyScrollLock(preventScroll(), () => restoreScrollDelay());
  }
  pop();
}
const sides = ["top", "right", "bottom", "left"];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state2, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state2;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state2);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state2) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state2;
    const {
      element,
      padding = 0
    } = evaluate(options, state2) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state2) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state2;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state2);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state2) {
      const {
        rects
      } = state2;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state2);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await detectOverflow(state2, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await detectOverflow(state2, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
async function convertValueToCoords(state2, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state2;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state2);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state2) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state2;
      const diffCoords = await convertValueToCoords(state2, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state2) {
      const {
        x,
        y,
        placement
      } = state2;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state2);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state2,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
const limitShift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state2) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state2;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state2);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state2);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
const size$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state2) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state2;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state2);
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state2.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state2.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state2.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state2,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const size = size$1;
const hide = hide$1;
const arrow = arrow$1;
const limitShift = limitShift$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
function get(valueOrGetValue) {
  return typeof valueOrGetValue === "function" ? valueOrGetValue() : valueOrGetValue;
}
function getDPR(element) {
  if (typeof window === "undefined") return 1;
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function getFloatingContentCSSVars(name) {
  return {
    [`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
    [`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
    [`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
    [`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
    [`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`
  };
}
function useFloating(options) {
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = /* @__PURE__ */ user_derived(() => get(options.open) ?? true);
  const middlewareOption = /* @__PURE__ */ user_derived(() => get(options.middleware));
  const transformOption = /* @__PURE__ */ user_derived(() => get(options.transform) ?? true);
  const placementOption = /* @__PURE__ */ user_derived(() => get(options.placement) ?? "bottom");
  const strategyOption = /* @__PURE__ */ user_derived(() => get(options.strategy) ?? "absolute");
  const sideOffsetOption = /* @__PURE__ */ user_derived(() => get(options.sideOffset) ?? 0);
  const alignOffsetOption = /* @__PURE__ */ user_derived(() => get(options.alignOffset) ?? 0);
  const reference = options.reference;
  let x = /* @__PURE__ */ state(0);
  let y = /* @__PURE__ */ state(0);
  const floating = box(null);
  let strategy = /* @__PURE__ */ state(proxy(get$2(strategyOption)));
  let placement = /* @__PURE__ */ state(proxy(get$2(placementOption)));
  let middlewareData = /* @__PURE__ */ state(proxy({}));
  let isPositioned = /* @__PURE__ */ state(false);
  const floatingStyles = /* @__PURE__ */ user_derived(() => {
    const xVal = floating.current ? roundByDPR(floating.current, get$2(x)) : get$2(x);
    const yVal = floating.current ? roundByDPR(floating.current, get$2(y)) : get$2(y);
    if (get$2(transformOption)) {
      return {
        position: get$2(strategy),
        left: "0",
        top: "0",
        transform: `translate(${xVal}px, ${yVal}px)`,
        ...floating.current && getDPR(floating.current) >= 1.5 && { willChange: "transform" }
      };
    }
    return {
      position: get$2(strategy),
      left: `${xVal}px`,
      top: `${yVal}px`
    };
  });
  let whileElementsMountedCleanup;
  function update() {
    if (reference.current === null || floating.current === null) return;
    computePosition(reference.current, floating.current, {
      middleware: get$2(middlewareOption),
      placement: get$2(placementOption),
      strategy: get$2(strategyOption)
    }).then((position) => {
      if (!get$2(openOption) && get$2(x) !== 0 && get$2(y) !== 0) {
        const maxExpectedOffset = Math.max(Math.abs(get$2(sideOffsetOption)), Math.abs(get$2(alignOffsetOption)), 15);
        if (position.x <= maxExpectedOffset && position.y <= maxExpectedOffset) return;
      }
      set(x, position.x, true);
      set(y, position.y, true);
      set(strategy, position.strategy, true);
      set(placement, position.placement, true);
      set(middlewareData, position.middlewareData, true);
      set(isPositioned, true);
    });
  }
  function cleanup() {
    if (typeof whileElementsMountedCleanup === "function") {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = void 0;
    }
  }
  function attach2() {
    cleanup();
    if (whileElementsMountedOption === void 0) {
      update();
      return;
    }
    if (reference.current === null || floating.current === null) return;
    whileElementsMountedCleanup = whileElementsMountedOption(reference.current, floating.current, update);
  }
  function reset() {
    if (!get$2(openOption)) {
      set(isPositioned, false);
    }
  }
  user_effect(update);
  user_effect(attach2);
  user_effect(reset);
  user_effect(() => cleanup);
  return {
    floating,
    reference,
    get strategy() {
      return get$2(strategy);
    },
    get placement() {
      return get$2(placement);
    },
    get middlewareData() {
      return get$2(middlewareData);
    },
    get isPositioned() {
      return get$2(isPositioned);
    },
    get floatingStyles() {
      return get$2(floatingStyles);
    },
    get update() {
      return update;
    }
  };
}
const OPPOSITE_SIDE = { top: "bottom", right: "left", bottom: "top", left: "right" };
const FloatingRootContext = new Context("Floating.Root");
const FloatingContentContext = new Context("Floating.Content");
const FloatingTooltipRootContext = new Context("Floating.Root");
class FloatingRootState {
  static create(tooltip = false) {
    return tooltip ? FloatingTooltipRootContext.set(new FloatingRootState()) : FloatingRootContext.set(new FloatingRootState());
  }
  anchorNode = box(null);
  customAnchorNode = box(null);
  triggerNode = box(null);
  constructor() {
    user_effect(() => {
      if (this.customAnchorNode.current) {
        if (typeof this.customAnchorNode.current === "string") {
          this.anchorNode.current = document.querySelector(this.customAnchorNode.current);
        } else {
          this.anchorNode.current = this.customAnchorNode.current;
        }
      } else {
        this.anchorNode.current = this.triggerNode.current;
      }
    });
  }
}
class FloatingContentState {
  static create(opts, tooltip = false) {
    return tooltip ? FloatingContentContext.set(new FloatingContentState(opts, FloatingTooltipRootContext.get())) : FloatingContentContext.set(new FloatingContentState(opts, FloatingRootContext.get()));
  }
  opts;
  root;
  // nodes
  contentRef = box(null);
  wrapperRef = box(null);
  arrowRef = box(null);
  contentAttachment = attachRef(this.contentRef);
  wrapperAttachment = attachRef(this.wrapperRef);
  arrowAttachment = attachRef(this.arrowRef);
  // ids
  arrowId = box(useId());
  #transformedStyle = /* @__PURE__ */ user_derived(() => {
    if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
    if (!this.opts.style) return {};
  });
  #updatePositionStrategy = void 0;
  #arrowSize = new ElementSize(() => this.arrowRef.current ?? void 0);
  #arrowWidth = /* @__PURE__ */ user_derived(() => this.#arrowSize?.width ?? 0);
  #arrowHeight = /* @__PURE__ */ user_derived(() => this.#arrowSize?.height ?? 0);
  #desiredPlacement = /* @__PURE__ */ user_derived(() => this.opts.side?.current + (this.opts.align.current !== "center" ? `-${this.opts.align.current}` : ""));
  #boundary = /* @__PURE__ */ user_derived(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
  #hasExplicitBoundaries = /* @__PURE__ */ user_derived(() => get$2(this.#boundary).length > 0);
  get hasExplicitBoundaries() {
    return get$2(this.#hasExplicitBoundaries);
  }
  set hasExplicitBoundaries(value) {
    set(this.#hasExplicitBoundaries, value);
  }
  #detectOverflowOptions = /* @__PURE__ */ user_derived(() => ({
    padding: this.opts.collisionPadding.current,
    boundary: get$2(this.#boundary).filter(isNotNull),
    altBoundary: this.hasExplicitBoundaries
  }));
  get detectOverflowOptions() {
    return get$2(this.#detectOverflowOptions);
  }
  set detectOverflowOptions(value) {
    set(this.#detectOverflowOptions, value);
  }
  #availableWidth = /* @__PURE__ */ state(void 0);
  #availableHeight = /* @__PURE__ */ state(void 0);
  #anchorWidth = /* @__PURE__ */ state(void 0);
  #anchorHeight = /* @__PURE__ */ state(void 0);
  #middleware = /* @__PURE__ */ user_derived(() => [
    offset({
      mainAxis: this.opts.sideOffset.current + get$2(this.#arrowHeight),
      alignmentAxis: this.opts.alignOffset.current
    }),
    this.opts.avoidCollisions.current && shift({
      mainAxis: true,
      crossAxis: false,
      limiter: this.opts.sticky.current === "partial" ? limitShift() : void 0,
      ...this.detectOverflowOptions
    }),
    this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
    size({
      ...this.detectOverflowOptions,
      apply: ({ rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference;
        set(this.#availableWidth, availableWidth, true);
        set(this.#availableHeight, availableHeight, true);
        set(this.#anchorWidth, anchorWidth, true);
        set(this.#anchorHeight, anchorHeight, true);
      }
    }),
    this.arrowRef.current && arrow({
      element: this.arrowRef.current,
      padding: this.opts.arrowPadding.current
    }),
    transformOrigin({
      arrowWidth: get$2(this.#arrowWidth),
      arrowHeight: get$2(this.#arrowHeight)
    }),
    this.opts.hideWhenDetached.current && hide({ strategy: "referenceHidden", ...this.detectOverflowOptions })
  ].filter(Boolean));
  get middleware() {
    return get$2(this.#middleware);
  }
  set middleware(value) {
    set(this.#middleware, value);
  }
  floating;
  #placedSide = /* @__PURE__ */ user_derived(() => getSideFromPlacement(this.floating.placement));
  get placedSide() {
    return get$2(this.#placedSide);
  }
  set placedSide(value) {
    set(this.#placedSide, value);
  }
  #placedAlign = /* @__PURE__ */ user_derived(() => getAlignFromPlacement(this.floating.placement));
  get placedAlign() {
    return get$2(this.#placedAlign);
  }
  set placedAlign(value) {
    set(this.#placedAlign, value);
  }
  #arrowX = /* @__PURE__ */ user_derived(() => this.floating.middlewareData.arrow?.x ?? 0);
  get arrowX() {
    return get$2(this.#arrowX);
  }
  set arrowX(value) {
    set(this.#arrowX, value);
  }
  #arrowY = /* @__PURE__ */ user_derived(() => this.floating.middlewareData.arrow?.y ?? 0);
  get arrowY() {
    return get$2(this.#arrowY);
  }
  set arrowY(value) {
    set(this.#arrowY, value);
  }
  #cannotCenterArrow = /* @__PURE__ */ user_derived(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
  get cannotCenterArrow() {
    return get$2(this.#cannotCenterArrow);
  }
  set cannotCenterArrow(value) {
    set(this.#cannotCenterArrow, value);
  }
  #contentZIndex = /* @__PURE__ */ state();
  get contentZIndex() {
    return get$2(this.#contentZIndex);
  }
  set contentZIndex(value) {
    set(this.#contentZIndex, value, true);
  }
  #arrowBaseSide = /* @__PURE__ */ user_derived(() => OPPOSITE_SIDE[this.placedSide]);
  get arrowBaseSide() {
    return get$2(this.#arrowBaseSide);
  }
  set arrowBaseSide(value) {
    set(this.#arrowBaseSide, value);
  }
  #wrapperProps = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.wrapperId.current,
    "data-bits-floating-content-wrapper": "",
    style: {
      ...this.floating.floatingStyles,
      transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
      minWidth: "max-content",
      zIndex: this.contentZIndex,
      "--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
      "--bits-floating-available-width": `${get$2(this.#availableWidth)}px`,
      "--bits-floating-available-height": `${get$2(this.#availableHeight)}px`,
      "--bits-floating-anchor-width": `${get$2(this.#anchorWidth)}px`,
      "--bits-floating-anchor-height": `${get$2(this.#anchorHeight)}px`,
      ...this.floating.middlewareData.hide?.referenceHidden && { visibility: "hidden", "pointer-events": "none" },
      ...get$2(this.#transformedStyle)
    },
    dir: this.opts.dir.current,
    ...this.wrapperAttachment
  }));
  get wrapperProps() {
    return get$2(this.#wrapperProps);
  }
  set wrapperProps(value) {
    set(this.#wrapperProps, value);
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    "data-side": this.placedSide,
    "data-align": this.placedAlign,
    style: styleToString({ ...get$2(this.#transformedStyle) }),
    ...this.contentAttachment
  }));
  get props() {
    return get$2(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
  #arrowStyle = /* @__PURE__ */ user_derived(() => ({
    position: "absolute",
    left: this.arrowX ? `${this.arrowX}px` : void 0,
    top: this.arrowY ? `${this.arrowY}px` : void 0,
    [this.arrowBaseSide]: 0,
    "transform-origin": { top: "", right: "0 0", bottom: "center 0", left: "100% 0" }[this.placedSide],
    transform: {
      top: "translateY(100%)",
      right: "translateY(50%) rotate(90deg) translateX(-50%)",
      bottom: "rotate(180deg)",
      left: "translateY(50%) rotate(-90deg) translateX(50%)"
    }[this.placedSide],
    visibility: this.cannotCenterArrow ? "hidden" : void 0
  }));
  get arrowStyle() {
    return get$2(this.#arrowStyle);
  }
  set arrowStyle(value) {
    set(this.#arrowStyle, value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    if (opts.customAnchor) {
      this.root.customAnchorNode.current = opts.customAnchor.current;
    }
    watch(() => opts.customAnchor.current, (customAnchor) => {
      this.root.customAnchorNode.current = customAnchor;
    });
    this.floating = useFloating({
      strategy: () => this.opts.strategy.current,
      placement: () => get$2(this.#desiredPlacement),
      middleware: () => this.middleware,
      reference: this.root.anchorNode,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: this.#updatePositionStrategy?.current === "always"
        });
        return cleanup;
      },
      open: () => this.opts.enabled.current,
      sideOffset: () => this.opts.sideOffset.current,
      alignOffset: () => this.opts.alignOffset.current
    });
    user_effect(() => {
      if (!this.floating.isPositioned) return;
      this.opts.onPlaced?.current();
    });
    watch(() => this.contentRef.current, (contentNode) => {
      if (!contentNode) return;
      const win = getWindow$1(contentNode);
      this.contentZIndex = win.getComputedStyle(contentNode).zIndex;
    });
    user_effect(() => {
      this.floating.floating.current = this.wrapperRef.current;
    });
  }
}
class FloatingArrowState {
  static create(opts) {
    return new FloatingArrowState(opts, FloatingContentContext.get());
  }
  opts;
  content;
  constructor(opts, content) {
    this.opts = opts;
    this.content = content;
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    style: this.content.arrowStyle,
    "data-side": this.content.placedSide,
    ...this.content.arrowAttachment
  }));
  get props() {
    return get$2(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class FloatingAnchorState {
  static create(opts, tooltip = false) {
    return tooltip ? new FloatingAnchorState(opts, FloatingTooltipRootContext.get()) : new FloatingAnchorState(opts, FloatingRootContext.get());
  }
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    if (opts.virtualEl && opts.virtualEl.current) {
      root.triggerNode = box.from(opts.virtualEl.current);
    } else {
      root.triggerNode = opts.ref;
    }
  }
}
function transformOrigin(options) {
  return {
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
function getSideFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[0];
}
function getAlignFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[1];
}
function Floating_layer($$anchor, $$props) {
  push($$props, true);
  let tooltip = prop($$props, "tooltip", 3, false);
  FloatingRootState.create(tooltip());
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.children ?? noop$1);
  append($$anchor, fragment);
  pop();
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
  return box.with(() => get$2(value), (v) => {
    set(value, v, true);
    onChange?.(v);
    if (timeout) getWindow2().clearTimeout(timeout);
    timeout = resetAfter();
  });
}
function Floating_layer_anchor($$anchor, $$props) {
  push($$props, true);
  let tooltip = prop($$props, "tooltip", 3, false);
  FloatingAnchorState.create(
    {
      id: box.with(() => $$props.id),
      virtualEl: box.with(() => $$props.virtualEl),
      ref: $$props.ref
    },
    tooltip()
  );
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.children ?? noop$1);
  append($$anchor, fragment);
  pop();
}
var root_4$2 = /* @__PURE__ */ from_svg(`<svg viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow=""><polygon points="0,0 30,0 15,10" fill="currentColor"></polygon></svg>`);
var root_2 = /* @__PURE__ */ from_html(`<span><!></span>`);
function Arrow($$anchor, $$props) {
  push($$props, true);
  let id = prop($$props, "id", 19, useId), width = prop($$props, "width", 3, 10), height = prop($$props, "height", 3, 5), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "id",
    "children",
    "child",
    "width",
    "height"
  ]);
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, { id: id() }));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => $$props.child, () => ({ props: get$2(mergedProps) }));
      append($$anchor2, fragment_1);
    };
    var alternate_1 = ($$anchor2) => {
      var span = root_2();
      attribute_effect(span, () => ({ ...get$2(mergedProps) }));
      var node_2 = child(span);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_2 = comment();
          var node_3 = first_child(fragment_2);
          snippet(node_3, () => $$props.children ?? noop$1);
          append($$anchor3, fragment_2);
        };
        var alternate = ($$anchor3) => {
          var svg = root_4$2();
          template_effect(() => {
            set_attribute(svg, "width", width());
            set_attribute(svg, "height", height());
          });
          append($$anchor3, svg);
        };
        if_block(node_2, ($$render) => {
          if ($$props.children) $$render(consequent_1);
          else $$render(alternate, false);
        });
      }
      append($$anchor2, span);
    };
    if_block(node, ($$render) => {
      if ($$props.child) $$render(consequent);
      else $$render(alternate_1, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
function Floating_layer_arrow($$anchor, $$props) {
  push($$props, true);
  let id = prop($$props, "id", 19, useId), ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, ["$$slots", "$$events", "$$legacy", "id", "ref"]);
  const arrowState = FloatingArrowState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, arrowState.props));
  Arrow($$anchor, spread_props(() => get$2(mergedProps)));
  pop();
}
function Floating_layer_content($$anchor, $$props) {
  push($$props, true);
  let side = prop($$props, "side", 3, "bottom"), sideOffset = prop($$props, "sideOffset", 3, 0), align = prop($$props, "align", 3, "center"), alignOffset = prop($$props, "alignOffset", 3, 0), arrowPadding = prop($$props, "arrowPadding", 3, 0), avoidCollisions = prop($$props, "avoidCollisions", 3, true), collisionBoundary = prop($$props, "collisionBoundary", 19, () => []), collisionPadding = prop($$props, "collisionPadding", 3, 0), hideWhenDetached = prop($$props, "hideWhenDetached", 3, false), onPlaced = prop($$props, "onPlaced", 3, () => {
  }), sticky = prop($$props, "sticky", 3, "partial"), updatePositionStrategy = prop($$props, "updatePositionStrategy", 3, "optimized"), strategy = prop($$props, "strategy", 3, "fixed"), dir = prop($$props, "dir", 3, "ltr"), style = prop($$props, "style", 19, () => ({})), wrapperId = prop($$props, "wrapperId", 19, useId), customAnchor = prop($$props, "customAnchor", 3, null), tooltip = prop($$props, "tooltip", 3, false);
  const contentState = FloatingContentState.create(
    {
      side: box.with(() => side()),
      sideOffset: box.with(() => sideOffset()),
      align: box.with(() => align()),
      alignOffset: box.with(() => alignOffset()),
      id: box.with(() => $$props.id),
      arrowPadding: box.with(() => arrowPadding()),
      avoidCollisions: box.with(() => avoidCollisions()),
      collisionBoundary: box.with(() => collisionBoundary()),
      collisionPadding: box.with(() => collisionPadding()),
      hideWhenDetached: box.with(() => hideWhenDetached()),
      onPlaced: box.with(() => onPlaced()),
      sticky: box.with(() => sticky()),
      updatePositionStrategy: box.with(() => updatePositionStrategy()),
      strategy: box.with(() => strategy()),
      dir: box.with(() => dir()),
      style: box.with(() => style()),
      enabled: box.with(() => $$props.enabled),
      wrapperId: box.with(() => wrapperId()),
      customAnchor: box.with(() => customAnchor())
    },
    tooltip()
  );
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(contentState.wrapperProps, { style: { pointerEvents: "auto" } }));
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.content ?? noop$1, () => ({ props: contentState.props, wrapperProps: get$2(mergedProps) }));
  append($$anchor, fragment);
  pop();
}
function Floating_layer_content_static($$anchor, $$props) {
  push($$props, true);
  onMount(() => {
    $$props.onPlaced?.();
  });
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.content ?? noop$1, () => ({ props: {}, wrapperProps: {} }));
  append($$anchor, fragment);
  pop();
}
function Popper_content($$anchor, $$props) {
  let isStatic = prop($$props, "isStatic", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "content",
    "isStatic",
    "onPlaced"
  ]);
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      Floating_layer_content_static($$anchor2, {
        get content() {
          return $$props.content;
        },
        get onPlaced() {
          return $$props.onPlaced;
        }
      });
    };
    var alternate = ($$anchor2) => {
      Floating_layer_content($$anchor2, spread_props(
        {
          get content() {
            return $$props.content;
          },
          get onPlaced() {
            return $$props.onPlaced;
          }
        },
        () => restProps
      ));
    };
    if_block(node, ($$render) => {
      if (isStatic()) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  append($$anchor, fragment);
}
var root_1 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
function Popper_layer_inner($$anchor, $$props) {
  push($$props, true);
  let interactOutsideBehavior = prop($$props, "interactOutsideBehavior", 3, "close"), trapFocus = prop($$props, "trapFocus", 3, true), isValidEvent2 = prop($$props, "isValidEvent", 3, () => false), customAnchor = prop($$props, "customAnchor", 3, null), isStatic = prop($$props, "isStatic", 3, false), tooltip = prop($$props, "tooltip", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "popper",
    "onEscapeKeydown",
    "escapeKeydownBehavior",
    "preventOverflowTextSelection",
    "id",
    "onPointerDown",
    "onPointerUp",
    "side",
    "sideOffset",
    "align",
    "alignOffset",
    "arrowPadding",
    "avoidCollisions",
    "collisionBoundary",
    "collisionPadding",
    "sticky",
    "hideWhenDetached",
    "updatePositionStrategy",
    "strategy",
    "dir",
    "preventScroll",
    "wrapperId",
    "style",
    "onPlaced",
    "onInteractOutside",
    "onCloseAutoFocus",
    "onOpenAutoFocus",
    "onFocusOutside",
    "interactOutsideBehavior",
    "loop",
    "trapFocus",
    "isValidEvent",
    "customAnchor",
    "isStatic",
    "enabled",
    "ref",
    "tooltip"
  ]);
  {
    const content = ($$anchor2, $$arg0) => {
      let floatingProps = () => $$arg0?.().props;
      let wrapperProps = () => $$arg0?.().wrapperProps;
      var fragment_1 = root_1();
      var node = first_child(fragment_1);
      {
        var consequent = ($$anchor3) => {
          Scroll_lock($$anchor3, {
            get preventScroll() {
              return $$props.preventScroll;
            }
          });
        };
        var alternate = ($$anchor3) => {
          var fragment_3 = comment();
          var node_1 = first_child(fragment_3);
          {
            var consequent_1 = ($$anchor4) => {
              Scroll_lock($$anchor4, {
                get preventScroll() {
                  return $$props.preventScroll;
                }
              });
            };
            if_block(
              node_1,
              ($$render) => {
                if (!$$props.forceMount) $$render(consequent_1);
              },
              true
            );
          }
          append($$anchor3, fragment_3);
        };
        if_block(node, ($$render) => {
          if ($$props.forceMount && $$props.enabled) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      var node_2 = sibling(node, 2);
      {
        const focusScope = ($$anchor3, $$arg02) => {
          let focusScopeProps = () => $$arg02?.().props;
          Escape_layer($$anchor3, {
            get onEscapeKeydown() {
              return $$props.onEscapeKeydown;
            },
            get escapeKeydownBehavior() {
              return $$props.escapeKeydownBehavior;
            },
            get enabled() {
              return $$props.enabled;
            },
            get ref() {
              return $$props.ref;
            },
            children: ($$anchor4, $$slotProps) => {
              {
                const children = ($$anchor5, $$arg03) => {
                  let dismissibleProps = () => $$arg03?.().props;
                  Text_selection_layer($$anchor5, {
                    get id() {
                      return $$props.id;
                    },
                    get preventOverflowTextSelection() {
                      return $$props.preventOverflowTextSelection;
                    },
                    get onPointerDown() {
                      return $$props.onPointerDown;
                    },
                    get onPointerUp() {
                      return $$props.onPointerUp;
                    },
                    get enabled() {
                      return $$props.enabled;
                    },
                    get ref() {
                      return $$props.ref;
                    },
                    children: ($$anchor6, $$slotProps2) => {
                      var fragment_8 = comment();
                      var node_3 = first_child(fragment_8);
                      {
                        let $0 = /* @__PURE__ */ user_derived(() => ({
                          props: mergeProps(restProps, floatingProps(), dismissibleProps(), focusScopeProps(), { style: { pointerEvents: "auto" } }),
                          wrapperProps: wrapperProps()
                        }));
                        snippet(node_3, () => $$props.popper ?? noop$1, () => get$2($0));
                      }
                      append($$anchor6, fragment_8);
                    },
                    $$slots: { default: true }
                  });
                };
                Dismissible_layer($$anchor4, {
                  get id() {
                    return $$props.id;
                  },
                  get onInteractOutside() {
                    return $$props.onInteractOutside;
                  },
                  get onFocusOutside() {
                    return $$props.onFocusOutside;
                  },
                  get interactOutsideBehavior() {
                    return interactOutsideBehavior();
                  },
                  get isValidEvent() {
                    return isValidEvent2();
                  },
                  get enabled() {
                    return $$props.enabled;
                  },
                  get ref() {
                    return $$props.ref;
                  },
                  children,
                  $$slots: { default: true }
                });
              }
            },
            $$slots: { default: true }
          });
        };
        Focus_scope(node_2, {
          get onOpenAutoFocus() {
            return $$props.onOpenAutoFocus;
          },
          get onCloseAutoFocus() {
            return $$props.onCloseAutoFocus;
          },
          get loop() {
            return $$props.loop;
          },
          get enabled() {
            return $$props.enabled;
          },
          get trapFocus() {
            return trapFocus();
          },
          get forceMount() {
            return $$props.forceMount;
          },
          get ref() {
            return $$props.ref;
          },
          focusScope,
          $$slots: { focusScope: true }
        });
      }
      append($$anchor2, fragment_1);
    };
    Popper_content($$anchor, {
      get isStatic() {
        return isStatic();
      },
      get id() {
        return $$props.id;
      },
      get side() {
        return $$props.side;
      },
      get sideOffset() {
        return $$props.sideOffset;
      },
      get align() {
        return $$props.align;
      },
      get alignOffset() {
        return $$props.alignOffset;
      },
      get arrowPadding() {
        return $$props.arrowPadding;
      },
      get avoidCollisions() {
        return $$props.avoidCollisions;
      },
      get collisionBoundary() {
        return $$props.collisionBoundary;
      },
      get collisionPadding() {
        return $$props.collisionPadding;
      },
      get sticky() {
        return $$props.sticky;
      },
      get hideWhenDetached() {
        return $$props.hideWhenDetached;
      },
      get updatePositionStrategy() {
        return $$props.updatePositionStrategy;
      },
      get strategy() {
        return $$props.strategy;
      },
      get dir() {
        return $$props.dir;
      },
      get wrapperId() {
        return $$props.wrapperId;
      },
      get style() {
        return $$props.style;
      },
      get onPlaced() {
        return $$props.onPlaced;
      },
      get customAnchor() {
        return customAnchor();
      },
      get enabled() {
        return $$props.enabled;
      },
      get tooltip() {
        return tooltip();
      },
      content,
      $$slots: { content: true }
    });
  }
  pop();
}
function Popper_layer($$anchor, $$props) {
  let interactOutsideBehavior = prop($$props, "interactOutsideBehavior", 3, "close"), trapFocus = prop($$props, "trapFocus", 3, true), isValidEvent2 = prop($$props, "isValidEvent", 3, () => false), customAnchor = prop($$props, "customAnchor", 3, null), isStatic = prop($$props, "isStatic", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "popper",
    "open",
    "onEscapeKeydown",
    "escapeKeydownBehavior",
    "preventOverflowTextSelection",
    "id",
    "onPointerDown",
    "onPointerUp",
    "side",
    "sideOffset",
    "align",
    "alignOffset",
    "arrowPadding",
    "avoidCollisions",
    "collisionBoundary",
    "collisionPadding",
    "sticky",
    "hideWhenDetached",
    "updatePositionStrategy",
    "strategy",
    "dir",
    "preventScroll",
    "wrapperId",
    "style",
    "onPlaced",
    "onInteractOutside",
    "onCloseAutoFocus",
    "onOpenAutoFocus",
    "onFocusOutside",
    "interactOutsideBehavior",
    "loop",
    "trapFocus",
    "isValidEvent",
    "customAnchor",
    "isStatic",
    "ref"
  ]);
  {
    const presence = ($$anchor2) => {
      Popper_layer_inner($$anchor2, spread_props(
        {
          get popper() {
            return $$props.popper;
          },
          get onEscapeKeydown() {
            return $$props.onEscapeKeydown;
          },
          get escapeKeydownBehavior() {
            return $$props.escapeKeydownBehavior;
          },
          get preventOverflowTextSelection() {
            return $$props.preventOverflowTextSelection;
          },
          get id() {
            return $$props.id;
          },
          get onPointerDown() {
            return $$props.onPointerDown;
          },
          get onPointerUp() {
            return $$props.onPointerUp;
          },
          get side() {
            return $$props.side;
          },
          get sideOffset() {
            return $$props.sideOffset;
          },
          get align() {
            return $$props.align;
          },
          get alignOffset() {
            return $$props.alignOffset;
          },
          get arrowPadding() {
            return $$props.arrowPadding;
          },
          get avoidCollisions() {
            return $$props.avoidCollisions;
          },
          get collisionBoundary() {
            return $$props.collisionBoundary;
          },
          get collisionPadding() {
            return $$props.collisionPadding;
          },
          get sticky() {
            return $$props.sticky;
          },
          get hideWhenDetached() {
            return $$props.hideWhenDetached;
          },
          get updatePositionStrategy() {
            return $$props.updatePositionStrategy;
          },
          get strategy() {
            return $$props.strategy;
          },
          get dir() {
            return $$props.dir;
          },
          get preventScroll() {
            return $$props.preventScroll;
          },
          get wrapperId() {
            return $$props.wrapperId;
          },
          get style() {
            return $$props.style;
          },
          get onPlaced() {
            return $$props.onPlaced;
          },
          get customAnchor() {
            return customAnchor();
          },
          get isStatic() {
            return isStatic();
          },
          get enabled() {
            return $$props.open;
          },
          get onInteractOutside() {
            return $$props.onInteractOutside;
          },
          get onCloseAutoFocus() {
            return $$props.onCloseAutoFocus;
          },
          get onOpenAutoFocus() {
            return $$props.onOpenAutoFocus;
          },
          get interactOutsideBehavior() {
            return interactOutsideBehavior();
          },
          get loop() {
            return $$props.loop;
          },
          get trapFocus() {
            return trapFocus();
          },
          get isValidEvent() {
            return isValidEvent2();
          },
          get onFocusOutside() {
            return $$props.onFocusOutside;
          },
          forceMount: false,
          get ref() {
            return $$props.ref;
          }
        },
        () => restProps
      ));
    };
    Presence_layer($$anchor, {
      get open() {
        return $$props.open;
      },
      get ref() {
        return $$props.ref;
      },
      presence,
      $$slots: { presence: true }
    });
  }
}
function Popper_layer_force_mount($$anchor, $$props) {
  let interactOutsideBehavior = prop($$props, "interactOutsideBehavior", 3, "close"), trapFocus = prop($$props, "trapFocus", 3, true), isValidEvent2 = prop($$props, "isValidEvent", 3, () => false), customAnchor = prop($$props, "customAnchor", 3, null), isStatic = prop($$props, "isStatic", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "popper",
    "onEscapeKeydown",
    "escapeKeydownBehavior",
    "preventOverflowTextSelection",
    "id",
    "onPointerDown",
    "onPointerUp",
    "side",
    "sideOffset",
    "align",
    "alignOffset",
    "arrowPadding",
    "avoidCollisions",
    "collisionBoundary",
    "collisionPadding",
    "sticky",
    "hideWhenDetached",
    "updatePositionStrategy",
    "strategy",
    "dir",
    "preventScroll",
    "wrapperId",
    "style",
    "onPlaced",
    "onInteractOutside",
    "onCloseAutoFocus",
    "onOpenAutoFocus",
    "onFocusOutside",
    "interactOutsideBehavior",
    "loop",
    "trapFocus",
    "isValidEvent",
    "customAnchor",
    "isStatic",
    "enabled"
  ]);
  Popper_layer_inner($$anchor, spread_props(
    {
      get popper() {
        return $$props.popper;
      },
      get onEscapeKeydown() {
        return $$props.onEscapeKeydown;
      },
      get escapeKeydownBehavior() {
        return $$props.escapeKeydownBehavior;
      },
      get preventOverflowTextSelection() {
        return $$props.preventOverflowTextSelection;
      },
      get id() {
        return $$props.id;
      },
      get onPointerDown() {
        return $$props.onPointerDown;
      },
      get onPointerUp() {
        return $$props.onPointerUp;
      },
      get side() {
        return $$props.side;
      },
      get sideOffset() {
        return $$props.sideOffset;
      },
      get align() {
        return $$props.align;
      },
      get alignOffset() {
        return $$props.alignOffset;
      },
      get arrowPadding() {
        return $$props.arrowPadding;
      },
      get avoidCollisions() {
        return $$props.avoidCollisions;
      },
      get collisionBoundary() {
        return $$props.collisionBoundary;
      },
      get collisionPadding() {
        return $$props.collisionPadding;
      },
      get sticky() {
        return $$props.sticky;
      },
      get hideWhenDetached() {
        return $$props.hideWhenDetached;
      },
      get updatePositionStrategy() {
        return $$props.updatePositionStrategy;
      },
      get strategy() {
        return $$props.strategy;
      },
      get dir() {
        return $$props.dir;
      },
      get preventScroll() {
        return $$props.preventScroll;
      },
      get wrapperId() {
        return $$props.wrapperId;
      },
      get style() {
        return $$props.style;
      },
      get onPlaced() {
        return $$props.onPlaced;
      },
      get customAnchor() {
        return customAnchor();
      },
      get isStatic() {
        return isStatic();
      },
      get enabled() {
        return $$props.enabled;
      },
      get onInteractOutside() {
        return $$props.onInteractOutside;
      },
      get onCloseAutoFocus() {
        return $$props.onCloseAutoFocus;
      },
      get onOpenAutoFocus() {
        return $$props.onOpenAutoFocus;
      },
      get interactOutsideBehavior() {
        return interactOutsideBehavior();
      },
      get loop() {
        return $$props.loop;
      },
      get trapFocus() {
        return trapFocus();
      },
      get isValidEvent() {
        return isValidEvent2();
      },
      get onFocusOutside() {
        return $$props.onFocusOutside;
      }
    },
    () => restProps,
    { forceMount: true }
  ));
}
class GraceArea {
  #opts;
  #enabled;
  #isPointerInTransit;
  #pointerGraceArea = /* @__PURE__ */ state(null);
  constructor(opts) {
    this.#opts = opts;
    this.#enabled = /* @__PURE__ */ user_derived(() => this.#opts.enabled());
    this.#isPointerInTransit = boxAutoReset(false, {
      afterMs: opts.transitTimeout ?? 300,
      onChange: (value) => {
        if (!get$2(this.#enabled)) return;
        this.#opts.setIsPointerInTransit?.(value);
      },
      getWindow: () => getWindow$1(this.#opts.triggerNode())
    });
    watch([opts.triggerNode, opts.contentNode, opts.enabled], ([triggerNode, contentNode, enabled]) => {
      if (!triggerNode || !contentNode || !enabled) return;
      const handleTriggerLeave = (e) => {
        this.#createGraceArea(e, contentNode);
      };
      const handleContentLeave = (e) => {
        this.#createGraceArea(e, triggerNode);
      };
      return executeCallbacks(on(triggerNode, "pointerleave", handleTriggerLeave), on(contentNode, "pointerleave", handleContentLeave));
    });
    watch(() => get$2(this.#pointerGraceArea), () => {
      const handleTrackPointerGrace = (e) => {
        if (!get$2(this.#pointerGraceArea)) return;
        const target = e.target;
        if (!isElement$1(target)) return;
        const pointerPosition = { x: e.clientX, y: e.clientY };
        const hasEnteredTarget = opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, get$2(this.#pointerGraceArea));
        if (hasEnteredTarget) {
          this.#removeGraceArea();
        } else if (isPointerOutsideGraceArea) {
          this.#removeGraceArea();
          opts.onPointerExit();
        }
      };
      const doc = getDocument(opts.triggerNode() ?? opts.contentNode());
      if (!doc) return;
      return on(doc, "pointermove", handleTrackPointerGrace);
    });
  }
  #removeGraceArea() {
    set(this.#pointerGraceArea, null);
    this.#isPointerInTransit.current = false;
  }
  #createGraceArea(e, hoverTarget) {
    const currentTarget = e.currentTarget;
    if (!isHTMLElement$1(currentTarget)) return;
    const exitPoint = { x: e.clientX, y: e.clientY };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    set(this.#pointerGraceArea, graceArea, true);
    this.#isPointerInTransit.current = true;
  }
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const tipPadding = padding * 1.5;
  switch (exitSide) {
    case "top":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x, y: exitPoint.y - tipPadding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      ];
    case "bottom":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x, y: exitPoint.y + tipPadding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      ];
    case "left":
      return [
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x - tipPadding, y: exitPoint.y },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      ];
    case "right":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + tipPadding, y: exitPoint.y },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      ];
  }
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r2 = upperHull[upperHull.length - 2];
      if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r2 = lowerHull[lowerHull.length - 2];
      if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
const defaultOpts = {
  immediate: true
};
class TimeoutFn {
  #opts;
  #interval;
  #cb;
  #timer = null;
  constructor(cb, interval, opts = {}) {
    this.#cb = cb;
    this.#interval = interval;
    this.#opts = { ...defaultOpts, ...opts };
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    if (this.#opts.immediate && BROWSER) {
      this.start();
    }
    onDestroyEffect(this.stop);
  }
  #clear() {
    if (this.#timer !== null) {
      window.clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
  stop() {
    this.#clear();
  }
  start(...args) {
    this.#clear();
    this.#timer = window.setTimeout(() => {
      this.#timer = null;
      this.#cb(...args);
    }, this.#interval);
  }
}
const tooltipAttrs = createBitsAttrs({ component: "tooltip", parts: ["content", "trigger"] });
const TooltipProviderContext = new Context("Tooltip.Provider");
const TooltipRootContext = new Context("Tooltip.Root");
class TooltipProviderState {
  static create(opts) {
    return TooltipProviderContext.set(new TooltipProviderState(opts));
  }
  opts;
  #isOpenDelayed = /* @__PURE__ */ state(true);
  get isOpenDelayed() {
    return get$2(this.#isOpenDelayed);
  }
  set isOpenDelayed(value) {
    set(this.#isOpenDelayed, value, true);
  }
  isPointerInTransit = box(false);
  #timerFn;
  #openTooltip = /* @__PURE__ */ state(null);
  constructor(opts) {
    this.opts = opts;
    this.#timerFn = new TimeoutFn(
      () => {
        this.isOpenDelayed = true;
      },
      this.opts.skipDelayDuration.current,
      { immediate: false }
    );
  }
  #startTimer = () => {
    const skipDuration = this.opts.skipDelayDuration.current;
    if (skipDuration === 0) {
      return;
    } else {
      this.#timerFn.start();
    }
  };
  #clearTimer = () => {
    this.#timerFn.stop();
  };
  onOpen = (tooltip) => {
    if (get$2(this.#openTooltip) && get$2(this.#openTooltip) !== tooltip) {
      get$2(this.#openTooltip).handleClose();
    }
    this.#clearTimer();
    this.isOpenDelayed = false;
    set(this.#openTooltip, tooltip, true);
  };
  onClose = (tooltip) => {
    if (get$2(this.#openTooltip) === tooltip) {
      set(this.#openTooltip, null);
    }
    this.#startTimer();
  };
  isTooltipOpen = (tooltip) => {
    return get$2(this.#openTooltip) === tooltip;
  };
}
class TooltipRootState {
  static create(opts) {
    return TooltipRootContext.set(new TooltipRootState(opts, TooltipProviderContext.get()));
  }
  opts;
  provider;
  #delayDuration = /* @__PURE__ */ user_derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
  get delayDuration() {
    return get$2(this.#delayDuration);
  }
  set delayDuration(value) {
    set(this.#delayDuration, value);
  }
  #disableHoverableContent = /* @__PURE__ */ user_derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
  get disableHoverableContent() {
    return get$2(this.#disableHoverableContent);
  }
  set disableHoverableContent(value) {
    set(this.#disableHoverableContent, value);
  }
  #disableCloseOnTriggerClick = /* @__PURE__ */ user_derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
  get disableCloseOnTriggerClick() {
    return get$2(this.#disableCloseOnTriggerClick);
  }
  set disableCloseOnTriggerClick(value) {
    set(this.#disableCloseOnTriggerClick, value);
  }
  #disabled = /* @__PURE__ */ user_derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
  get disabled() {
    return get$2(this.#disabled);
  }
  set disabled(value) {
    set(this.#disabled, value);
  }
  #ignoreNonKeyboardFocus = /* @__PURE__ */ user_derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
  get ignoreNonKeyboardFocus() {
    return get$2(this.#ignoreNonKeyboardFocus);
  }
  set ignoreNonKeyboardFocus(value) {
    set(this.#ignoreNonKeyboardFocus, value);
  }
  #contentNode = /* @__PURE__ */ state(null);
  get contentNode() {
    return get$2(this.#contentNode);
  }
  set contentNode(value) {
    set(this.#contentNode, value, true);
  }
  #triggerNode = /* @__PURE__ */ state(null);
  get triggerNode() {
    return get$2(this.#triggerNode);
  }
  set triggerNode(value) {
    set(this.#triggerNode, value, true);
  }
  #wasOpenDelayed = /* @__PURE__ */ state(false);
  #timerFn;
  #stateAttr = /* @__PURE__ */ user_derived(() => {
    if (!this.opts.open.current) return "closed";
    return get$2(this.#wasOpenDelayed) ? "delayed-open" : "instant-open";
  });
  get stateAttr() {
    return get$2(this.#stateAttr);
  }
  set stateAttr(value) {
    set(this.#stateAttr, value);
  }
  constructor(opts, provider) {
    this.opts = opts;
    this.provider = provider;
    this.#timerFn = new TimeoutFn(
      () => {
        set(this.#wasOpenDelayed, true);
        this.opts.open.current = true;
      },
      this.delayDuration ?? 0,
      { immediate: false }
    );
    new OpenChangeComplete({
      open: this.opts.open,
      ref: box.with(() => this.contentNode),
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
    watch(() => this.delayDuration, () => {
      if (this.delayDuration === void 0) return;
      this.#timerFn = new TimeoutFn(
        () => {
          set(this.#wasOpenDelayed, true);
          this.opts.open.current = true;
        },
        this.delayDuration,
        { immediate: false }
      );
    });
    watch(() => this.opts.open.current, (isOpen) => {
      if (isOpen) {
        this.provider.onOpen(this);
      } else {
        this.provider.onClose(this);
      }
    });
  }
  handleOpen = () => {
    this.#timerFn.stop();
    set(this.#wasOpenDelayed, false);
    this.opts.open.current = true;
  };
  handleClose = () => {
    this.#timerFn.stop();
    this.opts.open.current = false;
  };
  #handleDelayedOpen = () => {
    this.#timerFn.stop();
    const shouldSkipDelay = !this.provider.isOpenDelayed;
    const delayDuration = this.delayDuration ?? 0;
    if (shouldSkipDelay || delayDuration === 0) {
      set(this.#wasOpenDelayed, delayDuration > 0 && shouldSkipDelay, true);
      this.opts.open.current = true;
    } else {
      this.#timerFn.start();
    }
  };
  onTriggerEnter = () => {
    this.#handleDelayedOpen();
  };
  onTriggerLeave = () => {
    if (this.disableHoverableContent) {
      this.handleClose();
    } else {
      this.#timerFn.stop();
    }
  };
}
class TooltipTriggerState {
  static create(opts) {
    return new TooltipTriggerState(opts, TooltipRootContext.get());
  }
  opts;
  root;
  attachment;
  #isPointerDown = box(false);
  #hasPointerMoveOpened = /* @__PURE__ */ state(false);
  #isDisabled = /* @__PURE__ */ user_derived(() => this.opts.disabled.current || this.root.disabled);
  domContext;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.domContext = new DOMContext(opts.ref);
    this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
  }
  handlePointerUp = () => {
    this.#isPointerDown.current = false;
  };
  #onpointerup = () => {
    if (get$2(this.#isDisabled)) return;
    this.#isPointerDown.current = false;
  };
  #onpointerdown = () => {
    if (get$2(this.#isDisabled)) return;
    this.#isPointerDown.current = true;
    this.domContext.getDocument().addEventListener(
      "pointerup",
      () => {
        this.handlePointerUp();
      },
      { once: true }
    );
  };
  #onpointermove = (e) => {
    if (get$2(this.#isDisabled)) return;
    if (e.pointerType === "touch") return;
    if (get$2(this.#hasPointerMoveOpened)) return;
    if (this.root.provider.isPointerInTransit.current) return;
    this.root.onTriggerEnter();
    set(this.#hasPointerMoveOpened, true);
  };
  #onpointerleave = () => {
    if (get$2(this.#isDisabled)) return;
    this.root.onTriggerLeave();
    set(this.#hasPointerMoveOpened, false);
  };
  #onfocus = (e) => {
    if (this.#isPointerDown.current || get$2(this.#isDisabled)) return;
    if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
    this.root.handleOpen();
  };
  #onblur = () => {
    if (get$2(this.#isDisabled)) return;
    this.root.handleClose();
  };
  #onclick = () => {
    if (this.root.disableCloseOnTriggerClick || get$2(this.#isDisabled)) return;
    this.root.handleClose();
  };
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "aria-describedby": this.root.opts.open.current ? this.root.contentNode?.id : void 0,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(get$2(this.#isDisabled)),
    "data-delay-duration": `${this.root.delayDuration}`,
    [tooltipAttrs.trigger]: "",
    tabindex: get$2(this.#isDisabled) ? void 0 : 0,
    disabled: this.opts.disabled.current,
    onpointerup: this.#onpointerup,
    onpointerdown: this.#onpointerdown,
    onpointermove: this.#onpointermove,
    onpointerleave: this.#onpointerleave,
    onfocus: this.#onfocus,
    onblur: this.#onblur,
    onclick: this.#onclick,
    ...this.attachment
  }));
  get props() {
    return get$2(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
}
class TooltipContentState {
  static create(opts) {
    return new TooltipContentState(opts, TooltipRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
    new GraceArea({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
      onPointerExit: () => {
        if (this.root.provider.isTooltipOpen(this.root)) {
          this.root.handleClose();
        }
      },
      setIsPointerInTransit: (value) => {
        this.root.provider.isPointerInTransit.current = value;
      },
      transitTimeout: this.root.provider.opts.skipDelayDuration.current
    });
    onMountEffect(() => on(window, "scroll", (e) => {
      const target = e.target;
      if (!target) return;
      if (target.contains(this.root.triggerNode)) {
        this.root.handleClose();
      }
    }));
  }
  onInteractOutside = (e) => {
    if (isElement$1(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  #snippetProps = /* @__PURE__ */ user_derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return get$2(this.#snippetProps);
  }
  set snippetProps(value) {
    set(this.#snippetProps, value);
  }
  #props = /* @__PURE__ */ user_derived(() => ({
    id: this.opts.id.current,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(this.root.disabled),
    style: { pointerEvents: "auto", outline: "none" },
    [tooltipAttrs.content]: "",
    ...this.attachment
  }));
  get props() {
    return get$2(this.#props);
  }
  set props(value) {
    set(this.#props, value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
function Tooltip($$anchor, $$props) {
  push($$props, true);
  let open = prop($$props, "open", 15, false), onOpenChange = prop($$props, "onOpenChange", 3, noop), onOpenChangeComplete = prop($$props, "onOpenChangeComplete", 3, noop);
  TooltipRootState.create({
    open: box.with(() => open(), (v) => {
      open(v);
      onOpenChange()(v);
    }),
    delayDuration: box.with(() => $$props.delayDuration),
    disableCloseOnTriggerClick: box.with(() => $$props.disableCloseOnTriggerClick),
    disableHoverableContent: box.with(() => $$props.disableHoverableContent),
    ignoreNonKeyboardFocus: box.with(() => $$props.ignoreNonKeyboardFocus),
    disabled: box.with(() => $$props.disabled),
    onOpenChangeComplete: box.with(() => onOpenChangeComplete())
  });
  Floating_layer($$anchor, {
    tooltip: true,
    children: ($$anchor2, $$slotProps) => {
      var fragment_1 = comment();
      var node = first_child(fragment_1);
      snippet(node, () => $$props.children ?? noop$1);
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  });
  pop();
}
var root_4$1 = /* @__PURE__ */ from_html(`<div><div><!></div></div>`);
var root_9$1 = /* @__PURE__ */ from_html(`<div><div><!></div></div>`);
function Tooltip_content($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), side = prop($$props, "side", 3, "top"), sideOffset = prop($$props, "sideOffset", 3, 0), align = prop($$props, "align", 3, "center"), avoidCollisions = prop($$props, "avoidCollisions", 3, true), arrowPadding = prop($$props, "arrowPadding", 3, 0), sticky = prop($$props, "sticky", 3, "partial"), hideWhenDetached = prop($$props, "hideWhenDetached", 3, false), collisionPadding = prop($$props, "collisionPadding", 3, 0), onInteractOutside = prop($$props, "onInteractOutside", 3, noop), onEscapeKeydown = prop($$props, "onEscapeKeydown", 3, noop), forceMount = prop($$props, "forceMount", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "children",
    "child",
    "id",
    "ref",
    "side",
    "sideOffset",
    "align",
    "avoidCollisions",
    "arrowPadding",
    "sticky",
    "hideWhenDetached",
    "collisionPadding",
    "onInteractOutside",
    "onEscapeKeydown",
    "forceMount"
  ]);
  const contentState = TooltipContentState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v)),
    onInteractOutside: box.with(() => onInteractOutside()),
    onEscapeKeydown: box.with(() => onEscapeKeydown())
  });
  const floatingProps = /* @__PURE__ */ user_derived(() => ({
    side: side(),
    sideOffset: sideOffset(),
    align: align(),
    avoidCollisions: avoidCollisions(),
    arrowPadding: arrowPadding(),
    sticky: sticky(),
    hideWhenDetached: hideWhenDetached(),
    collisionPadding: collisionPadding()
  }));
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, get$2(floatingProps), contentState.props));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_1 = ($$anchor2) => {
      {
        const popper = ($$anchor3, $$arg0) => {
          let props = () => $$arg0?.().props;
          let wrapperProps = () => $$arg0?.().wrapperProps;
          const mergedProps2 = /* @__PURE__ */ user_derived(() => mergeProps(props(), { style: getFloatingContentCSSVars("tooltip") }));
          var fragment_2 = comment();
          var node_1 = first_child(fragment_2);
          {
            var consequent = ($$anchor4) => {
              var fragment_3 = comment();
              var node_2 = first_child(fragment_3);
              {
                let $0 = /* @__PURE__ */ user_derived(() => ({
                  props: get$2(mergedProps2),
                  wrapperProps: wrapperProps(),
                  ...contentState.snippetProps
                }));
                snippet(node_2, () => $$props.child, () => get$2($0));
              }
              append($$anchor4, fragment_3);
            };
            var alternate = ($$anchor4) => {
              var div = root_4$1();
              attribute_effect(div, () => ({ ...wrapperProps() }));
              var div_1 = child(div);
              attribute_effect(div_1, () => ({ ...get$2(mergedProps2) }));
              var node_3 = child(div_1);
              snippet(node_3, () => $$props.children ?? noop$1);
              append($$anchor4, div);
            };
            if_block(node_1, ($$render) => {
              if ($$props.child) $$render(consequent);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, fragment_2);
        };
        Popper_layer_force_mount($$anchor2, spread_props(() => get$2(mergedProps), () => contentState.popperProps, {
          get enabled() {
            return contentState.root.opts.open.current;
          },
          get id() {
            return id();
          },
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: true,
          get ref() {
            return contentState.opts.ref;
          },
          tooltip: true,
          popper,
          $$slots: { popper: true }
        }));
      }
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_4 = comment();
      var node_4 = first_child(fragment_4);
      {
        var consequent_3 = ($$anchor3) => {
          {
            const popper = ($$anchor4, $$arg0) => {
              let props = () => $$arg0?.().props;
              let wrapperProps = () => $$arg0?.().wrapperProps;
              const mergedProps2 = /* @__PURE__ */ user_derived(() => mergeProps(props(), { style: getFloatingContentCSSVars("tooltip") }));
              var fragment_6 = comment();
              var node_5 = first_child(fragment_6);
              {
                var consequent_2 = ($$anchor5) => {
                  var fragment_7 = comment();
                  var node_6 = first_child(fragment_7);
                  {
                    let $0 = /* @__PURE__ */ user_derived(() => ({
                      props: get$2(mergedProps2),
                      wrapperProps: wrapperProps(),
                      ...contentState.snippetProps
                    }));
                    snippet(node_6, () => $$props.child, () => get$2($0));
                  }
                  append($$anchor5, fragment_7);
                };
                var alternate_1 = ($$anchor5) => {
                  var div_2 = root_9$1();
                  attribute_effect(div_2, () => ({ ...wrapperProps() }));
                  var div_3 = child(div_2);
                  attribute_effect(div_3, () => ({ ...get$2(mergedProps2) }));
                  var node_7 = child(div_3);
                  snippet(node_7, () => $$props.children ?? noop$1);
                  append($$anchor5, div_2);
                };
                if_block(node_5, ($$render) => {
                  if ($$props.child) $$render(consequent_2);
                  else $$render(alternate_1, false);
                });
              }
              append($$anchor4, fragment_6);
            };
            Popper_layer($$anchor3, spread_props(() => get$2(mergedProps), () => contentState.popperProps, {
              get open() {
                return contentState.root.opts.open.current;
              },
              get id() {
                return id();
              },
              trapFocus: false,
              loop: false,
              preventScroll: false,
              forceMount: false,
              get ref() {
                return contentState.opts.ref;
              },
              tooltip: true,
              popper,
              $$slots: { popper: true }
            }));
          }
        };
        if_block(
          node_4,
          ($$render) => {
            if (!forceMount()) $$render(consequent_3);
          },
          true
        );
      }
      append($$anchor2, fragment_4);
    };
    if_block(node, ($$render) => {
      if (forceMount()) $$render(consequent_1);
      else $$render(alternate_2, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_4 = /* @__PURE__ */ from_html(`<div><!></div>`);
var root_9 = /* @__PURE__ */ from_html(`<div><!></div>`);
function Tooltip_content_static($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), ref = prop($$props, "ref", 15, null), onInteractOutside = prop($$props, "onInteractOutside", 3, noop), onEscapeKeydown = prop($$props, "onEscapeKeydown", 3, noop), forceMount = prop($$props, "forceMount", 3, false), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "children",
    "child",
    "id",
    "ref",
    "onInteractOutside",
    "onEscapeKeydown",
    "forceMount"
  ]);
  const contentState = TooltipContentState.create({
    id: box.with(() => id()),
    ref: box.with(() => ref(), (v) => ref(v)),
    onInteractOutside: box.with(() => onInteractOutside()),
    onEscapeKeydown: box.with(() => onEscapeKeydown())
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, contentState.props));
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_1 = ($$anchor2) => {
      {
        const popper = ($$anchor3, $$arg0) => {
          let props = () => $$arg0?.().props;
          const mergedProps2 = /* @__PURE__ */ user_derived(() => mergeProps(props(), { style: getFloatingContentCSSVars("tooltip") }));
          var fragment_2 = comment();
          var node_1 = first_child(fragment_2);
          {
            var consequent = ($$anchor4) => {
              var fragment_3 = comment();
              var node_2 = first_child(fragment_3);
              {
                let $0 = /* @__PURE__ */ user_derived(() => ({ props: get$2(mergedProps2), ...contentState.snippetProps }));
                snippet(node_2, () => $$props.child, () => get$2($0));
              }
              append($$anchor4, fragment_3);
            };
            var alternate = ($$anchor4) => {
              var div = root_4();
              attribute_effect(div, () => ({ ...get$2(mergedProps2) }));
              var node_3 = child(div);
              snippet(node_3, () => $$props.children ?? noop$1);
              append($$anchor4, div);
            };
            if_block(node_1, ($$render) => {
              if ($$props.child) $$render(consequent);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, fragment_2);
        };
        Popper_layer_force_mount($$anchor2, spread_props(() => get$2(mergedProps), () => contentState.popperProps, {
          isStatic: true,
          get enabled() {
            return contentState.root.opts.open.current;
          },
          get id() {
            return id();
          },
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: true,
          get ref() {
            return contentState.opts.ref;
          },
          tooltip: true,
          popper,
          $$slots: { popper: true }
        }));
      }
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_4 = comment();
      var node_4 = first_child(fragment_4);
      {
        var consequent_3 = ($$anchor3) => {
          {
            const popper = ($$anchor4, $$arg0) => {
              let props = () => $$arg0?.().props;
              const mergedProps2 = /* @__PURE__ */ user_derived(() => mergeProps(props(), { style: getFloatingContentCSSVars("tooltip") }));
              var fragment_6 = comment();
              var node_5 = first_child(fragment_6);
              {
                var consequent_2 = ($$anchor5) => {
                  var fragment_7 = comment();
                  var node_6 = first_child(fragment_7);
                  {
                    let $0 = /* @__PURE__ */ user_derived(() => ({ props: get$2(mergedProps2), ...contentState.snippetProps }));
                    snippet(node_6, () => $$props.child, () => get$2($0));
                  }
                  append($$anchor5, fragment_7);
                };
                var alternate_1 = ($$anchor5) => {
                  var div_1 = root_9();
                  attribute_effect(div_1, () => ({ ...get$2(mergedProps2) }));
                  var node_7 = child(div_1);
                  snippet(node_7, () => $$props.children ?? noop$1);
                  append($$anchor5, div_1);
                };
                if_block(node_5, ($$render) => {
                  if ($$props.child) $$render(consequent_2);
                  else $$render(alternate_1, false);
                });
              }
              append($$anchor4, fragment_6);
            };
            Popper_layer($$anchor3, spread_props(() => get$2(mergedProps), () => contentState.popperProps, {
              tooltip: true,
              isStatic: true,
              get open() {
                return contentState.root.opts.open.current;
              },
              get id() {
                return id();
              },
              trapFocus: false,
              loop: false,
              preventScroll: false,
              forceMount: false,
              get ref() {
                return contentState.opts.ref;
              },
              popper,
              $$slots: { popper: true }
            }));
          }
        };
        if_block(
          node_4,
          ($$render) => {
            if (!forceMount()) $$render(consequent_3);
          },
          true
        );
      }
      append($$anchor2, fragment_4);
    };
    if_block(node, ($$render) => {
      if (forceMount()) $$render(consequent_1);
      else $$render(alternate_2, false);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_3 = /* @__PURE__ */ from_html(`<button><!></button>`);
function Tooltip_trigger($$anchor, $$props) {
  const uid = props_id();
  push($$props, true);
  let id = prop($$props, "id", 19, () => createId(uid)), disabled = prop($$props, "disabled", 3, false), type = prop($$props, "type", 3, "button"), ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "children",
    "child",
    "id",
    "disabled",
    "type",
    "ref"
  ]);
  const triggerState = TooltipTriggerState.create({
    id: box.with(() => id()),
    disabled: box.with(() => disabled() ?? false),
    ref: box.with(() => ref(), (v) => ref(v))
  });
  const mergedProps = /* @__PURE__ */ user_derived(() => mergeProps(restProps, triggerState.props, { type: type() }));
  Floating_layer_anchor($$anchor, {
    get id() {
      return id();
    },
    get ref() {
      return triggerState.opts.ref;
    },
    tooltip: true,
    children: ($$anchor2, $$slotProps) => {
      var fragment_1 = comment();
      var node = first_child(fragment_1);
      {
        var consequent = ($$anchor3) => {
          var fragment_2 = comment();
          var node_1 = first_child(fragment_2);
          snippet(node_1, () => $$props.child, () => ({ props: get$2(mergedProps) }));
          append($$anchor3, fragment_2);
        };
        var alternate = ($$anchor3) => {
          var button = root_3();
          attribute_effect(button, () => ({ ...get$2(mergedProps) }));
          var node_2 = child(button);
          snippet(node_2, () => $$props.children ?? noop$1);
          append($$anchor3, button);
        };
        if_block(node, ($$render) => {
          if ($$props.child) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  });
  pop();
}
function Tooltip_arrow($$anchor, $$props) {
  push($$props, true);
  let ref = prop($$props, "ref", 15, null), restProps = /* @__PURE__ */ rest_props($$props, ["$$slots", "$$events", "$$legacy", "ref"]);
  Floating_layer_arrow($$anchor, spread_props(() => restProps, {
    get ref() {
      return ref();
    },
    set ref($$value) {
      ref($$value);
    }
  }));
  pop();
}
function Tooltip_provider($$anchor, $$props) {
  push($$props, true);
  let delayDuration = prop($$props, "delayDuration", 3, 700), disableCloseOnTriggerClick = prop($$props, "disableCloseOnTriggerClick", 3, false), disableHoverableContent = prop($$props, "disableHoverableContent", 3, false), disabled = prop($$props, "disabled", 3, false), ignoreNonKeyboardFocus = prop($$props, "ignoreNonKeyboardFocus", 3, false), skipDelayDuration = prop($$props, "skipDelayDuration", 3, 300);
  TooltipProviderState.create({
    delayDuration: box.with(() => delayDuration()),
    disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick()),
    disableHoverableContent: box.with(() => disableHoverableContent()),
    disabled: box.with(() => disabled()),
    ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus()),
    skipDelayDuration: box.with(() => skipDelayDuration())
  });
  var fragment = comment();
  var node = first_child(fragment);
  snippet(node, () => $$props.children ?? noop$1);
  append($$anchor, fragment);
  pop();
}
function TestTooltipComponent() {
  const refs = [
    Tooltip,
    Tooltip_content,
    Tooltip_content_static,
    Tooltip_trigger,
    Tooltip_arrow,
    Tooltip_provider,
    Portal
  ];
  return refs;
}
const allExports = [
  Tooltip,
  Tooltip_content,
  Tooltip_content_static,
  Tooltip_trigger,
  Tooltip_arrow,
  Tooltip_provider,
  Portal
];
export {
  TestTooltipComponent,
  allExports
};
