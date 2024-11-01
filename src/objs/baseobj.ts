import pts from "../dep/pts.js";
import lod from "../lod.js";

type oproptype =
	'Car' | 'Ped' | 'Ply' | 'Block' | 'Floor';

export namespace baseobj {

}

export class baseobj extends lod.obj {
	r = 0 // rotation
	z = 0 // third axis
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