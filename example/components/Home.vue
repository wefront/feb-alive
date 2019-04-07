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
  </div>
</template>

<script>
export default {
  
}
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

