<template>
    <div class="ebook-bookmark" ref="bookmark">
      <div class="ebook-bookmark-text-wrapper">
        <div class="ebook-bookmark-down-wrapper" ref="iconDown">
          <span class="icon-down"></span>
        </div>
        <div class="ebook-bookmark-text">{{text}}</div>
      </div>
      <div class="ebook-bookmark-icon-wrapper">
        <book-mark :color="color" :width="15" :height="35"></book-mark>
      </div>
    </div>
</template>

<script>
import BookMark from '../common/BookMark'
import { realPx } from '../../utils/utils'
import { ebookMixin } from '../../utils/mixin'

const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  name: 'EbookBookmark',
  mixins: [ebookMixin],
  components: {
    BookMark
  },
  computed: {
    height() {
      return realPx(35)
    },
    threshold() {
      return realPx(55)
    }

  },
  watch: {
    offsetY(v){//实现书签下拉算法，三个状态，下拉，吸顶，临界值，书签添加成功
      if (v >= this.height && v< this.threshold) {
        this.beforeThreshold(v) // z状态2
      } else if (v >= this.threshold) {
        this.afterThreshold(v) // z状态3
      } else if (v > 0 && v < this.height){ //状态1
        this.beforeHeight(v)
      } else if (v === 0) {
        this.restore()
      }
    }
  },
  methods: {
    restore() {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      },200) //书签归为操作，归为的时候，延迟200ms进行
    },
    beforeHeight(){ //状态1
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
      }
    },
    beforeThreshold(v) {
      //状态2：未到达临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHeight() //状态1和状态2代码重复部分
      //图标旋转
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    afterThreshold(v){
      //状态3： 超越临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.releasedownDeleteMark')
        this.color = WHITE
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
      }
      //图标旋转
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }
  },
  data () {
    return {
      text: '',    //根据下拉事件来进行优化
      color: WHITE //默认白色
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
