import city from "../city.js";
import game from "../game.js";
import lod from "../lod.js";
import renderer from "../renderer.js";
const ped_uv = [0.125, 0.043478260869565216];
export class ped extends lod.obj {
    constructor() {
        super(undefined);
        this.rz = 0;
        this.remap = -1;
        this.timer = 0;
        this.row = 0;
        this.column = 0;
        this.walking = false;
        this.running = false;
        this.idling = false;
        this.size = [33, 33];
    }
    _delete() {
        var _a;
        console.log('delete ped');
        (_a = this.sprite) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    _create() {
        if (this.remap == -1)
            this.remap = Math.floor(Math.random() * 53);
        new game.sprite({
            bind: this,
            sty: `sty/ped/template_${this.remap}.png`,
            blur: `sty/ped/blur.png`,
            repeat: ped_uv,
            z: 1
        });
    }
    _step() {
        var _a;
        this.timer += renderer.delta;
        if ((this.walking || this.running) && this.timer > (this.walking ? 0.11 : 0.08)) {
            this.column = (this.column < 7) ? this.column + 1 : 0;
            this.timer = 0;
            if (this.column == 1 || this.column == 5)
                city.sounds.footsteps[Math.floor(Math.random() * 4)].play();
        }
        else if (this.idling && this.timer > 0.14) {
            if (this.column == 7)
                this.row = 8;
            this.column = (this.column < 7) ? this.column + 1 : 0;
            this.timer = 0;
            if (this.column == 4 && this.row == 8)
                this.idling = false;
        }
        if ((!this.idling && !this.walking && !this.running)) {
            this.column = 0;
            this.row = 7;
        }
        if (this.timer > 3) {
            this.idling = true;
            this.column = 0;
            this.row = 7;
            this.timer = 0;
        }
        if (this.sprite)
            this.sprite.props.offset = [ped_uv[0] * this.column, -ped_uv[1] * this.row];
        (_a = this.sprite) === null || _a === void 0 ? void 0 : _a.step();
        super._step();
        lod.chunk.swap(this);
    }
}
export default ped;
