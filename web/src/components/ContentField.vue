<template>
    <div class="container content-field"> <!--content-field是自定义的 CSS 类名，在style里定义这个类的样式-->
        <div class="card">
            <div class="card_body">
                <slot></slot>      <!--填充的内容放到slot里-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.content-field {
    margin-top: 20px;
    
}

</style>