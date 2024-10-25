import App from "./app.js";
import pts from "./pts.js";
import Renderer from "./renderer.js";
import Core, { Counts } from "./core.js";
import Objects from "./objects.js";
import GTA from "./gta.js";
// the view manages everthng dont ask
export class View {
    static make() {
        return new View;
    }
    chart(big) {
    }
    constructor() {
        this.zoom = 0.25;
        this.rpos = [0, 0];
        this.pos = [0, 0];
        this.wpos = [0, 0];
        this.mpos = [0, 0];
        this.mrpos = [0, 0];
        this.galaxy = new Core.Galaxy(10);
    }
    add(obj) {
        let sector = this.galaxy.atwpos(obj.wpos);
        sector.add(obj);
    }
    remove(obj) {
        var _a;
        (_a = obj.sector) === null || _a === void 0 ? void 0 : _a.remove(obj);
    }
    tick() {
        this.move();
        this.chase();
        this.mouse();
        this.stats();
        let wpos = Core.Galaxy.unproject(this.rpos);
        this.galaxy.update(wpos);
    }
    mouse() {
        let mouse = App.mouse();
        mouse = pts.subtract(mouse, pts.divide([Renderer.w, Renderer.h], 2));
        mouse = pts.mult(mouse, Renderer.ndpi);
        mouse = pts.mult(mouse, this.zoom);
        mouse[1] = -mouse[1];
        this.mpos = pts.clone(mouse);
        this.mrpos = pts.add(this.rpos, mouse);
        // now..
        if (App.button(2) >= 1) {
            let ping = new Objects.Ped;
            ping.wpos = Core.Galaxy.unproject(this.mrpos);
            ping.make();
            this.add(ping);
        }
    }
    move() {
        let pan = 5;
        if (App.key('x'))
            pan *= 10;
        if (App.key('w'))
            this.rpos[1] += pan;
        if (App.key('s'))
            this.rpos[1] -= pan;
        if (App.key('a'))
            this.rpos[0] -= pan;
        if (App.key('d'))
            this.rpos[0] += pan;
        if (App.key('r'))
            this.zoom += 0.01;
        if (App.key('f'))
            this.zoom -= 0.01;
        this.zoom = this.zoom > 1 ? 1 : this.zoom < 0.1 ? 0.1 : this.zoom;
        this.pos = Core.Galaxy.unproject(this.rpos);
        Renderer.camera.scale.fromArray([this.zoom, this.zoom, this.zoom]);
    }
    chase() {
        const time = Renderer.delta;
        pts.mult([0, 0], 0);
        let ply = GTA.ply.rpos;
        this.rpos = pts.add(pts.mult(pts.subtract(ply, this.rpos), time * 5), this.rpos);
        //this.rpos = pts.mult(this.rpos, this.zoom);
        let inv = pts.inv(this.rpos);
        Renderer.scene.position.set(inv[0], inv[1], 0);
    }
    stats() {
        let crunch = ``;
        crunch += `DPI_UPSCALED_RT: ${Renderer.DPI_UPSCALED_RT}<br /><br />`;
        crunch += `dpi: ${Renderer.ndpi}<br />`;
        crunch += `fps: ${Renderer.fps} / ${Renderer.delta.toPrecision(3)}<br />`;
        crunch += '<br />';
        crunch += `textures: ${Renderer.renderer.info.memory.textures}<br />`;
        crunch += `programs: ${Renderer.renderer.info.programs.length}<br />`;
        crunch += `memory: ${Math.floor(Renderer.memory.usedJSHeapSize / 1000000)} / ${Math.floor(Renderer.memory.totalJSHeapSize / 1000000)}<br />`;
        crunch += '<br />';
        //crunch += `mouse: ${pts.to_string(App.mouse())}<br />`;
        crunch += `mpos: ${pts.to_string(pts.floor(this.mpos))}<br />`;
        crunch += `mrpos: ${pts.to_string(pts.floor(this.mrpos))}<br />`;
        crunch += '<br />';
        crunch += `view wpos: ${pts.to_string(pts.floor(this.pos))}<br />`;
        crunch += `view zoom: ${this.zoom.toPrecision(2)}<br />`;
        crunch += '<br />';
        //crunch += `world wpos: ${pts.to_string(this.pos)}<br /><br />`;
        crunch += `sectors: ${Counts.Sectors[0]} / ${Counts.Sectors[1]}<br />`;
        crunch += `game objs: ${Counts.Objs[0]} / ${Counts.Objs[1]}<br />`;
        crunch += `sprites: ${Counts.Sprites[0]} / ${Counts.Sprites[1]}<br />`;
        crunch += `blocks: ${Counts.Blocks[0]} / ${Counts.Blocks[1]}<br />`;
        crunch += '<br />';
        crunch += `controls: click to run, R+F to zoom, C to toggle walk, WASD to move camera<br />`;
        App.sethtml('.stats', crunch);
    }
}
export default View;
