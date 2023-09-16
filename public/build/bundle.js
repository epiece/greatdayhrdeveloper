
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (87:3) {:else}
    function create_else_block(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[14](/*index*/ ctx[18]);
    	}

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[15](/*index*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			attr_dev(button0, "class", "btn btn-warning btn-sm");
    			add_location(button0, file, 87, 5, 2473);
    			attr_dev(button1, "class", "btn btn-danger btn-sm");
    			add_location(button1, file, 88, 5, 2565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_2, false, false, false, false),
    					listen_dev(button1, "click", click_handler_3, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(87:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (84:3) {#if index === editingIndex}
    function create_if_block(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Save";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			attr_dev(button0, "class", "btn btn-success btn-sm");
    			add_location(button0, file, 84, 5, 2285);
    			attr_dev(button1, "class", "btn btn-secondary btn-sm");
    			add_location(button1, file, 85, 5, 2371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[12], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(84:3) {#if index === editingIndex}",
    		ctx
    	});

    	return block;
    }

    // (81:2) {#each guests as guest, index (guest.idCardNumber)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let t0_value = /*guest*/ ctx[16].firstName + "";
    	let t0;
    	let t1;
    	let t2_value = /*guest*/ ctx[16].lastName + "";
    	let t2;
    	let t3;
    	let t4_value = /*guest*/ ctx[16].idCardNumber + "";
    	let t4;
    	let t5;
    	let t6;

    	function select_block_type(ctx, dirty) {
    		if (/*index*/ ctx[18] === /*editingIndex*/ ctx[4]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" (");
    			t4 = text(t4_value);
    			t5 = text(")\n\t\t\t");
    			if_block.c();
    			t6 = space();
    			add_location(li, file, 81, 4, 2182);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    			append_dev(li, t5);
    			if_block.m(li, null);
    			append_dev(li, t6);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*guests*/ 1 && t0_value !== (t0_value = /*guest*/ ctx[16].firstName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*guests*/ 1 && t2_value !== (t2_value = /*guest*/ ctx[16].lastName + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*guests*/ 1 && t4_value !== (t4_value = /*guest*/ ctx[16].idCardNumber + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t6);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(81:2) {#each guests as guest, index (guest.idCardNumber)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div6;
    	let div0;
    	let h1;
    	let t1;
    	let div5;
    	let form;
    	let div1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div2;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div3;
    	let label2;
    	let t9;
    	let input2;
    	let t10;
    	let div4;
    	let button;
    	let t12;
    	let div7;
    	let h2;
    	let t14;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*guests*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*guest*/ ctx[16].idCardNumber;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Guest Registration";
    			t1 = space();
    			div5 = element("div");
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "First Name:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Last Name:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "ID Card Number:";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Register";
    			t12 = space();
    			div7 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Guest List";
    			t14 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "card-title text-center");
    			add_location(h1, file, 51, 2, 1205);
    			attr_dev(div0, "class", "card-header");
    			add_location(div0, file, 50, 3, 1177);
    			attr_dev(label0, "for", "firstName");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file, 56, 3, 1372);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "firstName");
    			attr_dev(input0, "class", "form-control");
    			input0.required = true;
    			add_location(input0, file, 57, 3, 1437);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file, 55, 4, 1350);
    			attr_dev(label1, "for", "lastName");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file, 61, 3, 1565);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "lastName");
    			attr_dev(input1, "class", "form-control");
    			input1.required = true;
    			add_location(input1, file, 62, 3, 1628);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file, 60, 4, 1543);
    			attr_dev(label2, "for", "idCardNumber");
    			attr_dev(label2, "class", "form-label");
    			add_location(label2, file, 66, 3, 1754);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "idCardNumber");
    			attr_dev(input2, "class", "form-control");
    			input2.required = true;
    			add_location(input2, file, 67, 3, 1826);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file, 65, 4, 1732);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file, 71, 3, 1967);
    			attr_dev(div4, "class", "text-center");
    			add_location(div4, file, 70, 4, 1938);
    			add_location(form, file, 54, 2, 1303);
    			attr_dev(div5, "class", "card-body");
    			add_location(div5, file, 53, 3, 1277);
    			attr_dev(div6, "class", "card svelte-128loa9");
    			add_location(div6, file, 49, 1, 1155);
    			add_location(h2, file, 78, 3, 2096);
    			add_location(ul, file, 79, 3, 2119);
    			attr_dev(div7, "class", "mt-4");
    			add_location(div7, file, 77, 1, 2074);
    			attr_dev(main, "class", "container mt-5");
    			add_location(main, file, 48, 2, 1124);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div0);
    			append_dev(div0, h1);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, form);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, input0);
    			set_input_value(input0, /*firstName*/ ctx[1]);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t6);
    			append_dev(div2, input1);
    			set_input_value(input1, /*lastName*/ ctx[2]);
    			append_dev(form, t7);
    			append_dev(form, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t9);
    			append_dev(div3, input2);
    			set_input_value(input2, /*idCardNumber*/ ctx[3]);
    			append_dev(form, t10);
    			append_dev(form, div4);
    			append_dev(div4, button);
    			append_dev(main, t12);
    			append_dev(main, div7);
    			append_dev(div7, h2);
    			append_dev(div7, t14);
    			append_dev(div7, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(form, "submit", prevent_default(/*addGuest*/ ctx[5]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*firstName*/ 2 && input0.value !== /*firstName*/ ctx[1]) {
    				set_input_value(input0, /*firstName*/ ctx[1]);
    			}

    			if (dirty & /*lastName*/ 4 && input1.value !== /*lastName*/ ctx[2]) {
    				set_input_value(input1, /*lastName*/ ctx[2]);
    			}

    			if (dirty & /*idCardNumber*/ 8 && input2.value !== /*idCardNumber*/ ctx[3]) {
    				set_input_value(input2, /*idCardNumber*/ ctx[3]);
    			}

    			if (dirty & /*resetForm, addGuest, guests, editingIndex, deleteGuest, editGuest*/ 497) {
    				each_value = /*guests*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let guests = JSON.parse(localStorage.getItem('guests')) || [];
    	let firstName = '';
    	let lastName = '';
    	let idCardNumber = '';
    	let editingIndex = -1;

    	function addGuest() {
    		if (firstName && lastName && idCardNumber) {
    			const newGuest = { firstName, lastName, idCardNumber };

    			if (editingIndex === -1) {
    				$$invalidate(0, guests = [...guests, newGuest]);
    			} else {
    				$$invalidate(0, guests[editingIndex] = newGuest, guests);
    				$$invalidate(4, editingIndex = -1);
    			}

    			localStorage.setItem('guests', JSON.stringify(guests));
    			resetForm();
    		} else {
    			alert('Please fill in all fields.');
    		}
    	}

    	function resetForm() {
    		$$invalidate(1, firstName = '');
    		$$invalidate(2, lastName = '');
    		$$invalidate(3, idCardNumber = '');
    		$$invalidate(4, editingIndex = -1);
    	}

    	function deleteGuest(index) {
    		if (index >= 0 && index < guests.length) {
    			guests.splice(index, 1);
    			localStorage.setItem('guests', JSON.stringify(guests));
    		} else {
    			console.error("Invalid index for deleting guest");
    		}
    	}

    	function editGuest(index) {
    		const guest = guests[index];
    		$$invalidate(1, firstName = guest.firstName);
    		$$invalidate(2, lastName = guest.lastName);
    		$$invalidate(3, idCardNumber = guest.idCardNumber);
    		$$invalidate(4, editingIndex = index);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		firstName = this.value;
    		$$invalidate(1, firstName);
    	}

    	function input1_input_handler() {
    		lastName = this.value;
    		$$invalidate(2, lastName);
    	}

    	function input2_input_handler() {
    		idCardNumber = this.value;
    		$$invalidate(3, idCardNumber);
    	}

    	const click_handler = () => addGuest();
    	const click_handler_1 = () => resetForm();
    	const click_handler_2 = index => editGuest(index);
    	const click_handler_3 = index => deleteGuest(index);

    	$$self.$capture_state = () => ({
    		guests,
    		firstName,
    		lastName,
    		idCardNumber,
    		editingIndex,
    		addGuest,
    		resetForm,
    		deleteGuest,
    		editGuest
    	});

    	$$self.$inject_state = $$props => {
    		if ('guests' in $$props) $$invalidate(0, guests = $$props.guests);
    		if ('firstName' in $$props) $$invalidate(1, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(2, lastName = $$props.lastName);
    		if ('idCardNumber' in $$props) $$invalidate(3, idCardNumber = $$props.idCardNumber);
    		if ('editingIndex' in $$props) $$invalidate(4, editingIndex = $$props.editingIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		guests,
    		firstName,
    		lastName,
    		idCardNumber,
    		editingIndex,
    		addGuest,
    		resetForm,
    		deleteGuest,
    		editGuest,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
