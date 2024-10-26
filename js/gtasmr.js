import city from "./city.js";
import ghooks from "./ghooks.js";
import renderer from "./renderer.js";
import view from "./view.js";
import player from "./objs/player.js";
export var gtasmr;
(function (gtasmr) {
    gtasmr.NO_VAR = false;
    gtasmr.SOME_OTHER_SETTING = false;
    const MAX_WAIT = 1500;
    var started = false;
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    gtasmr.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    gtasmr.clamp = clamp;
    let RESOURCES;
    (function (RESOURCES) {
        RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
        RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
        RESOURCES[RESOURCES["CANT_FIND"] = 2] = "CANT_FIND";
        RESOURCES[RESOURCES["READY"] = 3] = "READY";
        RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
    })(RESOURCES = gtasmr.RESOURCES || (gtasmr.RESOURCES = {}));
    ;
    let time;
    let resources_loaded = 0b0;
    function resourced(word) {
        resources_loaded |= 0b1 << RESOURCES[word];
        try_start();
    }
    gtasmr.resourced = resourced;
    function try_start() {
        let count = 0;
        let i = 0;
        for (; i < RESOURCES.COUNT; i++)
            if (resources_loaded & 0b1 << i)
                count++;
        if (count == RESOURCES.COUNT)
            init();
    }
    function reasonable_waiter() {
        if (time + MAX_WAIT < new Date().getTime()) {
            console.warn(`passed reasonable wait time for resources`);
            init();
        }
    }
    gtasmr.reasonable_waiter = reasonable_waiter;
    function critical(mask) {
        // Couldn't load
        console.error('resource', mask);
    }
    gtasmr.critical = critical;
    function init() {
        console.log(' gta init ');
        time = new Date().getTime();
        resourced('RC_UNDEFINED');
        resourced('POPULAR_ASSETS');
        resourced('READY');
        window['GTA'] = gtasmr;
    }
    gtasmr.init = init;
    async function start() {
        if (started)
            return;
        console.log(' gtasmr start ');
        gtasmr.gview = view.make();
        gtasmr.ply = player.instance();
        gtasmr.gview.add(gtasmr.ply);
        city.load_sounds();
        city.creation();
        ghooks.start();
        if (window.location.href.indexOf("#novar") != -1)
            gtasmr.NO_VAR = false;
        started = true;
    }
    gtasmr.start = start;
    function step(delta) {
        if (!started) {
            reasonable_waiter();
            return;
        }
        gtasmr.gview.tick();
        renderer.update();
        renderer.render();
    }
    gtasmr.step = step;
})(gtasmr || (gtasmr = {}));
export default gtasmr;
