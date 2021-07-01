<template>
  <div class="page-parent">
    <h3>我是父亲组件</h3>
    <router-link :to="`/tree-ancestor/tree-parent?t=${Date.now()}`">父亲组件同级跳转</router-link>
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
  name: 'TreeParent',
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped>
.page-parent {
  margin-top: 20px;
  padding: 20px;
  border: 4px solid #eb2f96;
}
.action {
  margin-right: 5px;
}
</style>
