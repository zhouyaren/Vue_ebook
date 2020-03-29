<template>
    <div class="storehome">
      <search-bar></search-bar>
    </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar.vue'
  export default {
    name: 'StoreHome',
    components: {
      SearchBar
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

</style>
