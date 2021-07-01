<template>
  <div class="home">
    <h3>a, b页面切换demo</h3>
    <p>
      <router-link to="/a">体验</router-link>
    </p>
    <h3>动态路由demo</h3>
    <p>
      <router-link to="/page/1">体验</router-link>
    </p>
    <h3>嵌套路由</h3>
    <p>
      <router-link to="/tree-ancestor/tree-parent">体验</router-link>
    </p>
    <h3>多层嵌套路由</h3>
    <p>
      <router-link to="/tree-ancestor/tree-parent/tree-son">体验</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'PageHome',
};
</script>
<style>
.home {
  padding: 30px;
}
h3 {
  text-align: center;
  margin-top: 20px;
}
p {
  text-align: center;
  margin-top: 10px;
}
</style>

