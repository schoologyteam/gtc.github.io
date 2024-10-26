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
