import pts from "../dep/pts.js";
import lod from "../lod.js";
// A Baseobj is used by gtasmr classes
export class baseobj extends lod.obj {
    constructor(props) {
        super(undefined);
        this.props = props;
        this.r = 0;
        this.z = 0;
        this.wpos = pts.copy(props._wpos);
        this.z = props._wpos[2];
        this.r = props._r || 0;
        this.wtorpos();
    }
    _delete() {
    }
    _create() {
        console.warn(' baseobj empty create ');
    }
    _step() {
        super._step();
    }
}
export default baseobj;
