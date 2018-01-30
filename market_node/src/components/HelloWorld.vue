<template>
  <div class="hello">
    <input class="form-control" id="inputEmail3" placeholder="请输入账号" v-model="account">
    <input type="password" class="form-control" id="inputPassword3" placeholder="请输入密码" v-model="password">
    <button type="submit" class="btn btn-default" @click="login">登录</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      account:'',
      password:''
    }
  },
  methods: {
    login: function() {
      
    }
  },
  created: function() {
    this.$http.get('/getTest').then(function(resp) {
      console.log(resp);
    }, function(err) {
      console.log(err);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
