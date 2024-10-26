import app from "./app.js";

import pts from "./dep/pts.js";
import lod from "./lod.js";
import renderer from "./renderer.js";
import view from "./view.js";
import game from "./game.js";
import gtasmr from "./gtasmr.js";
import city from "./city.js";

namespace objects {

	export class floor extends lod.obj {
		sty = 'sty/floors/mixed/78.bmp'
		sprite?: game.sprite
		constructor() {
			super(undefined);
			this.size = [64, 64];
		}
		protected _delete() {
			this.sprite?.dispose();
		}
		protected _create() {
			new game.sprite({
				bind: this,
				sty: this.sty,
				z: 0
			});
		}
	}
	
}

export default objects;