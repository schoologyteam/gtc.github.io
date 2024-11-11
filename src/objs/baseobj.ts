import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import lod from "../lod.js";

export namespace baseobj {

}

// A Baseobj is used by gtasmr classes

export class baseobj extends lod.obj {
	r = 0
	z = 0
	constructor(public props: propz) {
		super(undefined);
		this.wpos = pts.copy(props._wpos);
		this.z = props._wpos[2];
		this.r = props._r || 0;
		this.wtorpos();
	}
	protected override _delete() {
	}
	protected override _create() {
		console.warn(' baseobj empty create ');
	}
	protected override _step() {
		super._step();
	}
}

export default baseobj;