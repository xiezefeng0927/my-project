<template>
  <div class="cart">
      <div class="content">
          <div class="content-left">
              <div class="logo-wrapper">
                  <div class="logo">
                      <span class="icon-shopping_cart"></span>
                  </div>
              </div>
              <div class="price"></div>
              <div class="desc"></div>
          </div>
          <div class="content-right"></div>
      </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.cart
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    height: 46px
    z-index: 50
    background: #888
    .content
        display: flex
        background: #141d27
        .content-left
            flex: 1
            font-size: 0
            .logo-wrapper
                display: inline-block
                position: relative
                top: -10px
                margin: 0 12px
                padding: 6px
                width: 56px
                height: 56px
                box-sizing: border-box
                vertical-align: top
                border-radius: 50%
            .price
                display: inline-block
            .desc
                display: inline-block
        .content-right
            flex: 0 0 105px
            width: 105px
</style>


