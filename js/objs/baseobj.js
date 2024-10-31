import lod from "../lod.js";
export class baseobj extends lod.obj {
    constructor(props) {
        super(undefined);
        this.props = props;
        this.wpos = props.fakewpos;
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
