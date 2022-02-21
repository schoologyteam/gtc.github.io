var GTASMR = (function (exports, THREE) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);

    class pts {
        static pt(a) {
            return { x: a[0], y: a[1] };
        }
        static clone(zx) {
            return [zx[0], zx[1]];
        }
        static make(n, m) {
            return [n, m];
        }
        static area_every(bb, callback) {
            let y = bb.min[1];
            for (; y <= bb.max[1]; y++) {
                let x = bb.max[0];
                for (; x >= bb.min[0]; x--) {
                    callback([x, y]);
                }
            }
        }
        /*
        static project(a: vec2): vec2 {
            return [a[0] / 2 + a[1] / 2, a[1] / 4 - a[0] / 4];
        }

        static unproject(a: vec2): vec2 {
            return [a[0] - a[1] * 2, a[1] * 2 + a[0]];
        }
        */
        static to_string(a) {
            const pr = (b) => b != undefined ? `, ${b}` : '';
            return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
        }
        static equals(a, b) {
            return a[0] == b[0] && a[1] == b[1];
        }
        /*
        static clamp(a: vec2, min: vec2, max: vec2): vec2 {
            const clamp = (val, min, max) =>
                val > max ? max : val < min ? min : val;
            return [clamp(a[0], min[0], max[0]), clamp(a[1], min[1], max[1])];
        }
        */
        static floor(a) {
            return [Math.floor(a[0]), Math.floor(a[1])];
        }
        static ceil(a) {
            return [Math.ceil(a[0]), Math.ceil(a[1])];
        }
        static inv(a) {
            return [-a[0], -a[1]];
        }
        static mult(a, n, m) {
            return [a[0] * n, a[1] * (m || n)];
        }
        static divide(a, n, m) {
            return [a[0] / n, a[1] / (m || n)];
        }
        static subtract(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
        static add(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
        static abs(a) {
            return [Math.abs(a[0]), Math.abs(a[1])];
        }
        static min(a, b) {
            return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
        }
        static max(a, b) {
            return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
        }
        static together(zx) {
            return zx[0] + zx[1];
        }
        // https://vorg.github.io/pex/docs/pex-geom/Vec2.html
        static dist(a, b) {
            let dx = b[0] - a[0];
            let dy = b[1] - a[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
        static distsimple(a, b) {
            let dx = Math.abs(b[0] - a[0]);
            let dy = Math.abs(b[1] - a[1]);
            return Math.min(dx, dy);
        }
        ;
    }

    var TEST;
    (function (TEST) {
        TEST[TEST["Outside"] = 0] = "Outside";
        TEST[TEST["Inside"] = 1] = "Inside";
        TEST[TEST["Overlap"] = 2] = "Overlap";
    })(TEST || (TEST = {}));
    class aabb2 {
        constructor(a, b) {
            this.min = this.max = [...a];
            if (b) {
                this.extend(b);
            }
        }
        static dupe(bb) {
            return new aabb2(bb.min, bb.max);
        }
        extend(v) {
            this.min = pts.min(this.min, v);
            this.max = pts.max(this.max, v);
        }
        diagonal() {
            return pts.subtract(this.max, this.min);
        }
        center() {
            return pts.add(this.min, pts.mult(this.diagonal(), 0.5));
        }
        translate(v) {
            this.min = pts.add(this.min, v);
            this.max = pts.add(this.max, v);
        }
        test(b) {
            if (this.max[0] < b.min[0] || this.min[0] > b.max[0] ||
                this.max[1] < b.min[1] || this.min[1] > b.max[1])
                return 0;
            if (this.min[0] <= b.min[0] && this.max[0] >= b.max[0] &&
                this.min[1] <= b.min[1] && this.max[1] >= b.max[1])
                return 1;
            return 2;
        }
    }
    aabb2.TEST = TEST;

    var App;
    (function (App) {
        let KEY;
        (function (KEY) {
            KEY[KEY["OFF"] = 0] = "OFF";
            KEY[KEY["PRESS"] = 1] = "PRESS";
            KEY[KEY["WAIT"] = 2] = "WAIT";
            KEY[KEY["AGAIN"] = 3] = "AGAIN";
            KEY[KEY["UP"] = 4] = "UP";
        })(KEY = App.KEY || (App.KEY = {}));
        var keys = {};
        var buttons = {};
        var pos = [0, 0];
        App.salt = 'x';
        App.wheel = 0;
        function onkeys(event) {
            const key = event.key.toLowerCase();
            if ('keydown' == event.type)
                keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
            else if ('keyup' == event.type)
                keys[key] = KEY.UP;
            if (event.keyCode == 114)
                event.preventDefault();
        }
        App.onkeys = onkeys;
        function key(k) {
            return keys[k];
        }
        App.key = key;
        function button(b) {
            return buttons[b];
        }
        App.button = button;
        function mouse() {
            return [...pos];
        }
        App.mouse = mouse;
        function boot(version) {
            App.salt = version;
            function onmousemove(e) { pos[0] = e.clientX; pos[1] = e.clientY; }
            function onmousedown(e) { buttons[e.button] = 1; }
            function onmouseup(e) { buttons[e.button] = 0; }
            function onwheel(e) { App.wheel = e.deltaY < 0 ? 1 : -1; }
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
            Renderer$1.init();
            exports.GTA.init();
            loop();
        }
        App.boot = boot;
        function delay() {
            for (let i in keys) {
                if (KEY.PRESS == keys[i])
                    keys[i] = KEY.WAIT;
                else if (KEY.UP == keys[i])
                    keys[i] = KEY.OFF;
            }
        }
        App.delay = delay;
        function loop(timestamp) {
            requestAnimationFrame(loop);
            Renderer$1.update();
            exports.GTA.tick();
            Renderer$1.render();
            App.wheel = 0;
            for (let b of [0, 1])
                if (buttons[b] == 1)
                    buttons[b] = 2;
            delay();
        }
        App.loop = loop;
        function sethtml(selector, html) {
            let element = document.querySelectorAll(selector)[0];
            element.innerHTML = html;
        }
        App.sethtml = sethtml;
    })(App || (App = {}));
    window['App'] = App;
    var App$1 = App;

    const fragmentPost = `
// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	clr.rgb = mix(clr.rgb, vec3(0.5), 0.0);
	gl_FragColor = clr;
}`;
    const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
    // three quarter
    var Renderer;
    (function (Renderer) {
        Renderer.DPI_UPSCALED_RT = true;
        Renderer.ndpi = 1;
        Renderer.delta = 0;
        //export var ambientLight: AmbientLight
        //export var directionalLight: DirectionalLight
        function update() {
            Renderer.delta = Renderer.clock.getDelta();
            if (Renderer.delta > 2)
                Renderer.delta = 0.016;
            //filmic.composer.render();
        }
        Renderer.update = update;
        var reset = 0;
        var frames = 0;
        // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
        function calc() {
            const s = Date.now() / 1000;
            frames++;
            if (s - reset >= 1) {
                reset = s;
                Renderer.fps = frames;
                frames = 0;
            }
            Renderer.memory = window.performance.memory;
        }
        Renderer.calc = calc;
        function render() {
            calc();
            Renderer.renderer.setRenderTarget(Renderer.target);
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scene, Renderer.camera);
            Renderer.renderer.setRenderTarget(null);
            Renderer.renderer.clear();
            Renderer.renderer.render(Renderer.scenert, Renderer.camera2);
        }
        Renderer.render = render;
        function init() {
            console.log('renderer init');
            Renderer.clock = new THREE.Clock();
            Renderer.scene = new THREE.Scene();
            Renderer.scene.background = new THREE.Color('#292929');
            Renderer.scenert = new THREE.Scene();
            Renderer.ambientLight = new THREE.AmbientLight(0x3a454f);
            Renderer.directionalLight = new THREE.DirectionalLight(0x355886, 1.0);
            Renderer.directionalLight.position.set(0, 0, 1);
            Renderer.scene.add(Renderer.directionalLight);
            Renderer.scene.add(Renderer.directionalLight.target);
            Renderer.scene.add(Renderer.ambientLight);
            if (Renderer.DPI_UPSCALED_RT)
                Renderer.ndpi = window.devicePixelRatio;
            Renderer.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE__default["default"].NearestFilter,
                magFilter: THREE__default["default"].NearestFilter,
                format: THREE__default["default"].RGBFormat
            });
            Renderer.renderer = new THREE.WebGLRenderer({ antialias: false });
            Renderer.renderer.setPixelRatio(Renderer.ndpi);
            Renderer.renderer.setSize(100, 100);
            Renderer.renderer.autoClear = true;
            Renderer.renderer.setClearColor(0xffffff, 0);
            document.body.appendChild(Renderer.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
            Renderer.materialPost = new THREE.ShaderMaterial({
                uniforms: { tDiffuse: { value: Renderer.target.texture } },
                vertexShader: vertexScreen,
                fragmentShader: fragmentPost,
                depthWrite: false
            });
            onWindowResize();
            Renderer.quadPost = new THREE.Mesh(Renderer.plane, Renderer.materialPost);
            //quadPost.position.z = -100;
            Renderer.scenert.add(Renderer.quadPost);
            window.Renderer = Renderer;
        }
        Renderer.init = init;
        function onWindowResize() {
            Renderer.w = Renderer.w2 = window.innerWidth;
            Renderer.h = Renderer.h2 = window.innerHeight;
            if (Renderer.DPI_UPSCALED_RT) {
                Renderer.w2 = Renderer.w * Renderer.ndpi;
                Renderer.h2 = Renderer.h * Renderer.ndpi;
                if (Renderer.w2 % 2 != 0) {
                    Renderer.w2 -= 1;
                }
                if (Renderer.h2 % 2 != 0) {
                    Renderer.h2 -= 1;
                }
            }
            console.log(`window inner [${Renderer.w}, ${Renderer.h}], new is [${Renderer.w2}, ${Renderer.h2}]`);
            Renderer.target.setSize(Renderer.w2, Renderer.h2);
            Renderer.plane = new THREE.PlaneBufferGeometry(Renderer.w2, Renderer.h2);
            if (Renderer.quadPost)
                Renderer.quadPost.geometry = Renderer.plane;
            /*camera = new PerspectiveCamera(
                70, window.innerWidth / window.innerHeight, 1, 3000);
            //camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
            camera.updateProjectionMatrix();
            camera.position.z = 300;*/
            Renderer.camera = ortographic_camera(Renderer.w2, Renderer.h2);
            Renderer.camera.updateProjectionMatrix();
            Renderer.camera2 = ortographic_camera(Renderer.w2, Renderer.h2);
            Renderer.camera2.updateProjectionMatrix();
            Renderer.renderer.setSize(Renderer.w, Renderer.h);
        }
        let mem = [];
        function load_texture(file, key) {
            if (mem[key || file])
                return mem[key || file];
            let texture = new THREE.TextureLoader().load(file + `?v=${App$1.salt}`, () => {
                //renderer.initTexture(texture);
            });
            texture.generateMipmaps = false;
            texture.center.set(0, 1);
            texture.magFilter = THREE__default["default"].NearestFilter;
            texture.minFilter = THREE__default["default"].NearestFilter;
            //texture.magFilter = THREE.LinearFilter;
            //texture.minFilter = THREE.LinearFilter;
            mem[key || file] = texture;
            return texture;
        }
        Renderer.load_texture = load_texture;
        function make_render_target(w, h) {
            const o = {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            };
            let target = new THREE.WebGLRenderTarget(w, h, o);
            return target;
        }
        Renderer.make_render_target = make_render_target;
        function ortographic_camera(w, h) {
            let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
            camera.updateProjectionMatrix();
            return camera;
        }
        Renderer.ortographic_camera = ortographic_camera;
        function erase_children(group) {
            while (group.children.length > 0)
                group.remove(group.children[0]);
        }
        Renderer.erase_children = erase_children;
    })(Renderer || (Renderer = {}));
    var Renderer$1 = Renderer;

    var Counts;
    (function (Counts) {
        Counts.Sectors = [0, 0];
        Counts.Objs = [0, 0];
        Counts.Sprites = [0, 0];
        Counts.Blocks = [0, 0];
    })(Counts || (Counts = {}));
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
        class Sector extends Toggle {
            constructor(x, y, galaxy) {
                var _a;
                super();
                this.x = x;
                this.y = y;
                this.galaxy = galaxy;
                this.objs = [];
                this.big = [x, y];
                this.group = new THREE.Group;
                Counts.Sectors[1]++;
                (_a = Sector.hooks) === null || _a === void 0 ? void 0 : _a.onCreate(this);
            }
            objs_() { return this.objs; }
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
                Renderer$1.scene.add(this.group);
            }
            hide() {
                if (this.off())
                    return;
                Counts.Sectors[0]--;
                Util.SectorHide(this);
                //console.log(' sector hide ');
                for (let obj of this.objs)
                    obj.hide();
                Renderer$1.scene.remove(this.group);
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
        class Obj extends Toggle {
            constructor() {
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
    var Util;
    (function (Util) {
        function SectorShow(sector) {
            let breadth = Core.Galaxy.Unit * Core.Galaxy.SectorSpan;
            let any = sector;
            any.geometry = new THREE.PlaneBufferGeometry(breadth, breadth, 2, 2);
            any.material = new THREE.MeshBasicMaterial({
                wireframe: true,
                transparent: true,
                color: 'red'
            });
            any.mesh = new THREE.Mesh(any.geometry, any.material);
            any.mesh.position.fromArray([sector.x * breadth + breadth / 2, sector.y * breadth + breadth / 2, 0]);
            any.mesh.updateMatrix();
            any.mesh.frustumCulled = false;
            any.mesh.matrixAutoUpdate = false;
            //Renderer.scene.add(any.mesh);
        }
        Util.SectorShow = SectorShow;
        function SectorHide(sector) {
            let any = sector;
            Renderer$1.scene.remove(any.mesh);
        }
        Util.SectorHide = SectorHide;
    })(Util || (Util = {}));
    var Core$1 = Core;

    var Game;
    (function (Game) {
        class Sprite extends Core$1.Shape {
            constructor(properties) {
                super(properties, Counts.Sprites);
                this.properties = properties;
                this.offset = new THREE.Vector2(0, 0);
                this.repeat = new THREE.Vector2(1, 1);
                this.center = new THREE.Vector2(0, 1);
                this.rotation = 0;
                this.spriteMatrix = new THREE.Matrix3;
            }
            update() {
                var _a, _b;
                if (!this.mesh)
                    return;
                this.offset.fromArray(this.properties.offset || [0, 0]);
                this.repeat.fromArray(this.properties.repeat || [1, 1]);
                this.spriteMatrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
                this.mesh.rotation.z = this.properties.bind.rz;
                (_a = this.mesh) === null || _a === void 0 ? void 0 : _a.position.fromArray([...this.properties.bind.rpos, this.properties.z || 0]);
                (_b = this.mesh) === null || _b === void 0 ? void 0 : _b.updateMatrix();
            }
            dispose() {
                var _a, _b, _c;
                if (!this.mesh)
                    return;
                (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
                (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
                (_c = this.mesh.parent) === null || _c === void 0 ? void 0 : _c.remove(this.mesh);
            }
            create() {
                let w = this.properties.bind.size[0];
                let h = this.properties.bind.size[1];
                this.geometry = new THREE.PlaneBufferGeometry(w, h);
                this.material = MySpriteMaterial({
                    map: Renderer$1.load_texture(`sty/${this.properties.sty}`),
                    transparent: true,
                    shininess: 0
                }, {
                    spriteMatrix: this.spriteMatrix,
                    blurMap: (this.properties.blur ? Renderer$1.load_texture(`sty/${this.properties.blur}`) : null),
                    maskMap: (this.properties.mask ? Renderer$1.load_texture(`sty/${this.properties.mask}`) : null)
                });
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.frustumCulled = false;
                this.mesh.matrixAutoUpdate = false;
                this.update();
                //if (this.y.drawable.x.obj.sector)
                //	this.y.drawable.x.obj.sector.group.add(this.mesh);
                //else
                Renderer$1.scene.add(this.mesh);
            }
        }
        Game.Sprite = Sprite;
        function MySpriteMaterial(parameters, uniforms) {
            let material = new THREE.MeshPhongMaterial(parameters);
            material.name = "MeshPhongSpriteMat";
            material.customProgramCacheKey = function () {
                let str = '';
                if (uniforms.blurMap)
                    str += 'blurMap';
                if (uniforms.maskMap)
                    str += 'maskMap';
                // console.log('cache key', str);
                return str;
            };
            material.onBeforeCompile = function (shader) {
                shader.defines = {};
                if (uniforms.blurMap) {
                    shader.uniforms.blurMap = { value: uniforms.blurMap };
                    shader.defines.HAS_BLUR = 1;
                }
                if (uniforms.maskMap) {
                    shader.uniforms.maskMap = { value: uniforms.maskMap };
                    shader.defines.HAS_MASK = 1;
                }
                shader.uniforms.spriteMatrix = { value: uniforms.spriteMatrix };
                shader.vertexShader = shader.vertexShader.replace(`#define PHONG`, `#define PHONG
				uniform mat3 spriteMatrix;
			`);
                shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, `#include <uv_vertex>
				#ifdef USE_UV
				vUv = ( spriteMatrix * vec3( uv, 1 ) ).xy;
				#endif
			`);
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `#define PHONG
				uniform sampler2D blurMap;
				uniform sampler2D maskMap;
			`);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				vec4 texelColor = vec4(0);
				vec4 mapColor = texture2D( map, vUv );
				#ifdef HAS_BLUR
				vec4 blurColor = texture2D( blurMap, vUv );
				blurColor.rgb *= 0.0;
				blurColor.a /= 4.0;
				texelColor = blurColor;
				#endif
				texelColor += mapColor;
				#ifdef HAS_MASK
				vec4 maskColor = texture2D( maskMap, vUv );
				texelColor.rgb *= maskColor.r;
				#endif
				texelColor = mapTexelToLinear( texelColor );
				diffuseColor *= texelColor;
				#endif
			`);
            };
            return material;
        }
        Game.MySpriteMaterial = MySpriteMaterial;
    })(Game || (Game = {}));
    var Game$1 = Game;

    var City;
    (function (City) {
        City.sounds = { footsteps: [] };
        let Generator;
        (function (Generator) {
            function run(min, max, func) {
                let x = min[0];
                for (; x <= max[0]; x++) {
                    let y = min[1];
                    for (; y <= max[1]; y++) {
                        func([x, y]);
                    }
                }
            }
            Generator.run = run;
        })(Generator || (Generator = {}));
        const road_uv = 0.2;
        const road_typical = { sty: 'grey_roads.png', repeat: [road_uv, road_uv] };
        const pavement_mixed = { sty: 'floors/mixed/64.bmp' };
        const block_tenement = { sty: 'commercial/storefront/578.bmp' };
        const make_room = (pos) => {
            let obj = new Core$1.Obj;
            let properties = Object.assign(Object.assign({}, block_tenement), { bind: obj });
            properties.mask = 'walls/casual/concaveMask.bmp';
            // properties.offset = [pavement_uv * 1, 0];
            new Game$1.Sprite(properties);
            obj.wpos = pts.add(pos, [0.5, 0.5]);
            //obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
            obj.update();
            GTA.view.add(obj);
        };
        function creation() {
            pts.area_every(new aabb2([-100, 0], [+100, 1]), (pos) => {
                let obj = new Core$1.Obj;
                let properties = Object.assign(Object.assign({}, road_typical), { bind: obj });
                new Game$1.Sprite(properties);
                obj.wpos = pts.add(pos, [0.5, 0.5]);
                if (pos[1] == 0)
                    obj.rz = Math.PI;
                obj.update();
                GTA.view.add(obj);
            });
            const pavement = (pos) => {
                let obj = new Core$1.Obj;
                let properties = Object.assign(Object.assign({}, pavement_mixed), { bind: obj });
                // properties.offset = [pavement_uv * 1, 0];
                new Game$1.Sprite(properties);
                obj.wpos = pts.add(pos, [0.5, 0.5]);
                obj.rz = Math.PI / 2 * Math.floor(Math.random() * 4);
                obj.update();
                GTA.view.add(obj);
            };
            pts.area_every(new aabb2([-100, -1], [+100, -1]), pavement);
            pts.area_every(new aabb2([-100, 2], [+100, 2]), pavement);
            pts.area_every(new aabb2([0, -2], [0 - 3, -2 - 1]), make_room);
            //pts.area_every(new aabb2([-10, 3], [+10, 3]), tenement);
        }
        City.creation = creation;
        function load_sounds() {
            for (let i = 0; i < 4; i++) {
                City.sounds.footsteps[i] = new Audio(`sfx/FOOTSTEP/SFX_FOOTSEP_CONCRETE_${i + 1}.wav`);
                City.sounds.footsteps[i].volume = 0.1;
            }
        }
        City.load_sounds = load_sounds;
    })(City || (City = {}));
    var City$1 = City;

    // high level game happenings
    var Hooks;
    (function (Hooks) {
        function start() {
            console.log(' hooks start ');
            Core$1.Sector.hooks = {
                onCreate: SectorOnCreate,
                onTick: SectorOnTick
            };
        }
        Hooks.start = start;
        function SectorOnCreate(sector) {
        }
        Hooks.SectorOnCreate = SectorOnCreate;
        function SectorOnTick(sector) {
        }
        Hooks.SectorOnTick = SectorOnTick;
    })(Hooks || (Hooks = {}));
    var Hooks$1 = Hooks;

    var Objects;
    (function (Objects) {
        const ped_uv = [0.125, 0.043478260869565216];
        class Ped extends Core$1.Obj {
            constructor() {
                super();
                this.remap = -1;
                this.timer = 0;
                this.row = 0;
                this.column = 0;
                this.walking = false;
                this.running = false;
                this.idling = false;
                this.size = [33, 33];
            }
            make() {
                if (this.remap == -1)
                    this.remap = Math.floor(Math.random() * 53);
                new Game$1.Sprite({
                    bind: this,
                    sty: `ped/template_${this.remap}.png`,
                    blur: `ped/blur.png`,
                    repeat: [ped_uv[0], ped_uv[1]],
                    z: 1
                });
            }
            tick() {
                var _a;
                this.timer += Renderer$1.delta;
                if ((this.walking || this.running) && this.timer > (this.walking ? 0.11 : 0.08)) {
                    this.column = (this.column < 7) ? this.column + 1 : 0;
                    this.timer = 0;
                    if (this.column == 1 || this.column == 5)
                        City$1.sounds.footsteps[Math.floor(Math.random() * 4)].play();
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
                let shape = this.shape;
                shape.properties.offset = [ped_uv[0] * this.column, -ped_uv[1] * this.row];
                super.update();
                (_a = this.sector) === null || _a === void 0 ? void 0 : _a.swap(this);
            }
        }
        Objects.Ped = Ped;
        class Ply extends Ped {
            constructor() {
                super();
                this.stopped = false;
            }
            static instance() {
                let ply = new Ply;
                ply.make();
                return ply;
            }
            make() {
                // 9, 52
                this.remap = 52;
                super.make();
            }
            tick() {
                this.walking = false;
                this.running = false;
                let dist = pts.dist(this.rpos, GTA.view.mrpos);
                const range = 48;
                if (App$1.key('c') == 1)
                    this.stopped = !this.stopped;
                if (!this.stopped && dist > range) {
                    this.idling = false;
                    let velocity = -0.75;
                    if (App$1.button(0) >= 1) {
                        velocity = -1.5;
                        this.running = true;
                        this.row = 1;
                    }
                    else {
                        this.walking = true;
                        this.row = 0;
                    }
                    this.rz = -Math.atan2(this.rpos[0] - GTA.view.mrpos[0], this.rpos[1] - GTA.view.mrpos[1]);
                    velocity *= Renderer$1.delta;
                    this.wpos = pts.add(this.wpos, [
                        velocity * Math.sin(-this.rz),
                        velocity * Math.cos(-this.rz)
                    ]);
                }
                super.tick();
            }
        }
        Objects.Ply = Ply;
        /*
        export class Rock extends Core.Obj {
            static slowness = 12;
            rate: number
            float: vec2
            constructor() {
                super();
                this.size = [100, 100];
                this.float = pts.make(
                    (Math.random() - 0.5) / Rock.slowness,
                    (Math.random() - 0.5) / Rock.slowness
                );
                this.rate = (Math.random() - 0.5) / (Rock.slowness * 6);
            }
            make() {
                this.size = [200, 200];
                let shape = new Game.Sprite({
                    bind: this,
                    sty: 'grav/pngwing.com',
                    offset: [0, 0],
                    scale: [1, 1],
                    z: 0
                });
            }
            tick() {
                this.wpos[0] += this.float[0];
                this.wpos[1] -= this.float[1];
                this.rz += this.rate;
                super.update();
                this.sector?.swap(this);
            }
        }*/
    })(Objects || (Objects = {}));
    var Objects$1 = Objects;

    // the view manages everthng dont ask
    class View {
        constructor() {
            this.zoom = 0.25;
            this.rpos = [0, 0];
            this.pos = [0, 0];
            this.wpos = [0, 0];
            this.mpos = [0, 0];
            this.mrpos = [0, 0];
            this.galaxy = new Core$1.Galaxy(10);
        }
        static make() {
            return new View;
        }
        chart(big) {
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
            let wpos = Core$1.Galaxy.unproject(this.rpos);
            this.galaxy.update(wpos);
        }
        mouse() {
            let mouse = App$1.mouse();
            mouse = pts.subtract(mouse, pts.divide([Renderer$1.w, Renderer$1.h], 2));
            mouse = pts.mult(mouse, Renderer$1.ndpi);
            mouse = pts.mult(mouse, this.zoom);
            mouse[1] = -mouse[1];
            this.mpos = pts.clone(mouse);
            this.mrpos = pts.add(this.rpos, mouse);
            // now..
            if (App$1.button(2) >= 1) {
                let ping = new Objects$1.Ped;
                ping.wpos = Core$1.Galaxy.unproject(this.mrpos);
                ping.make();
                this.add(ping);
            }
        }
        move() {
            let pan = 5;
            if (App$1.key('x'))
                pan *= 10;
            if (App$1.key('w'))
                this.rpos[1] += pan;
            if (App$1.key('s'))
                this.rpos[1] -= pan;
            if (App$1.key('a'))
                this.rpos[0] -= pan;
            if (App$1.key('d'))
                this.rpos[0] += pan;
            if (App$1.key('r'))
                this.zoom += 0.01;
            if (App$1.key('f'))
                this.zoom -= 0.01;
            this.zoom = this.zoom > 1 ? 1 : this.zoom < 0.1 ? 0.1 : this.zoom;
            this.pos = Core$1.Galaxy.unproject(this.rpos);
            Renderer$1.camera.scale.fromArray([this.zoom, this.zoom, this.zoom]);
        }
        chase() {
            const time = Renderer$1.delta;
            pts.mult([0, 0], 0);
            let ply = GTA.ply.rpos;
            this.rpos = pts.add(pts.mult(pts.subtract(ply, this.rpos), time * 5), this.rpos);
            //this.rpos = pts.mult(this.rpos, this.zoom);
            let inv = pts.inv(this.rpos);
            Renderer$1.scene.position.set(inv[0], inv[1], 0);
        }
        stats() {
            let crunch = ``;
            crunch += `DPI_UPSCALED_RT: ${Renderer$1.DPI_UPSCALED_RT}<br /><br />`;
            crunch += `dpi: ${Renderer$1.ndpi}<br />`;
            crunch += `fps: ${Renderer$1.fps} / ${Renderer$1.delta.toPrecision(3)}<br />`;
            crunch += '<br />';
            crunch += `textures: ${Renderer$1.renderer.info.memory.textures}<br />`;
            crunch += `programs: ${Renderer$1.renderer.info.programs.length}<br />`;
            crunch += `memory: ${Math.floor(Renderer$1.memory.usedJSHeapSize / 1000000)} / ${Math.floor(Renderer$1.memory.totalJSHeapSize / 1000000)}<br />`;
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
            App$1.sethtml('.stats', crunch);
        }
    }

    exports.GTA = void 0;
    (function (GTA) {
        GTA.NO_VAR = false;
        GTA.SOME_OTHER_SETTING = false;
        const MAX_WAIT = 1500;
        var started = false;
        function sample(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        GTA.sample = sample;
        function clamp(val, min, max) {
            return val > max ? max : val < min ? min : val;
        }
        GTA.clamp = clamp;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["RC_UNDEFINED"] = 0] = "RC_UNDEFINED";
            RESOURCES[RESOURCES["POPULAR_ASSETS"] = 1] = "POPULAR_ASSETS";
            RESOURCES[RESOURCES["CANT_FIND"] = 2] = "CANT_FIND";
            RESOURCES[RESOURCES["READY"] = 3] = "READY";
            RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
        })(RESOURCES = GTA.RESOURCES || (GTA.RESOURCES = {}));
        let time;
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        GTA.resourced = resourced;
        function try_start() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                if (resources_loaded & 0b1 << i)
                    count++;
            if (count == RESOURCES.COUNT)
                start();
        }
        function reasonable_waiter() {
            if (time + MAX_WAIT < new Date().getTime()) {
                console.warn(`passed reasonable wait time for resources`);
                start();
            }
        }
        GTA.reasonable_waiter = reasonable_waiter;
        function critical(mask) {
            // Couldn't load
            console.error('resource', mask);
        }
        GTA.critical = critical;
        function init() {
            console.log(' gta init ');
            time = new Date().getTime();
            resourced('RC_UNDEFINED');
            resourced('POPULAR_ASSETS');
            resourced('READY');
            window['GTA'] = GTA;
        }
        GTA.init = init;
        function start() {
            if (started)
                return;
            console.log(' gtasmr starting ');
            GTA.view = View.make();
            GTA.ply = Objects$1.Ply.instance();
            GTA.view.add(GTA.ply);
            City$1.load_sounds();
            City$1.creation();
            Hooks$1.start();
            if (window.location.href.indexOf("#novar") != -1)
                GTA.NO_VAR = false;
            started = true;
        }
        function tick() {
            if (!started) {
                reasonable_waiter();
                return;
            }
            GTA.view.tick();
            //Board.update();
            //Ploppables.update();
        }
        GTA.tick = tick;
    })(exports.GTA || (exports.GTA = {}));
    var GTA = exports.GTA;

    exports["default"] = GTA;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, THREE);
