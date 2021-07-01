<template>
  <div class="page-son">
    <h3>我是子组件</h3>
    <router-link :to="`/tree-ancestor/tree-parent/tree-son?t=${Date.now()}`">子组件同级跳转</router-link>
    <h4>计数：{{ count }}</h4>
    <div>
      <button class="action" @click="count += 1">增加</button>
      <button class="action" @click="count -= 1">减少</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeSon',
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped>
.page-son {
  padding: 20px;
  margin-top: 20px;
  border: 4px solid #1890ff;
}
.action {
  margin-right: 5px;
}
</style>
