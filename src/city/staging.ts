// For making vertical ~> horizontal

import aabb2 from "../dep/aabb2.js";
import pts from "../dep/pts.js";
import lod from "../lod.js";
import baseobj from "../objs/baseobj.js";
import { objfactory } from "../objs/factory_motivation.js";

// A staging area lets you rotate, flip
// As well as replace or keep overlapping objects already in the lod

class staging_area {
	aabb: aabb2 | null
	propzs: propzs = []
	constructor() {
	}
	add_a_props(props: propz) {
		this.propzs.push(props);
	}
	add_propzs(propzs: propzs) {
		this.propzs = this.propzs.concat(propzs);
	}
	replace() {
		// This method replaces baseobjs in the LOD
		console.log('staging area replace', this.propzs);
		for (const data of this.propzs)
			lod.add(objfactory(data));
	}
	keep() {
		//for (let data of this.datas)
		//Datas.deliver(data);
	}
	private find_extents() {
		this.aabb = null;
		for (const props of this.propzs) {
			if (this.aabb === null)
				this.aabb = new aabb2(pts._3_2(props._wpos), pts._3_2(props._wpos));
			this.aabb!.extend(props._wpos);
		}
	}

	ccw(n: 1 | 2 | 3 = 1) {
		this.find_extents();
		if (this.aabb === null)
			return;
		for (let data of this.propzs) {
			let p = rotate(
				this.aabb.min[0],
				this.aabb.min[1],
				data._wpos[0],
				data._wpos[1],
				n * 90);
			data._r! += n;
			data._wpos[0] = p[0];
			data._wpos[1] = p[1] + (this.aabb.max[0] - this.aabb.min[0]);
		}
	}
}

function rotate(cx, cy, x, y, angle) {
	var radians = (Math.PI / 180) * angle,
		cos = Math.cos(radians),
		sin = Math.sin(radians),
		nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
		ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	return [Math.round(nx), Math.round(ny)];
}

export default staging_area;