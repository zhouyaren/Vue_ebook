<template>
  <div class="ebook-reader">
      <div id="read"></div>
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
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  methods: {
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
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
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
    initEpub () {
      const url = 'http://localhost:9001/epub/' + this.fileName + '.epub'
      console.log(url)
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
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
</style>
