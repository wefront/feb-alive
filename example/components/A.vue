<template>
  <div>
    <h1>我是A页面</h1>
    <p>count: {{count}}</p>
    <p class="page-action">
      <button class="page-action--item" @click="count += 1">增加</button>
    </p>
    <p class="page-link">
      <router-link to="/b">前往B页面</router-link>
      <!-- <div @click="goB">前往B页面</div> -->
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 0
    }
  },
  methods: {
    goB () {
      this.$router.replace('/b')
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
}
p {
  text-align: center;
}
.page-action {
  margin-top: 30px;
  /* position: fixed;
  bottom: 100px; */
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
.page-link {
  margin-top: 50px;
}
</style>
