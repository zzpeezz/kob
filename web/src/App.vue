<!-- 主页 -->
<template>
  <!-- 这里用组件 -->
  <NavBar /><!-- 导航栏 -->

  <router-view/><!-- 自动根据我们的网址来变 -->
</template>

<script> 
// 导入组件
import NavBar from './components/NavBar.vue'; //想用这个组件就把它放到一个关键字里
import "bootstrap/dist/css/bootstrap.min.css";//导入bootstrap的依赖css和js
import "bootstrap/dist/js/bootstrap";
//import $ from 'jquery';
export default {
    //这里放组件
    components: {
      NavBar,
    },
    setup() {
      // $.ajax({
      //   url: "http://localhost:3000/user/account/token/",
      //   type: "post",
      //   data: {
      //     username: 'zzp',
      //     password: "789",
      //   },
      //   success(resp) {
      //     console.log(resp);
      //   },
      //   error(resp) {
      //     console.log(resp);
      //   }
      // });
      // $.ajax({
      //   url: "http://localhost:3000/user/account/register/",
      //   type: "post",
      //   data: {
      //     username: "zzpeezz",
      //     password: "1234",
      //     confirmPassword: "1234",
      //   },
      //   success(resp) {
      //     console.log(resp);
      //   },
      //   error(resp) {
      //     console.log(resp);
      //   }

      // });
    }
  
}
</script>

<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>
