<template>
  <div class="page-parent--wrap">
    <div class="page-parent">
      <h1>我是Parent页面</h1>
      <p>count: {{count}}</p>
      <p class="page-action">
        <button class="page-action--item" @click="count += 1">增加</button>
      </p>
    </div>
    <div class="page-son">
      <feb-alive>
        <router-view></router-view>
      </feb-alive>
    </div>
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

<style scoped>
.page-parent--wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.page-parent {
  flex: 0 0 auto;
}
.page-son {
  flex: 1;
}
.page-action {
  margin-top: 30px;
  width: 100%;
  text-align: center;
}
.page-action--item {
  display: inline-block;
  width: 120px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  background: #3f86ff;
  border: none;
  border-radius: 5px;
  outline: none;
}
</style>
