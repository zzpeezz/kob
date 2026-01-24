<template>
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
  <div class="container"> <!-- container-fluid占满整个屏幕宽度,container固定宽度,居中显示 -->
    <router-link class="navbar-brand" :to="{name: 'home'}">King Of Bots</router-link> <!--href 就是告诉浏览器"点击这个链接后要去哪里-->
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
<!--active聚焦放到那个地方那个地方就变亮-->
<!--要用表达式前面需要加":"也就是v-bind的缩写-->
          <router-link :class="route_name == 'pk_index' ? 'nav-link active' :'nav-link' " aria-current="page" :to="{name: 'pk_index'}">对战</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'record_index' ? 'nav-link active' :'nav-link' " :to="{name: 'record_index'}">对局列表</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' :'nav-link' " :to="{name: 'ranklist_index'}">排行榜</router-link>
        </li>
      </ul>
     <ul class="navbar-nav" v-if="$store.state.user.is_login">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{$store.state.user.username}}
          </a>
          <ul class="dropdown-menu">
            <li><router-link class="dropdown-item" :to="{name: 'user_bot_index'}">我的Bot</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="logout">退出</a></li>
          </ul>
        </li>
      </ul>
      <ul class="navbar-nav" v-else>
        <li class="nav-item ">
          <router-link class="nav-link " :to="{name:'user_account_login'}" role="button" >
            登录
          </router-link>
        </li>
        <li class="nav-item ">
          <router-link class="nav-link " :to="{name:'user_account_register'}" role="button" >
            注册
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import { useRoute } from 'vue-router' // useRoute用于在 Vue 3 组件中获取当前路由信息。
import { computed } from 'vue';    //computed = 根据其他数据自动计算的值,实时计算某一个变量
import { useStore } from 'vuex';
export default {
    setup() {     //入口函数
      const store = useStore();
      const route = useRoute();  //先把useRoute取出来，实时返回当前Route的name是什么
      let route_name = computed(()=> route.name)

      const logout = () => {
            store.dispatch("logout");
      }

      return {
        route_name,
        logout,
      }
    }
}
</script>


<!-- scoped作用是在这里面写的css样式会加上一个随机字符串，使这个样式不会影响到我们这个组件以外的部分 -->
<style scoped> 
</style>