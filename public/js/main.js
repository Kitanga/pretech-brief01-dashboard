// Util
/**
 * Show the loader spinner element
 * @param {function()} callback Run when the loader has been shown
 */
function showLoader(callback) {
    const loader = $('#loader');

    loader.removeClass('hidden');

    // When all that is done, first check if the callback has been set, if so invoke it
    callback ? callback() : 'Do nothing';
}

/**
 * Hide the loader spinner element
 * @param {function()} callback Run when the loader has been hidden
 */
function hideLoader(callback) {
    const loader = $('#loader');

    loader.addClass('hidden');

    // When all that is done, first check if the callback has been set, if so invoke it
    callback ? callback() : 'Do nothing';
}

/**
 * Check if the user is logged in.
 * @returns {boolean}
 */
function auth_isLoggedIn() {
    const loggedIn = localStorage.getItem('loggedIn');

    // Simple auth sytem, redirects to dash if the user is logged in
    return !!loggedIn;
}

/**
 * Creates an array of numbers
 * 
 * @param {number} length The length you want the array to be
 * @returns {number[]}
 */
function newArray(length) {
    return (new Array(length)).fill(0);
}

/**
 * AJAX file loader. Uses GET to retrieve a file from server
 *
 * @param {string} link The link, relative to host of file
 * @returns {Promise}
 */
function loadData(link) {
    return new Promise((resolve, reject) => {
        // 
        function reqListener() {
            // console.log(JSON.stringify(this.responseText));
            resolve(JSON.parse(this.responseText));
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.addEventListener("error", reject);
        oReq.open("GET", link);
        oReq.send();
    });
}

/**
 * Creates a new chart using ChartJS
 *
 * @param {string} chartId The CSS selector string that points to a canvas
 * @param {Chart.ChartConfiguration} chartData The chart config object
 * @param {function(Chart)} [callback=chart => {}] An optional callback that runs after the chart has been created. Receives created chart as only param
 * @returns {Chart}
 */
function createChart(chartId, chartData, callback = chart => {}) {
    const ctx = document.querySelector(chartId);
    const myChart = new Chart(ctx, chartData);
    callback(myChart);
    return myChart;
}

/**
 * Create all the ChartJS charts and add them to the charts array
 *
 */
function createAllCharts() {
    // Generate all the config setups
    const config = chartData();

    charts.push(createChart('.sales-total canvas', config.salesTotal));
    charts.push(createChart('.sales-reps-compare canvas', config.salesCompare));
    charts.push(createChart('.orders canvas', config.orders));
    charts.push(createChart('.yearly canvas', config.yearSalesPerformance));
}

/**
 * Update the charts' data and then visually update them as well
 *
 */
function updateCharts() {
    const config = chartData();

    // Used to count how many steps we've taken
    let counter = 0;

    // For-in loop through the config's props and set the charts to their respective data
    for (const ix in config) {
        if (config.hasOwnProperty(ix)) {
            charts[counter].data = config[ix].data;
            charts[counter++].update();
        }
    }
}

// Single page app

// Bunch of variables needed fo rlater processes
let data = {};
let charts = [];
let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let colors = ['#1898e6', 'yellow', 'black'];
var totalDaily = 0;

/** 
 * Returns an object with props that are chart js config objects
 * 
 * @returns {{key: Chart.ChartConfiguration}}
 */
let chartData = function () {
    return {
        salesTotal: {
            type: 'line',
            data: {
                labels: newArray(data.repData[0].data.salesData[vm.monthIndex].length).map((val, ix, arr) => {
                    return days[ix % 7];
                }),
                datasets: [{
                    label: 'Target',
                    type: 'line',
                    data: newArray(data.repData[0].data.salesData[vm.monthIndex].length).map((val, ix, arr) => {
                        return data.repData[0].salesTarget * 3;
                    }),
                    fill: false,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointStyle: 'dashed',
                }, {
                    label: 'Total',
                    data: ((function () {
                        totalDaily = newArray(data.repData[0].data.salesData[vm.monthIndex].length);
                        data.repData.forEach((val, ix, arr) => {
                            // var total = 0;
                            val.data.salesData[vm.monthIndex].forEach((val, ix, arr) => {
                                totalDaily[ix] += val;
                            });
                            // totalDaily.push(total);
                        });
                    })(), totalDaily),
                    fill: false,
                    borderColor: '#1898e6',
                    backgroundColor: '#1898e6',
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Sales'
                },
                // legend: false
            }
        },
        salesCompare: {
            type: 'bar',
            data: {
                labels: newArray(data.repData[0].data.salesData[vm.monthIndex].length).map((val, ix, arr) => {
                    return days[ix % 7];
                }),
                datasets: [{
                    label: 'Target',
                    type: 'line',
                    data: newArray(data.repData[0].data.salesData[vm.monthIndex].length).map((val, ix, arr) => {
                        return data.repData[0].salesTarget;
                    }),
                    fill: false,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointStyle: 'dashed',
                }].concat(data.repData.map((val, ix, arr) => {
                    var dataset = {
                        label: val.name,
                        type: 'bar',
                        data: val.data.salesData[vm.monthIndex],
                        fill: false,
                        borderColor: colors[ix],
                        backgroundColor: colors[ix],
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        spanGaps: true
                    };
                    // console.log(dataset);
                    return dataset;
                }))
            },
            options: {
                title: {
                    display: true,
                    text: 'Sales Representative Compare'
                }
                // legend: false
            }
        },
        orders: {
            type: 'line',
            data: {
                labels: newArray(data.repData[0].data.orderData[vm.monthIndex].length).map((val, ix, arr) => {
                    return days[ix % 7];
                }),
                datasets: [{
                    label: 'Total',
                    data: ((function () {
                        totalDaily = newArray(data.repData[0].data.orderData[vm.monthIndex].length);
                        data.repData.forEach((val, ix, arr) => {
                            // var total = 0;
                            val.data.orderData[vm.monthIndex].forEach((val, ix, arr) => {
                                totalDaily[ix] += val;
                            });
                            // totalDaily.push(total);
                        });
                    })(), totalDaily),
                    fill: false,
                    borderColor: 'lightgreen',
                    backgroundColor: 'lightgreen',
                    pointRadius: 4,
                    pointHoverRadius: 7
                }, {
                    label: 'Target',
                    data: newArray(data.repData[0].data.orderData[vm.monthIndex].length).map((val, ix, arr) => {
                        return data.repData[0].orderTarget;
                    }),
                    fill: false,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointStyle: 'dashed',
                }].concat(data.repData.map((val, ix, arr) => {
                    var dataset = {
                        label: val.name,
                        data: val.data.orderData[vm.monthIndex],
                        fill: false,
                        borderColor: colors[ix],
                        backgroundColor: colors[ix],
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        spanGaps: true
                    };
                    // console.log(dataset);
                    return dataset;
                }))
            },
            options: {
                title: {
                    display: true,
                    text: 'Orders'
                },
                elements: {
                    line: {
                        tension: 0, // disables bezier curves
                    }
                },
                // legend: false
            }
        },
        yearSalesPerformance: {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales',
                    data: data.monthlyData.orders,
                    fill: false,
                    borderColor: '#1898e6',
                    backgroundColor: '#1898e6',
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                title: {
                    display: true,
                    text: '2018 Sales Performance'
                },
                legend: false
            }
        }
    }
};

// Attach the Vue Router to Vue
Vue.use(VueRouter);

// The Login view component
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
        <h2>
            <div><span>S</span><span>e</span><span>m</span><span>i</span></div>
            <div><span>E</span><span>x</span><span>c</span><span>i</span><span>t</span><span>i</span><span>n</span><span>g</span></div>
            <div><span>G</span><span>a</span><span>m</span><span>e</span><span>s</span></div>
        </h2>
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

// The Dashboard view component
const dash = {
    data: function () {
        return {
            month: this.$parent.month[this.$parent.monthIndex]
        };
    },
    methods: {
        closeNav: function () {
            $('#dash #sidenav').removeClass('active');
        },
        showNav: function () {
            $('#dash #sidenav').addClass('active');
        },
        nextMonth() {
            this.$parent.monthIndex++;
            if (this.$parent.monthIndex >= this.$parent.month.length) {
                this.$parent.monthIndex = 0;
            }
            this.month = this.$parent.month[this.$parent.monthIndex];

            updateCharts();
        },
        prevMonth() {
            this.$parent.monthIndex--;
            if (this.$parent.monthIndex < 0) {
                this.$parent.monthIndex = this.$parent.month.length - 1;
            }
            this.month = this.$parent.month[this.$parent.monthIndex];

            updateCharts();
        },
        switchTheme() {
            // 
            if ($('#dash').hasClass('dark')) {
                $('#dash').removeClass('dark');
            } else {
                $('#dash').addClass('dark');
            }
        }
    },
    mounted: function () {
        this.$nextTick(createAllCharts);
    },
    props: ['view'],
    template: `
    <div id="dash">
        <div id="sidenav" v-on:click="closeNav">
            <span>Overview</span>
            <span class="theme" v-on:click="switchTheme"><span>Switch Theme</span></span>
        </div>
        <nav>
            <i id="close" class="fa fa-bars" v-on:click="showNav"></i>
            <div>SEG</div>
            <i class="invisible"></i>
        </nav>
        <main>
            <div id="month-selector">
                <i class="fas fa-caret-left" v-on:click="prevMonth"></i>
                <span>{{ month }}</span>
                <i class="fas fa-caret-right" v-on:click="nextMonth"></i>
            </div>
            <div class="sales-total chart-container">
                <canvas id="sales-total"></canvas>
            </div>
            <div class="sales-reps-compare chart-container">
                <canvas id="sales-reps-compare"></canvas>
            </div>
            <div class="orders chart-container">
                <canvas id="orders"></canvas>
            </div>
            <hr/>
            <div class="yearly chart-container">
                <canvas id="orders"></canvas>
            </div>
        </main>
    </div>`
};

// The loader spinner component
Vue.component('loader', {
    template: `<div id="loader"></div>`
});

// The vue routes
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
            var isLoggedIn = auth_isLoggedIn();

            if (!isLoggedIn) {
                next('/login');
            } else {
                loadData("db.monthly.json").then((monthlyData) => {
                    data.monthlyData = monthlyData;
                    console.log(data.monthlyData);
                    loadData("db.sales-rep.json").then((salesData) => {
                        data.repData = salesData;
                        // chartData = chartData();
                        hideLoader();
                        console.log(data.repData);
                        next();
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
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

// The vue router instance
const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes
});

// The main vue instance
const vm = new Vue({
    data: function () {
        return {
            view: 'login',
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            monthIndex: 8
        };
    },
    methods: {},
    router
}).$mount('#app');

// When the page finishes loading, hide the loader spinner
window.onload = () => {
    $('#loader').addClass('hidden');
};