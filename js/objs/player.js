import app from "../app.js";
import pts from "../dep/pts.js";
import gtasmr from "../gtasmr.js";
import renderer from "../renderer.js";
import ped from "./ped.js";
const ped_uv = [0.125, 0.043478260869565216];
export class player extends ped {
    static instance() {
        let ply = new player({
            _type: 'dud',
            _wpos: [0, 0, 0],
            name: 'the player',
        });
        return ply;
    }
    constructor(props) {
        super(Object.assign({ name: 'a player' }, props));
        this.stopped = false;
        // Because of the poor type system, type is now ped
        this.props._type = 'ply';
        console.log(' ply after super ', this);
        // this.remap = 52; // Pink man
        // this.remap = gtasmr.sample([52, 47]);
        // 16 Scrub
    }
    _step() {
        this.walking = false;
        this.running = false;
        let dist = pts.dist(this.rpos, gtasmr.gview.mrpos);
        const range = 48;
        if (app.key('c') == 1)
            this.stopped = !this.stopped;
        if (!this.stopped && dist > range) {
            this.idling = false;
            let velocity = -0.75;
            if (app.button(0) >= 1) {
                velocity = -1.5;
                this.running = true;
                this.row = 1;
            }
            else {
                this.walking = true;
                this.row = 0;
            }
            this.r = -Math.atan2(this.rpos[0] - gtasmr.gview.mrpos[0], this.rpos[1] - gtasmr.gview.mrpos[1]);
            velocity *= renderer.delta;
            this.wpos = pts.add(this.wpos, [
                velocity * Math.sin(-this.r),
                velocity * Math.cos(-this.r)
            ]);
        }
        super._step();
    }
}
export default player;
