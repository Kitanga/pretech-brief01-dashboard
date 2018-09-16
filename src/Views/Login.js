import Vue from 'vue';

export default Vue.component('login', {
    props: ['shouldshow', 'username', 'password', 'signin'],
    template: `<div id="login" v-if="shouldshow">
        stuff goes here
    </div>`
});