import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Group } from "three";
import aabb2 from "./aabb2";
import pts from "./pts";
import Renderer from "./renderer";
export var Counts;
(function (Counts) {
    Counts.Sectors = [0, 0];
    Counts.Objs = [0, 0];
    Counts.Sprites = [0, 0];
    Counts.Blocks = [0, 0];
})(Counts || (Counts = {}));
;
class Toggle {
    constructor() {
        this.active = false;
    }
    isActive() { return this.active; }
    ;
    on() {
        if (this.active) {
            console.warn('already on');
            return true;
            // it was on before
        }
        this.active = true;
        return false;
        // it wasn't on before
    }
    off() {
        if (!this.active) {
            console.warn('already off');
            return true;
        }
        this.active = false;
        return false;
    }
}
var Core;
(function (Core) {
    class Galaxy {
        constructor(span) {
            this.arrays = [];
            this.grid = new Grid(3, 4, this);
        }
        update(wpos) {
            this.grid.big = Galaxy.big(wpos);
            this.grid.offs();
            this.grid.crawl();
        }
        lookup(x, y) {
            if (this.arrays[y] == undefined)
                this.arrays[y] = [];
            return this.arrays[y][x];
        }
        at(x, y) {
            return this.lookup(x, y) || this.make(x, y);
        }
        atwpos(wpos) {
            let big = Galaxy.big(wpos);
            return this.at(big[0], big[1]);
        }
        make(x, y) {
            let s = this.lookup(x, y);
            if (s)
                return s;
            s = this.arrays[y][x] = new Sector(x, y, this);
            return s;
        }
        static big(wpos) {
            return pts.floor(pts.divide(wpos, Galaxy.SectorSpan));
        }
        static unproject(rpos) {
            return pts.divide(rpos, Core.Galaxy.Unit);
        }
    }
    Galaxy.Unit = 64;
    Galaxy.SectorSpan = 2;
    Core.Galaxy = Galaxy;
    ;
    class Sector extends Toggle {
        objs_() { return this.objs; }
        constructor(x, y, galaxy) {
            var _a;
            super();
            this.x = x;
            this.y = y;
            this.galaxy = galaxy;
            this.objs = [];
            this.big = [x, y];
            this.group = new Group;
            Counts.Sectors[1]++;
            (_a = Sector.hooks) === null || _a === void 0 ? void 0 : _a.onCreate(this);
        }
        add(obj) {
            let i = this.objs.indexOf(obj);
            if (i == -1) {
                this.objs.push(obj);
                obj.sector = this;
                if (this.isActive())
                    obj.show();
            }
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1) {
                obj.sector = null;
                return !!this.objs.splice(i, 1).length;
            }
        }
        swap(obj) {
            var _a;
            let sector = this.galaxy.atwpos(obj.wpos);
            if (obj.sector != sector) {
                // console.warn('obj sector not sector');
                (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
                sector.add(obj);
                if (!this.galaxy.grid.visible(sector)) {
                    obj.hide();
                }
            }
        }
        tick() {
            var _a;
            (_a = Sector.hooks) === null || _a === void 0 ? void 0 : _a.onTick(this);
            //for (let obj of this.objs)
            //	obj.tick();
        }
        show() {
            if (this.on())
                return;
            Counts.Sectors[0]++;
            Util.SectorShow(this);
            //console.log(' sector show ');
            for (let obj of this.objs)
                obj.show();
            Renderer.scene.add(this.group);
        }
        hide() {
            if (this.off())
                return;
            Counts.Sectors[0]--;
            Util.SectorHide(this);
            //console.log(' sector hide ');
            for (let obj of this.objs)
                obj.hide();
            Renderer.scene.remove(this.group);
        }
    }
    Core.Sector = Sector;
    class Grid {
        constructor(spread, outside, galaxy) {
            this.spread = spread;
            this.outside = outside;
            this.galaxy = galaxy;
            this.big = [0, 0];
            this.shown = [];
        }
        visible(sector) {
            return pts.dist(sector.big, this.big) < this.spread;
        }
        crawl() {
            for (let y = -this.spread; y < this.spread; y++) {
                for (let x = -this.spread; x < this.spread; x++) {
                    let pos = pts.add(this.big, [x, y]);
                    let sector = this.galaxy.lookup(pos[0], pos[1]);
                    if (!sector)
                        continue;
                    if (!sector.isActive()) {
                        this.shown.push(sector);
                        sector.show();
                    }
                }
            }
        }
        offs() {
            let allObjs = [];
            let i = this.shown.length;
            while (i--) {
                let sector;
                sector = this.shown[i];
                allObjs = allObjs.concat(sector.objs_());
                sector.tick();
                if (pts.dist(sector.big, this.big) > this.outside) {
                    sector.hide();
                    this.shown.splice(i, 1);
                }
            }
            for (let obj of allObjs)
                obj.tick();
        }
    }
    Core.Grid = Grid;
    ;
    class Obj extends Toggle {
        constructor(stuffs) {
            super();
            this.wpos = [0, 0];
            this.rpos = [0, 0];
            this.size = [64, 64];
            this.rz = 0;
            Counts.Objs[1]++;
        }
        finalize() {
            this.hide();
            Counts.Objs[1]--;
        }
        show() {
            var _a;
            if (this.on())
                return;
            Counts.Objs[0]++;
            this.update();
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.show();
        }
        hide() {
            var _a;
            if (this.off())
                return;
            Counts.Objs[0]--;
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.hide();
        }
        wtorpos() {
            this.rpos = pts.mult(this.wpos, Galaxy.Unit);
        }
        tick() {
        }
        make() {
            console.warn('obj.make');
        }
        update() {
            var _a;
            this.wtorpos();
            this.bound();
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.update();
        }
        bound() {
            let div = pts.divide(this.size, 2);
            this.aabb = new aabb2(pts.inv(div), div);
            this.aabb.translate(this.rpos);
        }
        moused(mouse) {
            var _a;
            if ((_a = this.aabb) === null || _a === void 0 ? void 0 : _a.test(new aabb2(mouse, mouse)))
                return true;
        }
    }
    Core.Obj = Obj;
    ;
    class Shape extends Toggle {
        constructor(properties, counts) {
            super();
            this.properties = properties;
            this.counts = counts;
            this.properties.bind.shape = this;
            this.counts[1]++;
        }
        update() {
        }
        create() {
        }
        dispose() {
        }
        finalize() {
            this.hide();
            this.counts[1]--;
        }
        show() {
            if (this.on())
                return;
            this.create();
            this.counts[0]++;
        }
        hide() {
            if (this.off())
                return;
            this.dispose();
            this.counts[0]--;
        }
    }
    Core.Shape = Shape;
})(Core || (Core = {}));
export var Util;
(function (Util) {
    function SectorShow(sector) {
        let breadth = Core.Galaxy.Unit * Core.Galaxy.SectorSpan;
        let any = sector;
        any.geometry = new PlaneBufferGeometry(breadth, breadth, 2, 2);
        any.material = new MeshBasicMaterial({
            wireframe: true,
            transparent: true,
            color: 'red'
        });
        any.mesh = new Mesh(any.geometry, any.material);
        any.mesh.position.fromArray([sector.x * breadth + breadth / 2, sector.y * breadth + breadth / 2, 0]);
        any.mesh.updateMatrix();
        any.mesh.frustumCulled = false;
        any.mesh.matrixAutoUpdate = false;
        //Renderer.scene.add(any.mesh);
    }
    Util.SectorShow = SectorShow;
    function SectorHide(sector) {
        let any = sector;
        Renderer.scene.remove(any.mesh);
    }
    Util.SectorHide = SectorHide;
})(Util || (Util = {}));
export default Core;
