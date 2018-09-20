// Util
function showLoader(callback) {
    const loader = $('#loader');

    loader.removeClass('hidden');

    // When all that is done, first check if the callback has been set, if so invoke it
    callback ? callback() : 'Do nothing';
}

function hideLoader(callback) {
    const loader = $('#loader');

    loader.addClass('hidden');

    // When all that is done, first check if the callback has been set, if so invoke it
    callback ? callback() : 'Do nothing';
}

function auth_isLoggedIn(next, to) {
    const loggedIn = localStorage.getItem('loggedIn');

    // Simple auth sytem, redirects to dash if the user is logged in
    return !!loggedIn;
}

// Single page app

Vue.use(VueRouter);
console.log('hi');
const login = {
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
    watch: {
        "$route"(to, from) {
            console.log(to, from);
        }
    },
    methods: {
        signIn: function () {
            if (this.username === this.loginDetails.username && this.password === this.loginDetails.password) {
                showLoader();
                setTimeout(() => {
                    localStorage.setItem('loggedIn', true);
                    this.$router.push('/dashboard');
                    hideLoader();
                    // console.log("Changed data:", this.$parent.view, this);
                }, 1000);
            }
        },
        siginOut: function () {
            showLoader();
            localStorage.removeItem('loggedIn');
            this.$router.push('/login');
        }
    },
    props: ['view'],
    template: `
    <div id="login">
        <h2>Semi<br/>Exciting<br/>Games</h2>
        <form action="#" v-on:keyup.enter="signIn">
            <div class="input-container">
                <label for="username"><i class="fas fa-user-tie"></i></label>
                <input type="text" v-model="username" placeholder="Username" id="username" autofocus/>
            </div>
            <div class="input-container">
                <label for="password"><i class="fa fa-lock"></i></label>
                <input type="password" v-model="password" placeholder="Password" id="password"/>
            </div>
            <div class="btn submit" v-on:click="signIn">Login</div>
        </form>
    </div>`
};

const dash = {
    /* data: function() {
        return {};
    }, */
    methods: {},
    props: ['view'],
    template: `<div id="dash">hello?</div>`
};

Vue.component('loader', {
    template: `<div id="loader"></div>`
});

const routes = [{
        path: '/',
        beforeLeave(to, from, next) {
            showLoader();
            next();
        },
        beforeEnter(to, from, next) {
            hideLoader();
            var isLoggedIn = auth_isLoggedIn();

            if (isLoggedIn) {
                next('/dashboard');
            } else {
                next('/login');
            }
            next();
        }
    },
    {
        path: '/login',
        component: login,
        beforeLeave(to, from, next) {
            showLoader();
            next();
        },
        beforeEnter(to, from, next) {
            hideLoader();
            var isLoggedIn = auth_isLoggedIn();

            if (isLoggedIn) {
                next('/dashboard');
            } else {
                next();
            }
        }
    },
    {
        path: '/dashboard',
        component: dash,
        beforeLeave(to, from, next) {
            showLoader();
            next();
        },
        beforeEnter(to, from, next) {
            hideLoader();
            var isLoggedIn = auth_isLoggedIn();

            if (!isLoggedIn) {
                next('/login');
            }
            next();
        }
    },
    {
        path: '*',
        component: {
            template: `<div id="404">That link doesn't exist</div>`
        },
        beforeEnter(to, from, next) {
            hideLoader();
            next();
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes
});

const vm = new Vue({
    data: function () {
        return {
            view: 'login'
        };
    },
    methods: {
        goBack() {
            window.history.length > 1 ?
                this.$router.go(-1) :
                this.$router.push('/');
        },
        createChart(chartId, chartData, callback = chart => {}) {
            const ctx = document.getElementById(chartId);
            const myChart = new Chart(ctx, {
                type: chartData.type,
                data: chartData.data,
                options: chartData.options,
            });
            callback(myChart);
        }
    },
    router
}).$mount('#app');

window.onload = () => {
    $('#loader').addClass('hidden');
};