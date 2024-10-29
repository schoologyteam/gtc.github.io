import lod from "../lod.js";
export class baseobj extends lod.obj {
    constructor(oprops) {
        super(undefined);
        this.oprops = oprops;
    }
    _delete() {
    }
    _create() {
    }
    _step() {
        super._step();
    }
}
export default baseobj;
