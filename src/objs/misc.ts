import app from "../app.js";

import pts from "../dep/pts.js";
import lod from "../lod.js";
import renderer from "../renderer.js";
import view from "../view.js";
import sprite from "../sprite.js";
import gtasmr from "../gtasmr.js";
import city from "../city.js";
import baseobj from "./baseobj.js";

namespace objects {

	export class floor extends baseobj {
		sty = 'sty/floors/mixed/78.bmp'
		sprite?: sprite
		constructor(
			public sprops: sprite.parameters) {
			super({ name: 'a floor' });
			this.size = [64, 64];
		}
		protected override _delete() {
			this.sprite?.dispose();
		}
		protected override _create() {
			let sprops = { ...this.sprops, bind: this } as sprite.parameters;
			sprops.color = gtasmr.sample(['red', 'salmon', 'pink', 'cyan'])
			new sprite(sprops);
			//this.sprite!.rposoffset = pts.mult([0.5, 0], lod.size);
			this.sprite!.create();
		}
	}

}

export default objects;