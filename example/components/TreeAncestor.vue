<template>
  <div class="page-ancestor">
    <h3>我是祖先组件</h3>
    <router-link :to="`/tree-ancestor?t=${Date.now()}`">祖先组件同级跳转</router-link>
    <h4>计数：{{ count }}</h4>
    <div>
      <button class="action" @click="count += 1">增加</button>
      <button class="action" @click="count -= 1">减少</button>
    </div>

    <feb-alive>
      <router-view></router-view>
    </feb-alive>
  </div>
</template>

<script>
export default {
  name: 'TreeAncestor',
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped>
.page-ancestor {
  text-align: center;
}
.action {
  margin-right: 5px;
}
</style>
