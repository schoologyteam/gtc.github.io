import gtasmr from "../gtasmr.js";
import lod from "../lod.js";
import baseobj from "../objs/baseobj.js";
import staging_area from "./staging.js";

export namespace generators {

	export enum axis { horz, vert }

	export function deliver(data: baseobj) {
		let chunk = lod.gworld.atwpos(data.wpos);
		//chunk.add(data);
	}

	// Todo Throw into staging
	export function invert(props: propz, axis: axis, w: vec3) {
		// Temp
		let x = props._wpos[0];
		let y = props._wpos[0];
		props._wpos[0] = axis ? y : x;
		props._wpos[1] = axis ? x : y;
		props._r = axis;
		props._wpos[0] += w[0];
		props._wpos[1] += w[1];
	}

	// Todo Put into staging
	export function loopvec3(
		min: vec3,
		max: vec3,
		func: (w: vec3) => any) {
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

	export namespace buildings {

		type faces = [string, string, string, string, string]

	}

	export function oneway(axis: axis, w: vec3, segs: number) {
		let staging = new staging_area;
		let seg = 0;
		for (; seg < segs; seg++) {
			let road: propz = {
				_type: 'floor',
				_wpos: [w[0], seg + w[1], w[2]],
				_r: 3,
				extra: {}
			};
			if (!seg || seg == segs - 1) {
				road.extra.sty = 'sty/roads/grey/687.bmp';
				//road.sprite = Sprites.ROADS.SINGLE_OPEN;
				if (!seg)
					road._r! += 1;
				else if (seg == segs - 1)
					road._r! -= 1;
			}
			staging.add_a_props(road);
		}
		if (axis == 0)
			staging.ccw(1);
		staging.replace();
	}

	export function twolane(axis: axis, w: vec3, segs: number) {
		let staging = new staging_area;
		const lanes = 2;
		let seg = 0;
		for (; seg < segs; seg++) {
			let lane = 0;
			for (; lane < lanes; lane++) {
				let road: propz = {
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
				staging.add_a_props(road);
			}
		}
		if (axis == 1)
			staging.ccw(1);
		staging.replace();
	}

}

export default generators;