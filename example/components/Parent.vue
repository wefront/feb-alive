<template>
  <div>
    <h1>我是Parent页面</h1>
    <p>count: {{count}}</p>
    <button @click="count+=1">add</button>
    <feb-alive>
      <router-view></router-view>
    </feb-alive>
  </div>
</template>

<script>
export default {
  name: 'parent',
  data () {
    return {
      count: 0
    }
  },
  deactivated () {
    console.log('parent deactivated')
  },
  destroyed () {
    console.log('parent destroyed')
  }
}
</script>
