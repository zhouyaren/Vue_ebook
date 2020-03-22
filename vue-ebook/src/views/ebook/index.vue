<template>
    <div class="ebook">
        <ebook-reader></ebook-reader>
        <ebook-title></ebook-title>
        <ebook-menu></ebook-menu>
    </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
// 把文件导入index.vue,名字是文件名，但是引用的时候是用挂载的 div 的 class名称
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
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
</style>
