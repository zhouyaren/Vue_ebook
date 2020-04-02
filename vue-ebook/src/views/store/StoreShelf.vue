<template>
    <div class="store-shelf">
      <shelf-title></shelf-title>
      <scroll class="store-shelf-scroll-wrapper"
              :top="0"
              @onScroll="onscroll"
              :bottom="scollBottom"
              ref="scroll">
        <shelf-search></shelf-search>
        <shelf-list></shelf-list>
        <shelf-footer></shelf-footer>
      </scroll>
    </div>
</template>

<script>
  import ShelfFooter from '../../components/shelf/ShelfFooter'


  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import { shelf } from '../../api/store'
  import ShelfList from '../../components/shelf/ShelfList'
  import { appandAddToShelf } from '../../utils/store'

  export default {
    name: 'StoreShelf',
    mixins:[storeShelfMixin],
    components:{
      ShelfSearch,
      Scroll,
      ShelfTitle,
      ShelfList,
      ShelfFooter
    },
    watch:{
      isEditMode(isEditMode){
        this.scollBottom = isEditMode ? 48 : 0
        this.$nextTick(()=> {  //等界面显示完成之后，在刷新scroll组件
          this.$refs.scroll.refresh()
        })
      }
  },
    data(){
      return{
        scollBottom: 0
      }
    },
    methods:{
      onscroll(offsetY){
        this.setOffsetY(offsetY)
      },
      getShelfList(){
        shelf().then(response => {
          if(response.status === 200 && response.data && response.data.bookList){
            this.setShelfList(appandAddToShelf(response.data.bookList))
          }
        })
      }
    },
    mounted () {
      this.getShelfList()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
.store-shelf{
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-scroll-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}
</style>
