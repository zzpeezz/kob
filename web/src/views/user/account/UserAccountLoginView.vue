<template>
        <ContentField>  <!--对局列表就会渲染到slot里-->
            <div class="row justify-content-md-center">
                <div class="col-3">
                    <form @submit.prevent="login">  <!--提交的话就触发,阻止默认行为-->
                        <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                        </div>
                        <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                        </div>
                        <div class="error_message">{{ error_message }}</div>
                        <button type="submit" class="btn btn-primary">登录</button>
                    </form>
                </div>
            </div>
        </ContentField> 
</template>

<script>
import ContentField from '@/components/ContentField.vue';
import { useStore } from 'vuex';
import { ref }  from 'vue';
import router from '@/router/index';

export default {
    components: {
        ContentField,
    },
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');

        
        const login = () => {  //触发函数
            error_message.value = "";
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getinfo", {
                        success() {
                            router.push({ name: 'home'});
                            console.log(store.state.user);

                        }
                    })

                },
                error() {
                    error_message.value = "用户名或密码错误";
                },
            })
        }

        return {
            username,
            password,
            error_message,
            login,

        }
    }
}
</script>


<style scoped>

button {
    width: 100%;
}

div.error_message {
    color: red;
}
</style>