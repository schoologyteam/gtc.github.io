import App from './app.js';
const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`;
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
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
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
        Renderer.plane = new THREE.PlaneGeometry(Renderer.w2, Renderer.h2);
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
        let texture = new THREE.TextureLoader().load(file + `?v=${App.salt}`, () => {
            //renderer.initTexture(texture);
        });
        texture.generateMipmaps = false;
        texture.center.set(0, 1);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
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
export default Renderer;
