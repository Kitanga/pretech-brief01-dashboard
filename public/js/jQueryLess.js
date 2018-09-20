/* Basic jQuery functioons recreated */


/**
 * @typedef {} element
 * 
 * @augments HTMLElement
 * @borrows on as onEvent
 * @borrows addClass as addClass
 * @borrows removeClass as removeClass
 * @borrows hasClass as hasClass
 * @borrows css as css
 * @borrows ready as ready
 */

/**
 * jQuery with less functionality
 * 
 * @param {string | function} selector A string or function passed to jQueryLess
 */
var $ = (function () {
    /**
     * jQuery with less functionality
     * 
     * @param {string | function | Window | Document} selector A string or function passed to jQueryLess
     * @returns {({on: onEvent,addClass: addClass,removeClass: removeClass,hasClass: hasClass,css: css,ready: ready} | Window | Document)}
     */
    var jQueryLess = function (selector) {
        var element = {};
        // If the selector is a function
        if (typeof selector === 'function') {
            ready(selector);
        } else if (typeof selector === 'string') {
            element = document.querySelectorAll(selector);
            addFunctionality(element);
            return element;
        } else if (!!selector || selector !== null || selector !== undefined) {
            // 
            addFunctionality(selector);

            /** 
             * @augments Window
             * @type {{on: onEvent,addClass: addClass,removeClass: removeClass,hasClass: hasClass,css: css,ready: ready}} */
            return selector;
        }
    };

    /**
     * Adds functions to the element passed to it
     * @param {HTMLElement | NodeList} element Either an HTML element or a collection of elements
     */
    function addFunctionality(element) {
        element.on = onEvent;
        element.addClass = addClass;
        element.removeClass = removeClass;
        element.hasClass = hasClass;
        element.css = css;
        element.ready = ready;
    }

    /**
     * Add an event listener to this element
     *
     * @param {*} eventType The event type
     * @param {function} callback A function that runs when event's triggered
     * @returns jQueryLess
     */
    function onEvent(eventType, callback) {
        // If this is a collection of elements then we run the function on it's children
        this.forEach(ele => {
            __action_onEvent(ele, eventType, callback);
        });

        return this;
    }

    /**
     * Adds class to element
     * @param {string} className The class to add
     */
    function addClass(className) {
        // If this is a collection of elements then we run the function on it's children
        this.forEach(ele => {
            __action_addClass(ele, className);
        });

        return this;
    }

    function removeClass(className) {
        // If this is a collection of elements then we run the function on it's children
        this.forEach(ele => {
            __action_removeClass(ele, className);
        });

        return this;
    }

    function hasClass(className) {
        // If this is a collection of elements then we run the function on it's children
        let val = false;

        this.forEach(element => {
            if (element.classList.contains(className)) {
                val = true;
            }
        });

        return val;
    }

    function css(_obj) {
        // If this is a collection of elements then we run the function on it's children
        this.forEach(ele => {
            __action_css(ele, _obj);
        });

        return this;
    }

    function ready(callback) {
        // If this is a collection of elements then we run the function on it's children
        this.forEach(ele => {
            __action_ready(ele, callback);
        });

        return this;
    }

    // The action we do on element
    function __action_onEvent(element, eventType, callback) {
        // 
        element.addEventListener(eventType, callback);
    }
    // The action we do on element
    function __action_addClass(element, className) {
        // 
        element.classList.add(className);
    }
    // The action we do on element
    function __action_removeClass(element, className) {
        // 
        element.classList.remove(className);
    }
    // The action we do on element
    function __action_hasClass(element) {
        // 
        let val = false;

        if (element.classList.contains(className)) {
            val = true;
        }
        return val;
    }
    // The action we do on element
    function __action_css(element, _obj) {
        // If these are the user defined object properties, then add them as style properties
        for (var ix in _obj) {
            if (_obj.hasOwnProperty(ix)) {
                element.style[ix] = _obj[ix];
            }
        }
    }
    // The action we do on element
    function __action_ready(element, selector) {
        // `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", selector);
        } else {
            // `DOMContentLoaded` already fired
            selector();
        }
    }

    return jQueryLess;
})();

var jQuery = $;