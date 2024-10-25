import City from "./city.js";
import Hooks from "./hooks.js";
import Objects from "./objects.js";
import View from "./view.js";
export var GTA;
(function (GTA) {
    GTA.NO_VAR = false;
    GTA.SOME_OTHER_SETTING = false;
    const MAX_WAIT = 1500;
    var started = false;
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    GTA.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    GTA.clamp = clamp;
    let RESOURCES;
    (function (RESOURCES) {
        RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
        RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
        RESOURCES[RESOURCES["CANT_FIND"] = 2] = "CANT_FIND";
        RESOURCES[RESOURCES["READY"] = 3] = "READY";
        RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
    })(RESOURCES = GTA.RESOURCES || (GTA.RESOURCES = {}));
    ;
    let time;
    let resources_loaded = 0b0;
    function resourced(word) {
        resources_loaded |= 0b1 << RESOURCES[word];
        try_start();
    }
    GTA.resourced = resourced;
    function try_start() {
        let count = 0;
        let i = 0;
        for (; i < RESOURCES.COUNT; i++)
            if (resources_loaded & 0b1 << i)
                count++;
        if (count == RESOURCES.COUNT)
            start();
    }
    function reasonable_waiter() {
        if (time + MAX_WAIT < new Date().getTime()) {
            console.warn(`passed reasonable wait time for resources`);
            start();
        }
    }
    GTA.reasonable_waiter = reasonable_waiter;
    function critical(mask) {
        // Couldn't load
        console.error('resource', mask);
    }
    GTA.critical = critical;
    function init() {
        console.log(' gta init ');
        time = new Date().getTime();
        resourced('RC_UNDEFINED');
        resourced('POPULAR_ASSETS');
        resourced('READY');
        window['GTA'] = GTA;
    }
    GTA.init = init;
    function start() {
        if (started)
            return;
        console.log(' gtasmr starting ');
        GTA.view = View.make();
        GTA.ply = Objects.Ply.instance();
        GTA.view.add(GTA.ply);
        City.load_sounds();
        City.creation();
        Hooks.start();
        if (window.location.href.indexOf("#novar") != -1)
            GTA.NO_VAR = false;
        started = true;
    }
    function tick() {
        if (!started) {
            reasonable_waiter();
            return;
        }
        GTA.view.tick();
        //Board.update();
        //Ploppables.update();
    }
    GTA.tick = tick;
})(GTA || (GTA = {}));
export default GTA;
