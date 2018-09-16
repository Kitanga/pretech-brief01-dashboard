const login = Vue.component('login', {
    data: function () {
        return {
            username: '',
            password: '',
            loginDetails: {
                username: 'admin',
                password: 'develop'
            }
        }
    },
    methods: {
        signin: function () {
            if (this.username === this.loginDetails.username && this.password === this.loginDetails.password) {
                console.log("You signed in, yay!!");
            } else {
                console.error("Your signin details are incorrect");
            }
        }
    },
    props: ['shouldshow'],
    template: `<div id="login" v-if="shouldshow">
        <form action="#" v-on:submit="signin">
            <h2>Login</h2>
            <div class="input-container">
                <i class="fas fa-user-tie fa-2x"></i>
                <input type="text" v-model="username" id="username"/>
            </div>
            <div class="input-container">
                <i class="fa fa-lock fa-2x"></i>
                <input type="text" v-model="password" id="password"/>
            </div>
            <div class="btn submit">Login</div>
        </form>
    </div>`
});

const vm = new Vue({
    el: '#app',
    data: function () {
        return {
            view: {
                login: true
            }
        };
    }
});