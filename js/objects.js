import lod from "./lod.js";
import game from "./game.js";
var objects;
(function (objects) {
    class floor extends lod.obj {
        constructor() {
            super(undefined);
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
        }
    }
    objects.floor = floor;
})(objects || (objects = {}));
export default objects;
