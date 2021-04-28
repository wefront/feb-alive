# feb-alive
![](https://img.shields.io/npm/l/feb-alive.svg)
![](https://img.shields.io/npm/v/feb-alive.svg?label=version)
![](https://img.shields.io/bundlephobia/minzip/feb-alive.svg)

[中文说明](https://github.com/wefront/feb-alive/blob/master/README.md)
## Vue Page level caching solution

Demo: [View example](http://101.132.119.190:9090/febalive)

![image](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/image/feb-alive.gif)

> Install
### NPM
```
npm i feb-alive -S
```

### Direct Download / CDN

```html
<script src="./dist/feb-alive.browser.js"></script>
```
On the browser side, you can use the variable `window.$febAlive` to access the package object

>Usage example
```
import febAlive from 'feb-alive'
import Router from 'vue-router'

// Rewrite history before router instantiation
febAlive.resetHistory()

const router = new Router(options)

Vue.use(febAlive, { router })
```
```
// App.vue
<template>
  <div id="app">
    <feb-alive>
      <router-view></router-view>
    </feb-alive>
  </div>
</template>
```
```
// Home.vue Support routing nesting, same as keep-alive
<template>
  <x-header />
  <feb-alive>
    <router-view></router-view>
  </feb-alive>
</template>
```

Vue.use(febAlive, options)

### options
| 属性 | 类型 | 介绍 |
| - | - | - |
| router | VueRouter | Route instance |
| keyName | string | Primary key used to cache pages，default: 'key' |
| isServer | boolean | Whether it is server-side rendering mode，default: false |
| maxPage | number | Maximum number of cached pages with feb-alive，default: 10 |
| beforeLocationChange | function | Intercept function before page jump |

**beforeLocationChange(route, cb)**
* `route` The route matched after executing $loaction.to or $loaction.replace
* `cb(true)` Execute VueRouter single page jump, call router.push and router.repalce respectively
* `cb(false)` Perform location jump, call location.href and location.replace respectively

### Route meta configuration
* disableCache: `boolean` Whether to turn off feb-alive cache，`default: false`
```
{
  meta: {
    disableCache: false
  }
}
```

## Static method

### resetHistory
* Initialize the Histroy API, because vue-router will rewrite history.state, it must be called before VueRouter is instantiated
```js
febAlive.resetHistory()
```

## Vue instance prototype method
### $location
* When the plugin is installed, the `$location` object will be mounted on the Vue prototype, and all the Vue component instance can be accessed through `this.$location`

**$location.to(location, [ native])**
* location: `string | object` The url that needs to be redirected can be an absolute path or a relative path. If native is false and the url is a relative path, the single-page route will be matched first, and location.replace will be used if it is not matched.

* native: `boolean` Whether to force the use of native location.href jump, default: `false`
```js
vm.$location.to('https://www.google.com',true)
vm.$location.to('/home')
vm.$location.to({
  path: '/home',
  query: {
    tag: 'wedoctor'
  }
})
```

**$location.replace(url, [ native])**
* url: `string` The url that needs to be redirected can be an absolute path or a relative path. If native is false and the url is a relative path, the single-page route will be matched first, and location.replace will be used if it is not matched.

* native: `boolean` Whether to force the use of native location.href jump, default: `false`

**$location.go(n)**
* same as `router.go(n)`

**$location.back()**
* same as `router.back()`

**$location.forward()**
* same as `router.forward()`

## Licence

feb-alive is licensed under the MIT License - see the [LICENSE](https://github.com/wefront/feb-alive/blob/master/LICENCE) file for details.
