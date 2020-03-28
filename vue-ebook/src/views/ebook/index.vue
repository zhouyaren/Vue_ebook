<template>
    <div class="ebook" ref="ebook">
        <ebook-reader></ebook-reader>
        <ebook-title></ebook-title>
        <ebook-menu></ebook-menu>
        <ebook-bookmark></ebook-bookmark>
        <ebook-header></ebook-header>
        <ebook-footer></ebook-footer>
    </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
// 把文件导入index.vue,名字是文件名，但是引用的时候是用挂载的 div 的 class名称
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
      offsetY (v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
  },
  methods: {
    restore () {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => { // 弹回去之后，就把transition清除。避免下拉不流畅
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move (v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)// 30s保存一次readTime
        }
      }, 1000)// 1s调用一次定时任务
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () { // 销毁之前终止定时任务
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 @import "../../assets/styles/global";
.ebook {
  position: absolute;
  top: 0; // 通过绝对定位，改变top的值，来实现整个界面的下拉
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
