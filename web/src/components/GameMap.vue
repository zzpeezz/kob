<template>
  <div ref="parent" class="gamemap"> <!--这样我们的parent就能指向div了-->
        <canvas ref="canvas" tabindex="0">  <!--tabindex="0"就可以输入用户操作了-->

        </canvas>
  </div>
</template>

<script>
import { GameMap } from '@/assets/scritps/GameMap';
import { ref, onMounted } from 'vue'; //onMounted是当我们组件挂载完之后需要执行那些操作
export default {
     setup() {
        let parent = ref(null);
        let canvas = ref(null);


        onMounted(() =>{
            new GameMap(canvas.value.getContext('2d'), parent.value) //创建一个新的对象同时传构造函数的参数

        });
            
        
        return {
            parent,
            canvas,
        }
     }
}
</script>

<style scoped>

div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;  /* 居中*/
    justify-content: center;/* 水平居中*/
    align-items: center;    /* 竖直居中*/
}
</style>