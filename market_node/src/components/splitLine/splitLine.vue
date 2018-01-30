<template>
  <div class="line" :style="{height: height + 'px'}"></div>
</template>

<script>
    export default {
      props: {
        height: {
          type: Number,
          default: 10
        }
      },
      data: function() {
        return {

        }
      }
    }
</script>

<style scoped lang="stylus">

  .line
    width: 100%
    position: relative
    background-color: rgba(77,85,93,.2)
    &::before, &::after
      display: block
      width: 100%
      border-top: 1px solid rgba(7,17,27,0.1)
      content: ''
      position: absolute
    &::before
      top: 0
    &::after
      bottom: 0
</style>
