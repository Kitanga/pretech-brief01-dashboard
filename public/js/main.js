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
    template: `
    <div id="login" v-if="shouldshow">
        <h2>Semi<br/>Exciting<br/>Games</h2>
        <form action="#" v-on:keyup.enter="signin">
            <div class="input-container">
                <label for="username"><i class="fas fa-user-tie"></i></label>
                <input type="text" v-model="username" placeholder="Username" id="username" autofocus/>
            </div>
            <div class="input-container">
                <label for="password"><i class="fa fa-lock"></i></label>
                <input type="password" v-model="password" placeholder="Password" id="password"/>
            </div>
            <div class="btn submit" v-on:click="signin">Login</div>
        </form>
    </div>`
});

Vue.component('loader', {
    template: `<div id="loader"></div>`
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