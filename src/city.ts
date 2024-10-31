import pts from "./dep/pts.js";

import lod from "./lod.js";
import ghooks from "./ghooks.js";
import objects from "./objs/misc.js";
import view from "./view.js";
import sprite from "./sprite.js";
import aabb2 from "./dep/aabb2.js";
import gtasmr from "./gtasmr.js";

export namespace city {

	export var sounds: any = { footsteps: [] };

	namespace generator {
		export function run(
			min: vec2,
			max: vec2,
			func: (pos: vec2) => any) {
			let x = min[0];
			for (; x <= max[0]; x++) {
				let y = min[1];
				for (; y <= max[1]; y++) {
					func([x, y]);
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
		properties.mask = 'sty/walls/casual/concaveMask.bmp'
		// properties.offset = [pavement_uv * 1, 0];
		new sprite(properties);
		obj.wpos = pts.add(pos, [0.5, 0.5]);
		//obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
		obj.step();
		//GTA.view.add(obj);
	};

	export function creation() {

		const pavement = (pos: vec2) => {
			let sprops = { ...pavement_mixed } as sprite.parameters;
			let floor = new objects.floor({ name: 'pavement', fakewpos: pos as unknown as vec3 });
			floor.sprops = sprops;

			floor.wpos = pos;
			floor.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
			floor.step();
			gtasmr.gview.add(floor);
		};

		const road = (pos: vec2) => {
			/*let sprops = { ...pavement_mixed } as sprite.parameters;
			let floor = new objects.floor(sprops);
			floor.wpos = pos;
			floor.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
			floor.step();
			gtasmr.gview.add(floor);*/
		};

		/*const tenement = (pos: vec2) => {
			let obj = new lod.obj();
			let sprops = { ...block_tenement, bind: obj } as sprite.parameters;
			sprops.mask = 'sty/interiors/casual/concaveMask.bmp'
			new sprite(sprops);
			obj.step();
			gtasmr.gview.add(obj);
		}*/

		pts.area_every(new aabb2([-100, 2], [+100, 3]), pavement);
		pts.area_every(new aabb2([-100, -1], [+100, -1]), pavement);

		pts.area_every(new aabb2([0, -2], [0 - 3, -2 - 1]), make_room);
		//pts.area_every(new aabb2([-10, 3], [+10, 3]), tenement);
	}

	export function load_sounds() {
		for (let i = 0; i < 4; i++) {
			sounds.footsteps[i] = new Audio(`snd/SFX_FOOTSTEP_CONCRETE_${i + 1}.wav`);
			sounds.footsteps[i].volume = 0.1;
		}
	}
}

export default city;