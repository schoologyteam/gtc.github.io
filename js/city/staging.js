// For making vertical ~> horizontal
import aabb2 from "../dep/aabb2.js";
import pts from "../dep/pts.js";
import lod from "../lod.js";
import { objfactory } from "../objs/factory_motivation.js";
// Horrible code from gta kill
class staging_area {
    constructor() {
        this.datas = [];
    }
    add_data(data) {
        this.datas.push(data);
    }
    add_datas(datas) {
        this.datas = this.datas.concat(datas);
    }
    replace() {
        console.log('staging area replace', this.datas);
        for (const data of this.datas)
            lod.add(objfactory(data));
    }
    keep() {
        //for (let data of this.datas)
        //Datas.deliver(data);
    }
    find_extents() {
        let first = true;
        let aabb;
        for (let data of this.datas) {
            if (!aabb)
                aabb = new aabb2(pts._32(data._wpos), pts._32(data._wpos));
            aabb.extend(data._wpos);
        }
    }
    ccw(n = 1) {
        this.find_extents();
        for (let data of this.datas) {
            let p = rotate(this.aabb.min[0], this.aabb.min[1], data._wpos[0], data._wpos[1], n * 90);
            //console.log('rotate is', p[0], p[1]);
            data._r += n;
            data._wpos[0] = p[0];
            data._wpos[1] = p[1] + (this.aabb.max[0] - this.aabb.min[0]);
        }
    }
}
function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (x - cx)) + (sin * (y - cy)) + cx, ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [Math.round(nx), Math.round(ny)];
}
export default staging_area;
