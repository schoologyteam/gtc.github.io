import lod from "../lod.js";
import game from "../game.js";
import baseobj from "./baseobj.js";
var objects;
(function (objects) {
    class floor extends baseobj {
        constructor() {
            super();
            this.sty = 'sty/floors/mixed/78.bmp';
            this.size = [64, 64];
        }
        _delete() {
            var _a;
            (_a = this.sprite) === null || _a === void 0 ? void 0 : _a.dispose();
        }
        _create() {
            new game.sprite({
                bind: this,
                sty: this.sty,
                z: 0
            });
            // todo lod project doesn't make sense in 3d
            // just use a gtasmr.size multiplication from now on
            this.sprite.rposoffset = lod.project([0.5, 0.5]);
        }
    }
    objects.floor = floor;
})(objects || (objects = {}));
export default objects;
