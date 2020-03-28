<template>
  <div class="ebook-reader">
      <div id="read"></div>
    <div class="ebook-reader-mask"
    @click="onMaskClick"
    @touchmove="move"
    @touchend="End"
    @mousedown.left="onMouseEnter"
    @mousemove.left="onMouseMove"
    @mouseup.left="onMouseEnd"></div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Epub from 'epubjs'
import {
  saveFontfamily,
  getFontFamily,
  saveFontSize,
  getFontSize,
  getTheme,
  saveTheme,
  getLocation
  // saveLocation
} from '../../utils/localStorage'
import { flatten } from '../../utils/book'
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  methods: {
    // 1- 鼠标进入
    // 2- 鼠标进入后的移动
    // 3- 鼠标从移动状态松手
    // 4- 鼠标还原
    onMouseEnd(e){
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4 //点击了一下，没有进行移动，松开也被认为是可以处理的
      }
      const time = e.timestamp - this.mouseStartTime
      if (time < 100) {
        this.mouseState = 4 //如果稍微了一点移动，但是时间非常短，则判定为是点击事件
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e){
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offSetY = 0
        if (this.firstOffsetY) {
          offSetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offSetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnter(e){
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp //获取事件开始时间
      e.preventDefault()
      e.stopPropagation()
    },
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else { // firstOffsetY不存在则把刚开始的点放在 e.changedTouches[0].clientY
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()  //禁用原来的方法
      e.stopPropagation()
    },
    End (e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    onMaskClick (e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)){
        return
      }
      const offsetx = e.offsetX
      const width = window.innerWidth
      if (offsetx > 0 && offsetx < 0.3 * width) {
        this.prevPage()
      } else if (offsetx > 0 && offsetx > 0.7 * width) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontSize () {
      var fontsize = getFontSize(this.fileName)
      if (!fontsize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontsize + 'px')
        this.setDefaultFontSize(fontsize)
      }
    },
    initFontFamily () {
      var font = getFontFamily(this.fileName)
      if (!font) {
        saveFontfamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initTheme () {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(defaultTheme) // 样式初始化成功
    },
    initRendition () {
      this.rendition = this.book.renderTo('read', { // 电子书渲染
        width: innerWidth,
        height: innerHeight,
        methods: 'default'
      })
      const location = getLocation(this.fileName)
      this.rendition.display(location).then(() => { // 初始化渲染页面
        this.initTheme()
        this.initFontSize()
        this.initFontFamily()
        this.initGlobalStyle()
        this.refreshLocation()
        this.parseBook()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {
          console.log('字体加载完毕')
        })
      })
    },
    initGesture () {
      // 实现手势操作，绑定touchStart 和 touchEnd
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        // 小于 500ms.大于 40
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault() // 禁用原来的方法
        event.stopPropagation() // 禁止原来的事件传播
      })
    },
    parseBook () { // 获取封面的图片链接和图书基本信息
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadate => {
        this.setMetadata(metadate)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find (item, level = 0) {
          if (!item.parent) {
            return level
          } else {
            return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub () {
      const url = 'http://localhost:9001/epub/' + this.fileName + '.epub'
      console.log(url)
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture() // 待会要删除这个方法
      this.book.ready.then(() => {
        // 简单的分页
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName / 16)))
      }).then(locations => {
        this.setBookAvailable(true)
        this.refreshLocation()// 重新加载时，分页完成之后，仍然要刷新一下location
      })
    }
  },
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    console.log(fileName)
    this.setFileName(fileName).then(() => {
      this.initEpub()// 获取连接
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 @import "../../assets/styles/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
