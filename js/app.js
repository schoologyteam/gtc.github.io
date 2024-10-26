import glob from "./dep/glob.js";
import hooks from "./dep/hooks.js";
import points from "./dep/pts.js";
import gtasmr from "./gtasmr.js";
import renderer from "./renderer.js";
var app;
(function (app) {
    let KEY;
    (function (KEY) {
        KEY[KEY["UNPRESSED"] = 0] = "UNPRESSED";
        KEY[KEY["PRESSED"] = 1] = "PRESSED";
        KEY[KEY["REPEAT_DELAY"] = 2] = "REPEAT_DELAY";
        KEY[KEY["REPEAT"] = 3] = "REPEAT";
        KEY[KEY["RELEASED"] = 4] = "RELEASED";
    })(KEY = app.KEY || (app.KEY = {}));
    let BUTTON;
    (function (BUTTON) {
        BUTTON[BUTTON["UP"] = -1] = "UP";
        BUTTON[BUTTON["OFF"] = 0] = "OFF";
        BUTTON[BUTTON["DOWN"] = 1] = "DOWN";
        BUTTON[BUTTON["STILL"] = 2] = "STILL";
    })(BUTTON = app.BUTTON || (app.BUTTON = {}));
    const keys = {};
    const buttons = {};
    var pos = [0, 0];
    app.salt = 'x';
    app.wheel = 0;
    function onkeys(event) {
        const key = event.key.toLowerCase();
        if ('keydown' == event.type)
            keys[key] = keys[key]
                ? KEY.REPEAT : KEY.PRESSED;
        else if ('keyup' == event.type)
            keys[key] = KEY.RELEASED;
        if (event.keyCode == 114)
            event.preventDefault();
    }
    app.onkeys = onkeys;
    function mpos() {
        return [...pos];
    }
    app.mpos = mpos;
    function button(b) {
        return buttons[b] || BUTTON.OFF;
    }
    app.button = button;
    function key(k) {
        return keys[k] || KEY.UNPRESSED;
    }
    app.key = key;
    async function boot(version) {
        console.log(' app boot ');
        hooks.call('appBoot', null);
        glob.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        function onmousemove(e) {
            pos[0] = e.clientX;
            pos[1] = e.clientY;
        }
        function onmousedown(e) {
            buttons[e.button] = BUTTON.DOWN;
            if (e.button == 1)
                return false;
        }
        function onmouseup(e) {
            buttons[e.button] = BUTTON.UP;
        }
        function onwheel(e) {
            app.wheel = e.deltaY < 0 ? 1 : -1;
        }
        let touchStart = [0, 0];
        function ontouchstart(e) {
            //message("ontouchstart");
            touchStart = [e.pageX, e.pageY];
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            buttons[2] = BUTTON.UP;
        }
        function ontouchmove(e) {
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            if (!buttons[0])
                buttons[0] = BUTTON.DOWN;
            e.preventDefault();
            return false;
        }
        function ontouchend(e) {
            const touchEnd = [e.pageX, e.pageY];
            buttons[0] = BUTTON.UP;
            buttons[2] = BUTTON.UP;
            if (points.equals(touchEnd, touchStart) /*&& buttons[2] != MOUSE.STILL*/) {
                buttons[2] = BUTTON.DOWN;
            } /*
            else if (!pts.equals(touchEnd, touchStart)) {
                buttons[2] = MOUSE.UP;
            }
            //message("ontouchend");*/
            //return false;
        }
        function onerror(message) {
            document.querySelectorAll('salvage-stats')[0].innerHTML = message;
        }
        if (glob.mobile) {
            document.ontouchstart = ontouchstart;
            document.ontouchmove = ontouchmove;
            document.ontouchend = ontouchend;
        }
        else {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
        }
        window.onerror = onerror;
        renderer.init();
        gtasmr.init();
        await gtasmr.start();
        app.blockable = trick_animation_frame(base_loop);
    }
    app.boot = boot;
    function post_keys() {
        for (let i in keys) {
            if (keys[i] == KEY.PRESSED)
                keys[i] = KEY.REPEAT_DELAY;
            else if (keys[i] == KEY.RELEASED)
                keys[i] = KEY.UNPRESSED;
        }
    }
    function post_mouse_buttons() {
        for (let b of [0, 1, 2])
            if (buttons[b] == BUTTON.DOWN)
                buttons[b] = BUTTON.STILL;
            else if (buttons[b] == BUTTON.UP)
                buttons[b] = BUTTON.OFF;
    }
    app.delta = 0;
    app.last = 0;
    async function base_loop() {
        //await new Promise(resolve => setTimeout(resolve, 16.6)); // 60 fps mode
        const now = (performance || Date).now();
        app.delta = (now - app.last) / 1000;
        app.last = now;
        await gtasmr.step(app.delta);
        app.wheel = 0;
        post_keys();
        post_mouse_buttons();
    }
    app.base_loop = base_loop;
    async function sleep() {
        return new Promise(requestAnimationFrame);
    }
    async function trick_animation_frame(callback) {
        console.log(' trick animation frame ');
        do {
            await sleep();
            await callback();
        } while (1);
    }
    app.trick_animation_frame = trick_animation_frame;
    function set_html(selector, html) {
        let element = document.querySelectorAll(selector)[0];
        element.innerHTML = html;
    }
    app.set_html = set_html;
    function set_style(selector, style, property) {
        let element = document.querySelectorAll(selector)[0];
        element.style[style] = property;
    }
    app.set_style = set_style;
})(app || (app = {}));
window['app'] = app;
export default app;
