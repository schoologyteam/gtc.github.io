import Core from "./core.js";
import Game from "./game.js";
import pts from "./pts.js";
import aabb2 from "./aabb2.js";
import GTA from "./gta.js";
export var City;
(function (City) {
    City.sounds = { footsteps: [] };
    let Generator;
    (function (Generator) {
        function run(min, max, func) {
            let x = min[0];
            for (; x <= max[0]; x++) {
                let y = min[1];
                for (; y <= max[1]; y++) {
                    func([x, y]);
                }
            }
        }
        Generator.run = run;
    })(Generator || (Generator = {}));
    const pavement_uv = 0.25;
    const road_uv = 0.2;
    const road_typical = { sty: 'grey_roads.png', repeat: [road_uv, road_uv] };
    const pavement_typical = { sty: 'floors/green/645.bmp', /*repeat: [pavement_uv, pavement_uv]*/ };
    const pavement_blue = { sty: 'floors/blue/256.bmp' };
    const pavement_mixed = { sty: 'floors/mixed/64.bmp' };
    const block_tenement = { sty: 'commercial/storefront/578.bmp' };
    const make_room = (pos) => {
        let obj = new Core.Obj;
        let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
        properties.mask = 'walls/casual/concaveMask.bmp';
        // properties.offset = [pavement_uv * 1, 0];
        new Game.Sprite(properties);
        obj.wpos = pts.add(pos, [0.5, 0.5]);
        //obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
        obj.update();
        GTA.view.add(obj);
    };
    function creation() {
        pts.area_every(new aabb2([-100, 0], [+100, 1]), (pos) => {
            let obj = new Core.Obj;
            let properties = Object.assign(Object.assign({}, road_typical), { bind: obj });
            new Game.Sprite(properties);
            obj.wpos = pts.add(pos, [0.5, 0.5]);
            if (pos[1] == 0)
                obj.rz = Math.PI;
            obj.update();
            GTA.view.add(obj);
        });
        const pavement = (pos) => {
            let obj = new Core.Obj;
            let properties = Object.assign(Object.assign({}, pavement_mixed), { bind: obj });
            // properties.offset = [pavement_uv * 1, 0];
            new Game.Sprite(properties);
            obj.wpos = pts.add(pos, [0.5, 0.5]);
            obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
            obj.update();
            GTA.view.add(obj);
        };
        const tenement = (pos) => {
            let obj = new Core.Obj();
            let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
            properties.mask = 'interiors/casual/concaveMask.bmp';
            new Game.Sprite(properties);
            obj.update();
            GTA.view.add(obj);
        };
        pts.area_every(new aabb2([-100, -1], [+100, -1]), pavement);
        pts.area_every(new aabb2([-100, 2], [+100, 2]), pavement);
        pts.area_every(new aabb2([0, -2], [0 - 3, -2 - 1]), make_room);
        //pts.area_every(new aabb2([-10, 3], [+10, 3]), tenement);
    }
    City.creation = creation;
    function load_sounds() {
        for (let i = 0; i < 4; i++) {
            City.sounds.footsteps[i] = new Audio(`sfx/FOOTSTEP/SFX_FOOTSEP_CONCRETE_${i + 1}.wav`);
            City.sounds.footsteps[i].volume = 0.1;
        }
    }
    City.load_sounds = load_sounds;
})(City || (City = {}));
export default City;
