import stashAccessor from './stash-accessor';

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    // Register a helper prototype property for stash access.
    Object.defineProperty(Vue.prototype, '$stash', {
        get() {
            return this.$root.stash;
        }
    });

    // Register a global mixin to manage the getters/setters for our stash.
    Vue.mixin({

        /**
         * The 'beforeCreate' life-cycle hook for Vue 2.0
         * 
         * @return {void}
         */
        beforeCreate() {
            registerstash(this)
        },

        /**
         * The 'init' life-cycle hook for Vue 1.0
         *
         * @return {void}
         */
        init() {
            registerstash(this)
        },
    });
}

function registerstash(vm) {
    // 1.) Check for a stash "option" on the component.
    // 2.) Check for a stash "object" on the root vue model.
    if (typeof vm.$options.stash !== 'undefined' && typeof vm.$root.stash !== 'undefined') {

        // Initialize the computed option if it hasn't already been initialized.
        if (typeof vm.$options.computed === 'undefined') {
            vm.$options.computed = {};
        }

        // Check if the stash option is a non-empty array.
        if (Array.isArray(vm.$options.stash)) {
            // Loop through the elements of the "stash" option.
            vm.$options.stash.forEach(property => {
                // Create a computed property using our stashAccessor helper class.
                vm.$options.computed[property] = new stashAccessor(property);
            });
        } else {
            // Loop through the stash options.
            for (var key in vm.$options.stash) {
                if (typeof vm.$options.stash[key] == 'function') {
                    // Handle a function
                    vm.$options.computed[key] = new stashAccessor(vm.$options.stash[key]());
                } else if (typeof vm.$options.stash[key] == 'string') {
                    // Handle a string
                    vm.$options.computed[key] = new stashAccessor(vm.$options.stash[key]);
                }
            }
        }
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;
