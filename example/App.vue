<template>
  <div id="app">
    <feb-alive>
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
    </feb-alive>
  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
