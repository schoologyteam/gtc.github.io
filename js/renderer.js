import app from './app.js';
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
	clr.rgb = mix(clr.rgb, vec3(0.5), 0.1);
	gl_FragColor = clr;
}`;
const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
// three quarter
var renderer;
(function (renderer_1) {
    renderer_1.DPI_UPSCALED_RT = true;
    renderer_1.ndpi = 1;
    renderer_1.delta = 0;
    //export var ambientLight: AmbientLight
    //export var directionalLight: DirectionalLight
    function update() {
        renderer_1.delta = renderer_1.clock.getDelta();
        if (renderer_1.delta > 2)
            renderer_1.delta = 0.016;
        //filmic.composer.render();
    }
    renderer_1.update = update;
    var reset = 0;
    var frames = 0;
    renderer_1.fps = 0;
    // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
    function calc() {
        const s = Date.now() / 1000;
        frames++;
        if (s - reset >= 1) {
            reset = s;
            renderer_1.fps = frames;
            frames = 0;
        }
        renderer_1.memory = window.performance.memory;
    }
    renderer_1.calc = calc;
    function render() {
        calc();
        renderer_1.renderer.setRenderTarget(renderer_1.target);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scene, renderer_1.camera);
        renderer_1.renderer.setRenderTarget(null);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scenert, renderer_1.camera2);
    }
    renderer_1.render = render;
    function init() {
        console.log('renderer init');
        renderer_1.clock = new THREE.Clock();
        renderer_1.scene = new THREE.Scene();
        renderer_1.scene.background = new THREE.Color('#292929');
        renderer_1.scenert = new THREE.Scene();
        // ambientLight = new THREE.AmbientLight(0x3a454f);
        renderer_1.ambientLight = new THREE.AmbientLight('white');
        renderer_1.directionalLight = new THREE.DirectionalLight(0x355886, 1.0);
        renderer_1.directionalLight.position.set(0, 0, 1);
        //scene.add(directionalLight); 
        renderer_1.scene.add(renderer_1.ambientLight);
        if (renderer_1.DPI_UPSCALED_RT)
            renderer_1.ndpi = window.devicePixelRatio;
        renderer_1.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
        });
        renderer_1.renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer_1.renderer.setPixelRatio(renderer_1.ndpi);
        renderer_1.renderer.setSize(100, 100);
        renderer_1.renderer.autoClear = true;
        renderer_1.renderer.setClearColor(0xffffff, 0);
        document.body.appendChild(renderer_1.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        renderer_1.materialPost = new THREE.ShaderMaterial({
            uniforms: { tDiffuse: { value: renderer_1.target.texture } },
            vertexShader: vertexScreen,
            fragmentShader: fragmentPost,
            depthWrite: false
        });
        onWindowResize();
        renderer_1.quadPost = new THREE.Mesh(renderer_1.plane, renderer_1.materialPost);
        //quadPost.position.z = -100;
        renderer_1.scenert.add(renderer_1.quadPost);
        window.Renderer = renderer_1.renderer;
    }
    renderer_1.init = init;
    function onWindowResize() {
        renderer_1.w = renderer_1.w2 = window.innerWidth;
        renderer_1.h = renderer_1.h2 = window.innerHeight;
        if (renderer_1.DPI_UPSCALED_RT) {
            renderer_1.w2 = renderer_1.w * renderer_1.ndpi;
            renderer_1.h2 = renderer_1.h * renderer_1.ndpi;
            if (renderer_1.w2 % 2 != 0) {
                renderer_1.w2 -= 1;
            }
            if (renderer_1.h2 % 2 != 0) {
                renderer_1.h2 -= 1;
            }
        }
        console.log(`window inner [${renderer_1.w}, ${renderer_1.h}], new is [${renderer_1.w2}, ${renderer_1.h2}]`);
        renderer_1.target.setSize(renderer_1.w2, renderer_1.h2);
        renderer_1.plane = new THREE.PlaneGeometry(renderer_1.w2, renderer_1.h2);
        if (renderer_1.quadPost)
            renderer_1.quadPost.geometry = renderer_1.plane;
        /*camera = new PerspectiveCamera(
            70, window.innerWidth / window.innerHeight, 1, 3000);
        //camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
        camera.updateProjectionMatrix();
        camera.position.z = 300;*/
        renderer_1.camera = ortographic_camera(renderer_1.w2, renderer_1.h2);
        renderer_1.camera.updateProjectionMatrix();
        renderer_1.camera2 = ortographic_camera(renderer_1.w2, renderer_1.h2);
        renderer_1.camera2.updateProjectionMatrix();
        renderer_1.renderer.setSize(renderer_1.w, renderer_1.h);
    }
    let mem = [];
    function load_texture(file, key) {
        if (mem[key || file])
            return mem[key || file];
        let texture = new THREE.TextureLoader().load(file + `?v=${app.salt}`, () => {
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
    renderer_1.load_texture = load_texture;
    function make_render_target(w, h) {
        const o = {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        };
        let target = new THREE.WebGLRenderTarget(w, h, o);
        return target;
    }
    renderer_1.make_render_target = make_render_target;
    function ortographic_camera(w, h) {
        let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
        camera.updateProjectionMatrix();
        return camera;
    }
    renderer_1.ortographic_camera = ortographic_camera;
    function erase_children(group) {
        while (group.children.length > 0)
            group.remove(group.children[0]);
    }
    renderer_1.erase_children = erase_children;
})(renderer || (renderer = {}));
export default renderer;
