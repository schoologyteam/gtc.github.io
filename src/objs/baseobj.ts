import lod from "../lod.js";

type oproptype =
	'Car' | 'Ped' | 'Ply' | 'Block' | 'Floor';

export namespace baseobj {

}

export class baseobj extends lod.obj {
	constructor(public props: propz) {
		super(undefined);
		this.wpos = props.fakewpos as unknown as vec2;
	}
	protected override _delete() {
	}
	protected override _create() {
	}
	protected override _step() {
		super._step();
	}
}

export default baseobj;