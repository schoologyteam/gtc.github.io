import { GTA } from "./gta.js";
import Renderer from "./renderer.js";
var App;
(function (App) {
    let KEY;
    (function (KEY) {
        KEY[KEY["OFF"] = 0] = "OFF";
        KEY[KEY["PRESS"] = 1] = "PRESS";
        KEY[KEY["WAIT"] = 2] = "WAIT";
        KEY[KEY["AGAIN"] = 3] = "AGAIN";
        KEY[KEY["UP"] = 4] = "UP";
    })(KEY = App.KEY || (App.KEY = {}));
    ;
    var keys = {};
    var buttons = {};
    var pos = [0, 0];
    App.salt = 'x';
    App.wheel = 0;
    function onkeys(event) {
        const key = event.key.toLowerCase();
        if ('keydown' == event.type)
            keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
        else if ('keyup' == event.type)
            keys[key] = KEY.UP;
        if (event.keyCode == 114)
            event.preventDefault();
    }
    App.onkeys = onkeys;
    function key(k) {
        return keys[k];
    }
    App.key = key;
    function button(b) {
        return buttons[b];
    }
    App.button = button;
    function mouse() {
        return [...pos];
    }
    App.mouse = mouse;
    function boot(version) {
        App.salt = version;
        function onmousemove(e) { pos[0] = e.clientX; pos[1] = e.clientY; }
        function onmousedown(e) { buttons[e.button] = 1; }
        function onmouseup(e) { buttons[e.button] = 0; }
        function onwheel(e) { App.wheel = e.deltaY < 0 ? 1 : -1; }
        document.onkeydown = document.onkeyup = onkeys;
        document.onmousemove = onmousemove;
        document.onmousedown = onmousedown;
        document.onmouseup = onmouseup;
        document.onwheel = onwheel;
        Renderer.init();
        GTA.init();
        loop(0);
    }
    App.boot = boot;
    function delay() {
        for (let i in keys) {
            if (KEY.PRESS == keys[i])
                keys[i] = KEY.WAIT;
            else if (KEY.UP == keys[i])
                keys[i] = KEY.OFF;
        }
    }
    App.delay = delay;
    function loop(timestamp) {
        requestAnimationFrame(loop);
        Renderer.update();
        GTA.tick();
        Renderer.render();
        App.wheel = 0;
        for (let b of [0, 1])
            if (buttons[b] == 1)
                buttons[b] = 2;
        delay();
    }
    App.loop = loop;
    function sethtml(selector, html) {
        let element = document.querySelectorAll(selector)[0];
        element.innerHTML = html;
    }
    App.sethtml = sethtml;
})(App || (App = {}));
window['App'] = App;
export default App;
