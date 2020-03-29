<template>
    <div class="storehome">
      <search-bar></search-bar>
      <flap-card></flap-card>
      <scroll :top="scrollTop" @onScroll="onscroll" ref="scroll">
        <div>1111111111111111111</div>
        <div>1111111111111111111</div>
        <div>1111111111111111111</div>
        <div>1111111111111111111</div><div>1111111111111111111</div>
        <div>1111111111111111111</div><div>1111111111111111111</div>
        <div>1111111111111111111</div>
        <div>1111111111111111111</div><div>1111111111111111111</div>
        <div>1111111111111111111</div>
        <div>1111111111111111111</div>
      </scroll>
    </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar.vue'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    components: {
      Scroll,
      SearchBar,
      FlapCard
    },
    data () {
      return {
        scrollTop: 94
      }
    },
    methods: {
      onscroll(offsetY) { //该组件进行捕捉。并不处理
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

</style>
