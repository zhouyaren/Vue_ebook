<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ $t('shelf.title') }}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{ selectedText }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="clearCache">
        <span class="shelf-title-btn-text">{{ $t('shelf.clearCache') }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span class="shelf-title-btn-text" @click="onEditClick">{{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfTitle',
    mixins:[storeShelfMixin],
    computed: {
      selectedText(){
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        if (selectedNumber <= 0){
          return this.$t('shelf.selectBook')
        } else if(selectedNumber === 1){
          return this.$t('shelf.haveSelectedBook').replace('$1',selectedNumber)
        } else {
          return this.$t('shelf.haveSelectedBooks').replace('$1',selectedNumber)
        }
      }
    },
    watch:{
      offsetY(offsetY){
        // console.log(offsetY)
        // console.log(offsetY)
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data() {
      return {
        ifHideShadow: true  //默认隐藏阴影
      }
    },
    methods:{
      onEditClick(){
        if(!this.isEditMode){
          this.setShelfSelected([])
          this.shelfList.forEach(item => {item.selected = false})
        }
        this.setIsEditMode(!this.isEditMode)
      },
      clearCache(){
        alert('clear Cache')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
.shelf-title{
  position: relative;
  z-index: 130;
  width: 100%;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.1);
  &.hide-shadow{
    box-shadow: none;
  }
  .shelf-title-text-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnTop;
    .shelf-title-text{
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text{
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper{
    position: absolute;
    top:0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .shelf-title-btn-text{
      font-size: px2rem(14);
      color: #666;
    }
    &.shelf-title-left{
      left:0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right{
      right: 0;
      padding-right: px2rem(15);
    }
  }

}
</style>
