import pts from "./dep/pts.js";
import lod from "./lod.js";
import objects from "./objects.js";
import game from "./game.js";
import aabb2 from "./dep/aabb2.js";
import gtasmr from "./gtasmr.js";
export var city;
(function (city) {
    city.sounds = { footsteps: [] };
    let generator;
    (function (generator) {
        function run(min, max, func) {
            let x = min[0];
            for (; x <= max[0]; x++) {
                let y = min[1];
                for (; y <= max[1]; y++) {
                    func([x, y]);
                }
            }
        }
        generator.run = run;
    })(generator || (generator = {}));
    const pavement_uv = 0.25;
    const road_uv = 0.2;
    const road_typical = { sty: 'sty/sheets/grey_roads.png', repeat: [road_uv, road_uv] };
    const pavement_typical = { sty: 'sty/floors/green/645.bmp', /*repeat: [pavement_uv, pavement_uv]*/ };
    const pavement_blue = { sty: 'sty/floors/blue/256.bmp' };
    const pavement_mixed = { sty: 'sty/floors/mixed/64.bmp' };
    const block_tenement = { sty: 'sty/commercial/storefront/578.bmp' };
    const make_room = (pos) => {
        let obj = new lod.obj;
        let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
        properties.mask = 'sty/walls/casual/concaveMask.bmp';
        // properties.offset = [pavement_uv * 1, 0];
        new game.sprite(properties);
        obj.wpos = pts.add(pos, [0.5, 0.5]);
        //obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
        obj._step();
        //GTA.view.add(obj);
    };
    function creation() {
        pts.area_every(new aabb2([-100, 0], [+100, 1]), (pos) => {
            let floor = new objects.floor;
            floor.sty;
            floor.wpos = pts.add(pos, [0.5, 0.5]);
            if (pos[1] == 0)
                floor.rz = Math.PI;
            floor._step();
            gtasmr.gview.add(floor);
            console.log('add road');
        });
        const pavement = (pos) => {
            let obj = new lod.obj;
            let props = Object.assign(Object.assign({}, pavement_mixed), { bind: obj });
            props.offset = [pavement_uv * 1, 0];
            new game.sprite(props);
            obj.wpos = pts.add(pos, [0.5, 0.5]);
            //obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
            obj._step();
            gtasmr.gview.add(obj);
        };
        const tenement = (pos) => {
            let obj = new lod.obj();
            let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
            properties.mask = 'sty/interiors/casual/concaveMask.bmp';
            new game.sprite(properties);
            obj._step();
            gtasmr.gview.add(obj);
        };
        pts.area_every(new aabb2([-100, -1], [+100, -1]), pavement);
        pts.area_every(new aabb2([-100, 2], [+100, 2]), pavement);
        pts.area_every(new aabb2([0, -2], [0 - 3, -2 - 1]), make_room);
        //pts.area_every(new aabb2([-10, 3], [+10, 3]), tenement);
    }
    city.creation = creation;
    function load_sounds() {
        for (let i = 0; i < 4; i++) {
            city.sounds.footsteps[i] = new Audio(`snd/SFX_FOOTSTEP_CONCRETE_${i + 1}.wav`);
            city.sounds.footsteps[i].volume = 0.1;
        }
    }
    city.load_sounds = load_sounds;
})(city || (city = {}));
export default city;
