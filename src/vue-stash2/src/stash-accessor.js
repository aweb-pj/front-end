export default function(key) {
    return {
        get() {
            return key.split('.').reduce((pValue, cValue) => {
                return pValue[cValue];
            }, this.$root.stash)
        },

        set(value) {
            var path = key.split('.');
            var length = path.length - 1;
            var stash = this.$root.stash;

            for (var i = 0; i < length; i++) {
                if (stash.hasOwnProperty(path[i])) {
                    stash = stash[path[i]];
                }
            }

            stash[path[i]] = value;
        }
    }
}