<template>
  <div class="ebook-slide-contents">
    <div class="slide-cotents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-search-input"
               v-model="searchText"
               @keyup.enter.exact="search()"
               type="text"
               :placeholder="$t('book.searchHint')"
                @click="showSearchPage">
      </div>
      <div class="slide-contents-search-cancel" v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-creator">
          <span class="slide-contents-book-creator-text">{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contens-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" v-show="!searchVisible"
            :top="156" :bottom="48" ref="scroll">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <span class="slide-contents-item-label" :class="{'selected': section === index}" :style="contentItemStyle(item)"
              @click="displayNavigation(item.href)">{{ item.label }}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item,index) in searchList" :key="index"
               v-html="item.excerpt"  @click="displayNavigation(item.cfi, true)">
      </div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import { px2rem } from '../../utils/utils'
export default {
  name: 'EbookSlideContents',
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },
  methods: {
    search () {
      // console.log('hahha')
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
            return item
          })
          // console.log(this.searchList)
        })
      }
    },
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(
          section => section.load(this.currentBook.load.bind(
            this.currentBook
          ))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
      ).then(results => Promise.resolve([].concat.apply([], results))) /* 将二维数组作为形参，逐一的传入concat中，达到降维的效果 */
    },
    displayNavigation (target, hightlist = false) {
      this.currentBook.rendition.display(target).then(() => {
        this.refreshLocation()
        if (hightlist) { // 文本高亮显示
          this.currentBook.rendition.annotations.highlight(target)
        }
        this.hideTitleAndMenu()
      })
    },
    contentItemStyle (item) { // 一级目录缩进
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    showSearchPage () {
      this.searchVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-slide-contents{
  width: 100%;
  font-size: 0;/*消除空格*/
  .slide-cotents-search-wrapper{
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper{
      flex: 1;
      @include center;
      .slide-contents-search-icon{
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input{
        flex: 1;
        width: 100%;
        height:px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel{
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper{
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper{
      flex: 0 0 px2rem(45);
      .slide-contents-book-img{
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper{
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title{
        /*width: px2rem(153.75);*/
        @include left;
        .slide-contents-book-title-text{
          @include ellipsis2(3);
        }
        font-size: px2rem(14);
        line-height: px2rem(16);
      }
      .slide-contents-book-creator{
        /*width: px2rem(153.75);*/
        font-size: px2rem(12);
        margin-top: px2rem(5);
        line-height: px2rem(16);
        box-sizing: border-box;
        @include left;
        .slide-contents-book-creator-text{ //在全屏的时候，用flex布局来实现自适应
          @include ellipsis2(1); /*省略时候，要指定宽度*/
        }
      }
    }
    .slide-contents-book-progress-wrapper{
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .slide-contens-book-progress{
        .progress{
          font-size: px2rem(14);
        }
        .progress-text{
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time{
        font-size: px2rem(12);
        margin-top: px2rem(10);
      }
    }
  }
  .slide-contents-list{
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .slide-contents-item{
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label{
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page{}
    }
  }
  .slide-search-list{
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item{
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
