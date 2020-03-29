<template>
    <div class="storehome">
      <search-bar></search-bar>
      <scroll :top="94" @onScroll="onscroll">
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
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    components: {
      Scroll,
      SearchBar
    },
    methods: {
      onscroll(offsetY) { //该组件进行捕捉。并不处理
        this.setOffsetY(offsetY)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

</style>
