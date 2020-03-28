<template>
    <div class="ebook-bookmark">
      <div class="ebook-bookmark-text-wrapper">
        <div class="ebook-bookmark-down-wrapper">
          <span class="icon-down"></span>
        </div>
        <div class="ebook-bookmark-text">{{text}}</div>
      </div>
      <div class="ebook-bookmark-icon-wrapper">
        <book-mark :color="'red'" :width="15" :height="35"></book-mark>
      </div>
    </div>
</template>

<script>
import BookMark from '../common/BookMark'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  name: 'EbookBookmark',
  components: {
    BookMark
  },
  watch: {
    offsetY(v){//实现书签下拉算法
    }
  },
  data () {
    return {
      text: this.$t('book.pulldownAddMark')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200; // 注意菜单栏和标题栏的z-index设置，否则会被遮挡
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper{
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text{
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
}
</style>
