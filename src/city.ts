import pts from "./dep/pts.js";

import lod from "./lod.js";
import ghooks from "./ghooks.js";
import objects from "./objs/misc.js";
import view from "./view.js";
import sprite from "./sprite.js";
import aabb2 from "./dep/aabb2.js";
import gtasmr from "./gtasmr.js";
import generators from "./city/generators.js";

export namespace city {

	export var sounds: any = { footsteps: [] };

	export function run3d(
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

	const pavement_uv = 0.25;
	const road_uv = 0.2;

	const road_typical = { sty: 'sty/sheets/grey_roads.png', repeat: [road_uv, road_uv], offset: [0, 0] } as sprite.parameters;
	const pavement_typical = { sty: 'sty/floors/green/645.bmp',/*repeat: [pavement_uv, pavement_uv]*/ };
	const pavement_blue = { sty: 'sty/floors/blue/256.bmp' };
	const pavement_mixed = { sty: 'sty/floors/mixed/64.bmp' };
	const block_tenement = { sty: 'sty/commercial/storefront/578.bmp' };

	const make_room = (pos: vec2) => {
		let obj = new lod.obj;
		let properties = { ...block_tenement, bind: obj } as sprite.parameters;
		properties.mask = 'sty/walls/casual/concaveMask.bmp';
		// properties.offset = [pavement_uv * 1, 0];
		new sprite(properties);
		obj.wpos = pts.add(pos, [0.5, 0.5]);
		//obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
		obj.step();
		//GTA.view.add(obj);
	};

	export function creation() {

		const pavement = (pos: vec3) => {
			let sprops = { ...pavement_mixed } as sprite.parameters;
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

	export function load_sounds() {
		for (let i = 0; i < 4; i++) {
			sounds.footsteps[i] = new Audio(`snd/SFX_FOOTSTEP_CONCRETE_${i + 1}.wav`);
			sounds.footsteps[i].volume = 0.1;
		}
	}
}

export default city;