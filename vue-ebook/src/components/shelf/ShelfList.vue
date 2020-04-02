<template>
  <div class="shelf-list">
    <div class="shelf-list-item-wrapper" v-for="item in shelfList" :key="item.id">
      <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
      <div class="shelf-list-title-wrapper">
        <span class="shelf-list-title title-small">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx } from '../../utils/utils'
//通过 list这个组件中，用v-for循环创建 一堆的item,然后在item组件中通过动态组件来显示3中不同的组件
  export default {
    name: 'ShelfList',
    mixins:[storeShelfMixin],
    components:{
      ShelfItem
    },
    computed: {
      itemHeight(){
        //  w/ 250 = height / 350
         // h = w / 250 * 350
          return ((window.innerWidth - realPx(120)) / 3 ) / 250 * 350 + 'px'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
.shelf-list{
  position: absolute;
  top: px2rem(94);
  left: 0;
  z-index: 100;
  flex-flow: row wrap; //wrap使得组件可以换行
  width: 100%;
  display: flex;
  padding: 0 px2rem(15);
  box-sizing: border-box;
  .shelf-list-item-wrapper{
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: px2rem(15);
    box-sizing: border-box;
    .shelf-list-title-wrapper{
      margin-top: px2rem(10);
    }
  }
}
</style>
