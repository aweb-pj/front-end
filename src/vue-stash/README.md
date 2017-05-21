# vue-stash

A [Vue.js](http://vuejs.org) plugin that makes it easy to share reactive data between components.

## Installation

##### 1.) Install package via NPM

```
$ npm install vue-stash
```

##### 2.) Install plugin within project.
```js
import Vue from 'vue';
import VueStash from 'vue-stash';

Vue.use(VueStash)
```

or

```js
window.Vue = require('vue');
require('vue-stash');
```

## Usage

##### 1.) Initialize your stash object.
Your stash object is nothing more than a simple Javascript object set within your root vue model's `$data` option; Think of it as your "shared data option". Make sure you pre-initialize any properties that you want to be reactive, just like always.

```js
new Vue({
    el: '#app',
    data: {
        stash: {
            user: {
                name: 'cody'
            }
        }
    }
})
```

_Alternatively, you can import your stash from another file._
```js
import stash from './stash';

new Vue({
    el: '#app',
    data: { stash }
})
```

_stash.js_
```js
export default {
    user: {
        name: 'cody'
    }
}
```

##### 2.) Add a "stash" option to any child components that need to access data from the stash.

*Example 1: Simplest usage*
```js
Vue.component('user-card', {
    stash: ['user'],
    ready() {
        console.log(this.user.name); // 'cody'
        this.user.name = 'john doe';
        console.log(this.user.name); // 'john doe'
    }
});
```

*Example 2: Object stash*

```js
Vue.component('user-card', {
    stash: {
        user: 'user'
    },
    ready() {
        console.log(this.user.name); // 'cody'
        this.user.name = 'john doe';
        console.log(this.user.name); // 'john doe'
    }
});
```

*Example 3: Access nested stash property*

```js
Vue.component('user-card', {
    stash: {
        name: 'user.name'
    },
    ready() {
        console.log(this.name); // 'cody'
        this.name = 'john doe';
        console.log(this.name); // 'john doe'
    }
});
```

*Example 4: Dynamic stash access*

```js
Vue.component('user-card', {
    stash: {
        name() {
            return 'user.name';
        }
    },
    ready() {
        console.log(this.name); // 'cody'
        this.name = 'john doe';
        console.log(this.name); // 'john doe'
    }
});
```

*Note: The end result of examples 1-4 are equivalent.*

##### 3.) Access the stash directly.
This plugin sets `Vue.prototype.$stash` which allows any component to access the stash via `vm.$stash`.
```js
Vue.component('user-card', {
    ready() {
        console.log(this.$stash.user.name); // 'cody';
        this.$stash.user.name = 'john doe';
        console.log(this.$stash.user.name); // 'john doe';
    }
});
```

## Demo
If you'd like to demo `vue-stash` try [vue-mix](https://github.com/cklmercer/vue-mix)

## License

[MIT](http://opensource.org/licenses/MIT)
