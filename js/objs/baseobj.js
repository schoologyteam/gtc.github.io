import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import lod from "../lod.js";
export class baseobj extends lod.obj {
    constructor(props) {
        super(undefined);
        this.props = props;
        this.r = 0; // rotation
        this.z = 0; // third axis
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
        if (!this.active) {
            console.error(' baseobj step when inactive ', this);
            glob.killswitch = true;
        }
        super._step();
    }
}
export default baseobj;
