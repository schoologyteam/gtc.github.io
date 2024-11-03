import aabb2 from "./dep/aabb2.js";
import pts from "./dep/pts.js";
import hooks from "./dep/hooks.js";

import ren from "./renderer.js";
import gtasmr from "./gtasmr.js";
import toggle from "./dep/toggle.js";

export namespace numbers {
	export type tally = [active: number, total: number]

	export var chunks: tally = [0, 0]
	export var sprites: tally = [0, 0]
	export var objs: tally = [0, 0]

	export var blocks: tally = [0, 0]
	export var tiles: tally = [0, 0]
	export var walls: tally = [0, 0]
	export var pawns: tally = [0, 0]
};

namespace lod {
	export const size = 64;

	const chunk_coloration = false;

	const fog_of_war = false;

	const grid_crawl_makes_chunks = true;

	export var gworld: world;
	export var ggrid: grid;

	export var SectorSpan = 2;

	export var stamp = 0; // used only by server slod

	export function register() {
		// hooks.create('sectorCreate')
		// hooks.create('sectorShow')
		// hooks.create('sectorHide')

		// hooks.register('sectorHide', () => { console.log('~'); return false; } );
	}

	export function project(unit: vec2): vec2 {
		return pts.mult(unit, size);
	}

	export function unproject(pixel: vec2): vec2 {
		return pts.divide(pixel, size);
	}

	export function add(obj: obj | undefined) {
		if (!obj)
			return;
		let chunk = gworld.atwpos(obj.wpos);
		chunk.add(obj);
	}

	export function remove(obj: obj) {
		obj.chunk?.remove(obj);
	}

	export class world {
		readonly arrays: chunk[][] = []
		constructor(span) {
			gworld = this;
			new grid(2, 2);
		}
		update(wpos: vec2) {
			ggrid.big = lod.world.big(wpos);
			ggrid.ons();
			ggrid.offs();
		}
		lookup(big: vec2): chunk | undefined {
			if (this.arrays[big[1]] == undefined)
				this.arrays[big[1]] = [];
			return this.arrays[big[1]][big[0]];
		}
		at(big: vec2): chunk {
			return this.lookup(big) || this.make(big);
		}
		atwpos(wpos: vec2 | vec3): chunk {
			return this.at(world.big(wpos));
		}
		protected make(big): chunk {
			let s = this.lookup(big);
			if (s)
				return s;
			s = this.arrays[big[1]][big[0]] = new chunk(big, this);
			return s;
		}
		static big(units: vec2 | vec3): vec2 {
			return pts.floor(pts.divide(units, SectorSpan));
		}
		// todo add(obj) {}
		// todo remove(obj) {}
	}

	export class chunk extends toggle {
		group
		color?
		fog_of_war = false
		readonly small: aabb2;
		readonly objs: obj[] = [];
		constructor(
			public readonly big: vec2,
			readonly world: world
		) {
			super();
			if (chunk_coloration)
				this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
			let min = pts.mult(this.big, SectorSpan);
			let max = pts.add(min, [SectorSpan - 1, SectorSpan - 1]);
			this.small = new aabb2(max, min);
			this.group = new THREE.Group;
			this.group.frustumCulled = false;
			this.group.matrixAutoUpdate = false;
			numbers.chunks[1]++;
			world.arrays[this.big[1]][this.big[0]] = this;
			//console.log('sector');

			hooks.call('sectorCreate', this);

		}
		add(obj: obj) {
			if (!this.objs.includes(obj)) {
				this.objs.push(obj);
				obj.chunk = this;
				if (this.active)
					obj.show();
			}
		}
		remove(obj: obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1) {
				obj.chunk = null;
				return !!this.objs.splice(i, 1).length;
			}
		}
		stacked(wpos: vec2) {
			let stack: obj[] = [];
			for (let obj of this.objs)
				if (pts.equals(wpos, pts.round(obj.wpos)))
					stack.push(obj);
			return stack;
		}
		
		static swap(obj: obj) {
			// Call me whenever you move
			let oldChunk = obj.chunk!;
			let newChunk = oldChunk.world.atwpos(/*pts.round(*/obj.wpos/*)*/);
			// the pts.round causes an impossible to find bug
			if (oldChunk != newChunk) {
				oldChunk.remove(obj);
				newChunk.add(obj);
				if (!newChunk.active)
					obj.hide();
			}
		}
		tick() {
			hooks.call('sectorTick', this);
			//for (let obj of this.objs)
			//	obj.tick();
		}
		show() {
			if (this.on())
				return;
			numbers.chunks[0]++;
			for (const obj of this.objs)
				obj.show();
			ren.scene.add(this.group);
			hooks.call('sectorShow', this);
		}
		hide() {
			if (this.off())
				return;
			numbers.chunks[0]--;
			for (let obj of this.objs)
				obj.hide();
			ren.scene.remove(this.group);
			hooks.call('sectorHide', this);
		}
		dist() {
			return pts.distsimple(this.big, lod.ggrid.big);
		}
		grayscale() {
			this.color = 'gray';
		}
	}

	export class grid {
		big: vec2 = [0, 0];
		public shown: chunk[] = [];
		visibleObjs: obj[] = []
		constructor(
			public spread: number,
			public outside: number
		) {
			lod.ggrid = this;
			if (this.outside < this.spread) {
				console.warn(' outside less than spread ', this.spread, this.outside);
				this.outside = this.spread;
			}
		}
		grow() {
			this.spread++;
			this.outside++;
		}
		shrink() {
			this.spread--;
			this.outside--;
		}
		visible(sector: chunk) {
			return sector.dist() < this.spread;
		}
		ons() {
			// spread = -2; < 2
			for (let y = -this.spread; y < this.spread + 1; y++) {
				for (let x = -this.spread; x < this.spread + 1; x++) {
					let pos = pts.add(this.big, [x, y]);
					let chunk = grid_crawl_makes_chunks ? gworld.at(pos) : gworld.lookup(pos);
					if (!chunk)
						continue;
					if (!chunk.active) {
						this.shown.push(chunk);//
						chunk.show();
						// console.log(' show ');
						// todo why
						// for (let obj of sector.objs)
						// obj.step();
					}
				}
			}
		}
		offs() {
			// Hide sectors
			this.visibleObjs = [];
			let i = this.shown.length;
			while (i--) {
				let chunk: chunk;
				chunk = this.shown[i];
				if (chunk.dist() > this.outside) {
					chunk.hide();
					this.shown.splice(i, 1);
				}
				else {
					chunk.tick();
					this.visibleObjs = this.visibleObjs.concat(chunk.objs);
				}

				if (fog_of_war) {
					if (chunk.dist() == this.outside) {
						//console.log('brim-chunk');
						chunk.fog_of_war = true;
						//sector.color = '#555555';
					}
					else {
						chunk.fog_of_war = false;
						//sector.color = '#ffffff';
					}
				}
			}
		}
		ticks() {
			for (const chunk of this.shown) 
				for (const obj of chunk.objs)
					obj.step();
		}
	}

	interface ObjHints {

	};

	export class obj extends toggle {
		static ids = 0
		id = -1
		wpos: vec2 = [0, 0]
		rpos: vec2 = [0, 0]
		size: vec2 = [64, 64]
		chunk: chunk | null
		bound: aabb2
		expand = .5
		constructor(
			public readonly counts: numbers.tally = numbers.objs) {
			super();
			this.counts[1]++;
			this.id = obj.ids++;
		}
		finalize() {
			// this.hide();
			this.counts[1]--;
		}
		show() {
			if (this.on())
				return;
			this.counts[0]++;
			this.create();
			this.step(); // Cursor fixed the bug
			//this.shape?.show();
		}
		hide() {
			if (this.off())
				return;
			this.counts[0]--;
			this.delete();
			//this.shape?.hide();
			// console.log(' obj.hide ');
		}
		rebound() {
			this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		wtorpos() {
			this.rpos = lod.project(this.wpos);
		}
		rtospos() {
			this.wtorpos();
			return pts.copy(this.rpos);
		}
		create() {
			this._create();
		}
		delete() {
			this._delete();
		}
		step() {
			this._step();
		}
		// implement me
		protected _create() {
			// typically used to create a sprite
			console.warn(' (lod) obj.create ');
		}
		// implement me
		protected _delete() {
			// console.warn(' (lod) obj.delete ');
		}
		// implement me
		protected _step() {
			this.wtorpos();
			this.rebound();
		}
	}

}

export default lod;