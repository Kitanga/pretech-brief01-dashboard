import Vue from 'vue';

// Import components
import './Views/Login.js';

const vm = new Vue({
    el: "#app",
    data:  {
        // return {
            view: {
                login: true
            },
            username: '',
            password: '',
            loginDetails: {
                username: 'admin',
                password: 'develop'
            }
        // };
    },
    methods: {
        signin: function() {
            if (this.username === this.loginDetails.username && this.password === this.loginDetails.password) {
                console.log("You signed in, yay!!");
            } else {
                console.error("Your signin details are incorrect");
            }
        }
    }
});