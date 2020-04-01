<template>
    <transition name="slide-down">
        <div class="title-wrapper" v-show="menuVisible">
             <div class="left">
                <span class="icon-back" @click="back"></span>
             </div>
             <div class="right">
                 <div class="icon-wrapper">
                    <span class="icon-shelf"></span>
                 </div>
                 <div class="icon-wrapper">
                    <span class="icon-cart"></span>
                 </div>
                 <div class="icon-wrapper">
                    <span class="icon-more"></span>
                </div>
             </div>
        </div>
    </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  // mixins中的内容与当前的内容进行混合
  methods: {
    back () {
      console.log('back')
      this.$router.go(-1)
    }
  },
  components: {
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 @import "../../assets/styles/global";

.title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 250;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) rgba(0,0,0,0.15);
    .left {
        flex: 0 0 px2rem(60);
        @include center;
        .icon-back{
            font-size: px2rem(22);
        }
    }
    .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .icon-wrapper {
            flex: 0 0 px2rem(40);
            @include center;
            .icon-cart {
             font-size: px2rem(22);
            }
            .icon-shelf {
                font-size: px2rem(22);
            }
            .icon-more {
                font-size: px2rem(22);
            }
        }
    }
}
</style>
