import app from "./app.js";

import glob from "./dep/glob.js";
import pts from "./dep/pts.js";
import renderer from "./renderer.js";

import lod, { numbers } from "./lod.js";
import objects from "./objs/misc.js";
import ghooks from "./ghooks.js";
import gtasmr from "./gtasmr.js";
import ped from "./objs/ped.js";
import baseobj from "./objs/baseobj.js";

// the view manages camera movement and the lod

const zeroes: vec2 = [0, 0]

export class view {
	zoom = 0.25
	rpos: vec2 = zeroes
	pos: vec2 = zeroes
	wpos: vec2 = zeroes
	mpos: vec2 = zeroes
	mrpos: vec2 = zeroes
	static make() {
		return new view;
	}
	chart(big: vec2) {
	}
	constructor() {
		new lod.world(10);
	}
	tick() {
		this.move();
		this.chase();
		this.mouse();
		this.stats();
		if (glob.killswitch)
			return;
		let wpos = lod.unproject(this.rpos);
		lod.gworld.update(wpos);
		lod.ggrid.ticks();
	}
	mouse() {
		let mouse = app.mpos();
		mouse = pts.subtract(mouse, pts.divide([renderer.w, renderer.h], 2))
		mouse = pts.mult(mouse, renderer.ndpi);
		mouse = pts.mult(mouse, this.zoom);
		mouse[1] = -mouse[1];
		this.mpos = pts.copy(mouse);
		this.mrpos = pts.add(this.rpos, mouse);
		// now..
		if (app.button(2) >= 1) {
			let w = lod.unproject(this.mrpos);
			let ping = new ped({
				_type: 'direct',
				_wpos: [...w, 0]
			});
			lod.add(ping);
		}
	}
	move() {
		let pan = 5;
		if (app.key('x')) pan *= 10;
		if (app.key('w')) this.rpos[1] += pan;
		if (app.key('s')) this.rpos[1] -= pan;
		if (app.key('a')) this.rpos[0] -= pan;
		if (app.key('d')) this.rpos[0] += pan;
		if (app.key('r')) this.zoom += 0.01;
		if (app.key('f')) this.zoom -= 0.01;
		this.zoom = this.zoom > 1 ? 1 : this.zoom < 0.1 ? 0.1 : this.zoom;
		this.pos = lod.unproject(this.rpos);
		renderer.camera.scale.fromArray([this.zoom, this.zoom, this.zoom]);
	}
	chase() {
		// todo check for null ply
		const time = renderer.delta;
		pts.mult([0, 0], 0);
		let ply = gtasmr.ply.rpos;
		this.rpos = pts.add(pts.mult(pts.subtract(ply, this.rpos), time * 5), this.rpos);
		//this.rpos = pts.mult(this.rpos, this.zoom);
		let inv = pts.inv(this.rpos);
		renderer.scene.position.set(inv[0], inv[1], 0);
	}
	stats() {
		let crunch = ``;
		crunch += `DPI_UPSCALED_RT: ${renderer.DPI_UPSCALED_RT}<br /><br />`;
		crunch += `dpi: ${renderer.ndpi}<br />`;
		crunch += `fps: ${renderer.fps} / ${renderer.delta.toPrecision(3)}<br />`;
		crunch += '<br />';

		crunch += `textures: ${renderer.renderer.info.memory.textures}<br />`;
		crunch += `programs: ${renderer.renderer.info.programs.length}<br />`;
		//crunch += `memory: ${Math.floor(renderer.memory.usedJSHeapSize / 1000000)} / ${Math.floor(renderer.memory.totalJSHeapSize / 1000000)}<br />`;
		crunch += '<br />';

		//crunch += `mouse: ${pts.to_string(App.mouse())}<br />`;
		crunch += `mpos: ${pts.to_string(pts.floor(this.mpos))}<br />`;
		crunch += `mrpos: ${pts.to_string(pts.floor(this.mrpos))}<br />`;
		crunch += '<br />';

		crunch += `view wpos: ${pts.to_string(pts.floor(this.pos))}<br />`;
		crunch += `view zoom: ${this.zoom.toPrecision(2)}<br />`;
		crunch += '<br />';

		//crunch += `world wpos: ${pts.to_string(this.pos)}<br /><br />`;
		crunch += `sectors: ${numbers.chunks[0]} / ${numbers.chunks[1]}<br />`;
		crunch += `game objs: ${numbers.objs[0]} / ${numbers.objs[1]}<br />`;
		crunch += `sprites: ${numbers.sprites[0]} / ${numbers.sprites[1]}<br />`;
		crunch += `blocks: ${numbers.blocks[0]} / ${numbers.blocks[1]}<br />`;
		crunch += '<br />';

		crunch += `controls: click to run, R+F to zoom, C to toggle walk, WASD to move camera<br />`;
		app.set_html('.stats', crunch);
	}
}


export default view;