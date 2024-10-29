import lod from "../lod.js";

interface unnamed {
	name: string
}
export class baseobj extends lod.obj {
	constructor(public oprops: unnamed) {
		super(undefined);
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