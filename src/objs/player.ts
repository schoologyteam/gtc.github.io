import app from "../app.js";
import pts from "../dep/pts.js";
import gtasmr from "../gtasmr.js";
import renderer from "../renderer.js";
import ped from "./ped.js";

const ped_uv = [0.125, 0.043478260869565216] as vec2;

export class player extends ped {
	stopped = false;
	static instance() {
		let ply = new player({ type: 'ply', _wpos: [0, 0, 0] });
		return ply;
	}
	constructor(props: propz) {
		super({
			name: 'a player',
			...props,
			type: 'ply',
		});
		this.remap = 52;
	}
	protected _step() {
		this.walking = false;
		this.running = false;
		let dist = pts.dist(this.rpos, gtasmr.gview.mrpos);
		const range = 48;
		if (app.key('c') == 1)
			this.stopped = !this.stopped;
		if (!this.stopped && dist > range) {
			this.idling = false;
			let velocity = -0.75;
			if (app.button(0) >= 1) {
				velocity = -1.5;
				this.running = true;
				this.row = 1;
			}
			else {
				this.walking = true;
				this.row = 0;
			}
			this.rz = -Math.atan2(
				this.rpos[0] - gtasmr.gview.mrpos[0],
				this.rpos[1] - gtasmr.gview.mrpos[1]);
			velocity *= renderer.delta;
			this.wpos = pts.add(this.wpos, [
				velocity * Math.sin(-this.rz),
				velocity * Math.cos(-this.rz)
			]);
		}
		super._step();
	}
}

export default player;