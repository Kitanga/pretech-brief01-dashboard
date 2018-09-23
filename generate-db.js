const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const gen = new Chance();

/**
 * The monthly order target
 * @type {number}
 */
const orderTarget = gen.integer({
    min: 30,
    max: 40
});

/**
 * The price of one item
 * @type {number}
 */
const price = gen.integer({
    min: 30,
    max: 40
});

/**
 * The monthly sales target
 * @type {number}
 */
const salesTarget = orderTarget * price;

/**
 * Number of Sales Representatives to create
 * @type {number}
 */
const numReps = 3;

/**
 * First create the database base
 * @type {{orderTarget: number, salesTarget: number, saleReps: {data: { orderData: number[][], salesData: number[][] }, name: string}[], monthlyData: {}}}
 */
let db = {
    /**
     * An array of sales rep data
     * @type {[SalesRepresentative]}
     */
    saleReps: newArray(numReps),
    monthlyData: {
        orders: newArray(12),
        sales: newArray(12),
        orderTarget: orderTarget * 12,
        salesTarget: salesTarget * 12
    }
};

// Fill the salesReps array
db.saleReps.forEach((val, ix, arr) => {
    arr[ix] = SalesRepresentative(gen, db);
});

// Create the data for db.monthlyData based on db.saleReps' values
// The following process takes an array of 12 numbers and fills each slot with the total for that month based on the daily records for the sales representatives
db.monthlyData.orders = newArray(12).map((val, ix, arr) => {
    // The new value for this month's total
    var newVal = val;

    // For each sales rep, we add all the daily records for the current month array's value.
    db.saleReps.forEach(val => {
        newVal += val.data.orderData[ix].reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        });
    });

    return newVal;
});

// The monthly sales data. This is derived by multiplying the monthly data with the sales price
db.monthlyData.sales = db.monthlyData.orders.map(val => val * price);

// Create database files in /public folder
var fileDir = path.join(__dirname, '/public/');
// Create the data for sales representatives
fs.writeFileSync(fileDir + 'db.sales-rep.json', JSON.stringify(db.saleReps), 'utf8');

// Create data for monthly reports, these are sent first when the admin lands on the dashboard
fs.writeFileSync(fileDir + 'db.monthly.json', JSON.stringify(db.monthlyData), 'utf8');

/**
 * A sales representative class that creates the data we'll need for the client side dashboard
 * 
 * @param {gen} generator The chance.js instance we'll use to create random information
 * @param {db} db The parent in which this sales representative is stored
 */
function SalesRepresentative(generator, db) {
    var gen = generator;
    var db = db;

    // Bio data
    var name = gen.name();

    /**
     * An array of 12 elements (months). Each of which is an array of length between 28-31, depending on month being represented.
     * @type {number[][]}
     */
    var orderData = newArray(12);

    // Fill orderData array elements with an array representing days
    orderData.forEach((val, ix, order) => {
        // Create an array
        // If we are in the 'February' spot in array (aka second month) then create data structure slightly differently
        if (ix === 1) {
            // Check if it's NOT a leap year
            if ((new Date()).getFullYear() % 4) {
                order[ix] = newArray(28);
            }
            // It's a leap year
            else {
                order[ix] = newArray(29);
            }
        } else if (
            // If the index is less than 7 and is an odd number, then give it a length of 30 (remember this is 0 based counting so january would have an index of 0 and not 1)
            (ix < 7 && ix % 2) ||
            // If the index is greater than 6 and is an even, then give it also a length of 30
            (ix > 6 && !(ix % 2))
        ) {
            // 
            order[ix] = newArray(30);
        } else {
            order[ix] = newArray(31);
        }

        // Fill with random order
        order[ix] = order[ix].map(() => gen.integer({
            min: 0,
            max: 100
        }));
    });

    let salesData = orderData.map((val, ix, arr) => {
        // Return the new array of 
        return val.map((val, ix, arr) => {
            // Return the calculated sales value
            return val * price;
        });
    });

    return {
        data: {
            orderData,
            salesData
        },
        name,
        orderTarget,
        salesTarget
    };
}

function newArray(length) {
    return (new Array(length)).fill(0);
}