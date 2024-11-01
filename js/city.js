import pts from "./dep/pts.js";
import lod from "./lod.js";
import objects from "./objs/misc.js";
import sprite from "./sprite.js";
import generators from "./city/generators.js";
export var city;
(function (city) {
    city.sounds = { footsteps: [] };
    function run3d(min, max, func) {
        let x = min[0];
        for (; x <= max[0]; x++) {
            let y = min[1];
            for (; y <= max[1]; y++) {
                let z = min[2];
                for (; z <= max[2]; z++) {
                    func([x, y, z]);
                }
            }
        }
    }
    city.run3d = run3d;
    const pavement_uv = 0.25;
    const road_uv = 0.2;
    const road_typical = { sty: 'sty/sheets/grey_roads.png', repeat: [road_uv, road_uv], offset: [0, 0] };
    const pavement_typical = { sty: 'sty/floors/green/645.bmp', /*repeat: [pavement_uv, pavement_uv]*/ };
    const pavement_blue = { sty: 'sty/floors/blue/256.bmp' };
    const pavement_mixed = { sty: 'sty/floors/mixed/64.bmp' };
    const block_tenement = { sty: 'sty/commercial/storefront/578.bmp' };
    const make_room = (pos) => {
        let obj = new lod.obj;
        let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
        properties.mask = 'sty/walls/casual/concaveMask.bmp';
        // properties.offset = [pavement_uv * 1, 0];
        new sprite(properties);
        obj.wpos = pts.add(pos, [0.5, 0.5]);
        //obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
        obj.step();
        //GTA.view.add(obj);
    };
    function creation() {
        const pavement = (pos) => {
            let sprops = Object.assign({}, pavement_mixed);
            let floor = new objects.floor({
                _type: 'direct',
                _wpos: pos,
                name: 'a pavement',
            });
            floor.sprops = sprops;
            floor.r = Math.PI / 2 * Math.floor(Math.random() * 4);
            lod.add(floor);
        };
        run3d([-100, 2, 0], [+100, 3, 0], pavement);
        run3d([-100, -1, 0], [+100, -1, 0], pavement);
        generators.twolane(0, [0, 0, 0], 5);
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
