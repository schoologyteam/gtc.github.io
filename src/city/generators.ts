import gtasmr from "../gtasmr";
import lod from "../lod";
import baseobj from "../objs/baseobj";

export namespace generators {

	export enum axis { horz, vert }

	export function deliver(data: baseobj) {
		let chunk = lod.gworld.atwpos(data.wpos);
		//chunk.add(data);
	}

	// todo throw into staging
	export function invert(
		data: objprops,
		axis: axis,
		w: vec3
	) {
		// temp
		let x = data._wpos[0];
		let y = data._wpos[0];
		data._wpos[0] = axis ? y : x;
		data._wpos[1] = axis ? x : y;
		data.r = axis;
		data._wpos[0] += w[0];
		data._wpos[1] += w[1];
	}

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

		export const blueMetal: faces = [
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp'];

		const roofFunc = (block: propz, w: vec3, min: vec3, max: vec3) => {

			const same = block as any;

			if (w[2] == max[2]) {
				same.faces![4] = 'sty/roofs/green/793.bmp';

				if (w[0] == min[0] && w[1] == min[1]) { // lb
					same.faces![4] = 'sty/roofs/green/784.bmp';
					same.r = 3;
				}
				else if (w[0] == max[0] && w[1] == max[1]) { // rt
					same.faces![4] = 'sty/roofs/green/784.bmp';
					same.f = true;
					same.r = 0;
				}
				else if (w[0] == min[0] && w[1] == max[1]) { // lt
					same.faces![4] = 'sty/roofs/green/784.bmp';
					same.r = 0;
				}
				else if (w[0] == max[0] && w[1] == min[1]) { // rb
					same.faces![4] = 'sty/roofs/green/784.bmp';
					same.r = 2;
				}

				else if (w[0] == min[0]) {
					same.faces![4] = 'sty/roofs/green/790.bmp';
					same.r = 1;
				}
				else if (w[1] == max[1]) {
					same.faces![4] = 'sty/roofs/green/790.bmp';
					same.f = true;
					same.r = 2;
				}
				else if (w[0] == max[0]) {
					same.faces![4] = 'sty/roofs/green/790.bmp';
					same.r = 3;
				}
				else if (w[1] == min[1]) {
					same.faces![4] = 'sty/roofs/green/790.bmp';
					same.r = 0;
				}
			}
		}

		export function type1(
			min: [number, number, number],
			max: [number, number, number],
		) {

			const func = (w: [number, number, number]) => {

				let bmp = 'sty/metal/blue/340.bmp';

				let block: propz = {
					// type: 'Block',
					type: 'block',
					_wpos: w
				};

				let ignore = block as any;

				ignore.faces = [];

				if (
					w[0] > min[0] &&
					w[0] < max[0] &&
					w[1] > min[1] &&
					w[1] < max[1] &&
					w[2] < max[2]
				)
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
			}

			loopvec3(min, max, func);
		}

	}

}

export default generators;