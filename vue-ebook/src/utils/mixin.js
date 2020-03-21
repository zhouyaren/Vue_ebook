import { mapGetters, mapActions } from 'vuex'
import { addCss, removeAllCss, themeList } from './book'
import { saveLocation } from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'hotSearchOffsetY',
      'flapCardVisible',
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'shelfCategory',
      'currentType'
    ]),
    themeList () { // 主题设置
      return themeList(this)
    }
    // 把computed 属性抽象出来，不仅是属性，还有方法，都可以这样进行操作，抽出来解耦
  },
  methods: {
    ...mapActions([
      'setMenuVisible',
      'setFileName',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    initGlobalStyle () { // 全局样式文件
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss('http://localhost:9001/theme/theme_default.css')
          break
        case 'Eye':
          addCss('http://localhost:9001/theme/theme_eye.css')
          break
        case 'Gold':
          addCss('http://localhost:9001/theme/theme_gold.css')
          break
        case 'Night':
          addCss('http://localhost:9001/theme/theme_night.css')
          break
        default:
          addCss('http://localhost:9001/theme/theme_default.css')
          break
      }
    },
    refreshLocation () { // 保存了阅读进度
      const currentLocation = this.currentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      saveLocation(this.fileName, startCfi)
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      this.setProgress(Math.floor(progress * 100))
      this.setSection(currentLocation.start.index)
    },
    display (target) { // 这个方法不知道为什么不能用
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
        })
      }
    }
    // 实现actions复用
  }
}
