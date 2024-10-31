import lod from "../lod";
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
        let x = data.fakewpos[0];
        let y = data.fakewpos[0];
        data.fakewpos[0] = axis ? y : x;
        data.fakewpos[1] = axis ? x : y;
        data.r = axis;
        data.fakewpos[0] += w[0];
        data.fakewpos[1] += w[1];
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
    let buildings;
    (function (buildings) {
        buildings.blueMetal = [
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp'
        ];
        const roofFunc = (block, w, min, max) => {
            const same = block;
            if (w[2] == max[2]) {
                same.faces[4] = 'sty/roofs/green/793.bmp';
                if (w[0] == min[0] && w[1] == min[1]) { // lb
                    same.faces[4] = 'sty/roofs/green/784.bmp';
                    same.r = 3;
                }
                else if (w[0] == max[0] && w[1] == max[1]) { // rt
                    same.faces[4] = 'sty/roofs/green/784.bmp';
                    same.f = true;
                    same.r = 0;
                }
                else if (w[0] == min[0] && w[1] == max[1]) { // lt
                    same.faces[4] = 'sty/roofs/green/784.bmp';
                    same.r = 0;
                }
                else if (w[0] == max[0] && w[1] == min[1]) { // rb
                    same.faces[4] = 'sty/roofs/green/784.bmp';
                    same.r = 2;
                }
                else if (w[0] == min[0]) {
                    same.faces[4] = 'sty/roofs/green/790.bmp';
                    same.r = 1;
                }
                else if (w[1] == max[1]) {
                    same.faces[4] = 'sty/roofs/green/790.bmp';
                    same.f = true;
                    same.r = 2;
                }
                else if (w[0] == max[0]) {
                    same.faces[4] = 'sty/roofs/green/790.bmp';
                    same.r = 3;
                }
                else if (w[1] == min[1]) {
                    same.faces[4] = 'sty/roofs/green/790.bmp';
                    same.r = 0;
                }
            }
        };
        function type1(min, max) {
            const func = (w) => {
                let bmp = 'sty/metal/blue/340.bmp';
                let block = {
                    // type: 'Block',
                    name: 'block',
                    fakewpos: w
                };
                let ignore = block;
                ignore.faces = [];
                if (w[0] > min[0] &&
                    w[0] < max[0] &&
                    w[1] > min[1] &&
                    w[1] < max[1] &&
                    w[2] < max[2])
                    return;
                roofFunc(ignore, w, min, max);
                if (w[0] == min[0])
                    ignore.faces[1] = bmp;
                if (w[1] == max[1])
                    ignore.faces[2] = bmp;
                if (w[0] == max[0])
                    ignore.faces[0] = bmp;
                if (w[1] == min[1])
                    ignore.faces[3] = bmp;
                deliver(ignore);
            };
            loopvec3(min, max, func);
        }
        buildings.type1 = type1;
    })(buildings = generators.buildings || (generators.buildings = {}));
})(generators || (generators = {}));
export default generators;
