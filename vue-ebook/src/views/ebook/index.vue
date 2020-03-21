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
export default {
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 @import "../../assets/styles/global";
</style>
