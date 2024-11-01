import lod from "../lod.js";
import staging_area from "./staging.js";
export var generators;
(function (generators) {
    let axis;
    (function (axis) {
        axis[axis["horz"] = 0] = "horz";
        axis[axis["vert"] = 1] = "vert";
    })(axis = generators.axis || (generators.axis = {}));
    function deliver(data) {
        let chunk = lod.gworld.atwpos(data.wpos);
        //chunk.add(data);
    }
    generators.deliver = deliver;
    // todo throw into staging
    function invert(data, axis, w) {
        // temp
        let x = data._wpos[0];
        let y = data._wpos[0];
        data._wpos[0] = axis ? y : x;
        data._wpos[1] = axis ? x : y;
        data._r = axis;
        data._wpos[0] += w[0];
        data._wpos[1] += w[1];
    }
    generators.invert = invert;
    function loopvec3(min, max, func) {
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
    generators.loopvec3 = loopvec3;
    function oneway(axis, w, segs) {
        let staging = new staging_area;
        let seg = 0;
        for (; seg < segs; seg++) {
            let road = {
                _type: 'floor',
                _wpos: [w[0], seg + w[1], w[2]],
                _r: 3,
                extra: {}
            };
            if (!seg || seg == segs - 1) {
                road.extra.sty = 'sty/roads/grey/687.bmp';
                //road.sprite = Sprites.ROADS.SINGLE_OPEN;
                if (!seg)
                    road._r += 1;
                else if (seg == segs - 1)
                    road._r -= 1;
            }
            staging.add_data(road);
        }
        if (axis == 0)
            staging.ccw(1);
        staging.replace();
    }
    generators.oneway = oneway;
    function twolane(axis, w, segs) {
        let staging = new staging_area;
        const lanes = 2;
        let seg = 0;
        for (; seg < segs; seg++) {
            let lane = 0;
            for (; lane < lanes; lane++) {
                let road = {
                    _type: 'floor',
                    _wpos: [seg + w[0], lane + w[1], 0],
                    extra: {}
                };
                road._r = !lane ? Math.PI / 1 : 0;
                road.extra.sty = 'sty/roads/grey/691.bmp'; // side line
                if (!seg || seg == segs - 1) {
                    road.extra.sty = 'sty/roads/grey/695.bmp'; // side line fade
                    if (!seg && !lane || seg == segs - 1 && lane)
                        road.extra.flip = true;
                }
                else if (seg == 1 && lane == lanes - 1 || seg == segs - 2 && !lane) {
                    road.extra.sty = 'sty/roads/grey/676.bmp'; // sideStopLine
                    road.extra.flip = true;
                }
                staging.add_data(road);
            }
        }
        if (axis == 1)
            staging.ccw(1);
        staging.replace();
    }
    generators.twolane = twolane;
})(generators || (generators = {}));
export default generators;
