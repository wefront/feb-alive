<template>
  <div class="page">
    <div class="page-content">
      <div class="loader" v-show="loading"></div>
      <ul class="page-list" v-show="!loading">
        <li class="page-item"
            v-for="(item, index) in list"
            :key="index"
            @click="hasRead(item, index)">
            {{item.content}}<span class="page-item--read" v-if="item.hasRead">✅</span>
        </li>
      </ul>
    </div>
    <p class="page-action">
      <button class="page-action--item" @click="nextPage">下一页</button>
    </p>
  </div>
</template>

<script>
import api from '../api/index'
export default {
  name: 'parentPage',
  data () {
    return {
      list: [],
      currentPage: 1,
      loading: true
    }
  },
  mounted () {
    // console.log(~~this.$route.params.id)
    this.getList()
  },
  activated () {
    console.log('call activated')
  },
  destroyed () {
    console.log('销毁了')
  },
  methods: {
    hasRead (item, index) {
      this.$set(item, 'hasRead', true)
      const page = ~~this.$route.params.id
      const id = (page - 1) * 10 + index + 1
      this.$router.push(`/article/${id}`)
    },
    getList () {
      this.loading = true
      const page = ~~this.$route.params.id
      this.currentPage = page
      api.joke.getJoke({
        page: page,
        pagesize: 10
      }).then(data => {
        this.loading = false
        // this.list = data.result.data
        this.list = data
      })
    },
    nextPage () {
      this.$router.push(`/parent/page/${this.currentPage + 1}`)
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.page-content {
  flex: 1;
}
.page-action {
  flex: 0 0 auto;
}
.page-item {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.page-item--read {
  position: absolute;
  top: 1px;
  right: 70px;
  color: #6dbe41;
}
.page-action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
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

.loader {
  position: relative;
  width: 2.5em;
  height: 2.5em;
  transform: rotate(165deg);
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0.5em;
  height: 0.5em;
  border-radius: 0.25em;
  transform: translate(-50%, -50%);
}
.loader:before {
  animation: before 2s infinite;
}
.loader:after {
  animation: after 2s infinite;
}

@keyframes before {
  0% {
    width: 0.5em;
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }
  35% {
    width: 2.5em;
    box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75),
      0 0.5em rgba(111, 202, 220, 0.75);
  }
  70% {
    width: 0.5em;
    box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75),
      1em 0.5em rgba(111, 202, 220, 0.75);
  }
  100% {
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }
}
@keyframes after {
  0% {
    height: 0.5em;
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }
  35% {
    height: 2.5em;
    box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75),
      -0.5em 0 rgba(233, 169, 32, 0.75);
  }
  70% {
    height: 0.5em;
    box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75),
      -0.5em 1em rgba(233, 169, 32, 0.75);
  }
  100% {
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }
}

.loader {
  position: absolute;
  top: calc(50% - 1.25em);
  left: calc(50% - 1.25em);
}
</style>
