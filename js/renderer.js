import app from './app.js';
const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`;
const fragmentPost = `
float luma(vec3 color) {
	return dot(color, vec3(0.299, 0.587, 0.114));
	//return dot(color, vec3(0.5, 0.5, 0.5));
}

float dither8x8(vec2 position, float brightness) {
	int x = int(mod(position.x, 8.0));
	int y = int(mod(position.y, 8.0));
	int index = x + y * 8;
	float limit = 0.0;
  
	if (x < 8) {
	  if (index == 0) limit = 0.015625;
	  if (index == 1) limit = 0.515625;
	  if (index == 2) limit = 0.140625;
	  if (index == 3) limit = 0.640625;
	  if (index == 4) limit = 0.046875;
	  if (index == 5) limit = 0.546875;
	  if (index == 6) limit = 0.171875;
	  if (index == 7) limit = 0.671875;
	  if (index == 8) limit = 0.765625;
	  if (index == 9) limit = 0.265625;
	  if (index == 10) limit = 0.890625;
	  if (index == 11) limit = 0.390625;
	  if (index == 12) limit = 0.796875;
	  if (index == 13) limit = 0.296875;
	  if (index == 14) limit = 0.921875;
	  if (index == 15) limit = 0.421875;
	  if (index == 16) limit = 0.203125;
	  if (index == 17) limit = 0.703125;
	  if (index == 18) limit = 0.078125;
	  if (index == 19) limit = 0.578125;
	  if (index == 20) limit = 0.234375;
	  if (index == 21) limit = 0.734375;
	  if (index == 22) limit = 0.109375;
	  if (index == 23) limit = 0.609375;
	  if (index == 24) limit = 0.953125;
	  if (index == 25) limit = 0.453125;
	  if (index == 26) limit = 0.828125;
	  if (index == 27) limit = 0.328125;
	  if (index == 28) limit = 0.984375;
	  if (index == 29) limit = 0.484375;
	  if (index == 30) limit = 0.859375;
	  if (index == 31) limit = 0.359375;
	  if (index == 32) limit = 0.0625;
	  if (index == 33) limit = 0.5625;
	  if (index == 34) limit = 0.1875;
	  if (index == 35) limit = 0.6875;
	  if (index == 36) limit = 0.03125;
	  if (index == 37) limit = 0.53125;
	  if (index == 38) limit = 0.15625;
	  if (index == 39) limit = 0.65625;
	  if (index == 40) limit = 0.8125;
	  if (index == 41) limit = 0.3125;
	  if (index == 42) limit = 0.9375;
	  if (index == 43) limit = 0.4375;
	  if (index == 44) limit = 0.78125;
	  if (index == 45) limit = 0.28125;
	  if (index == 46) limit = 0.90625;
	  if (index == 47) limit = 0.40625;
	  if (index == 48) limit = 0.25;
	  if (index == 49) limit = 0.75;
	  if (index == 50) limit = 0.125;
	  if (index == 51) limit = 0.625;
	  if (index == 52) limit = 0.21875;
	  if (index == 53) limit = 0.71875;
	  if (index == 54) limit = 0.09375;
	  if (index == 55) limit = 0.59375;
	  if (index == 56) limit = 1.0;
	  if (index == 57) limit = 0.5;
	  if (index == 58) limit = 0.875;
	  if (index == 59) limit = 0.375;
	  if (index == 60) limit = 0.96875;
	  if (index == 61) limit = 0.46875;
	  if (index == 62) limit = 0.84375;
	  if (index == 63) limit = 0.34375;
	}
  
	return brightness < limit ? 0.0 : 1.0;
  }

float dither4x4(vec2 position, float brightness) {
	int x = int(mod(position.x, 4.0));
	int y = int(mod(position.y, 4.0));
	int index = x + y * 4;
	float limit = 0.0;

	if (x < 8) {
		if (index == 0) limit = 0.0625;
		if (index == 1) limit = 0.5625;
		if (index == 2) limit = 0.1875;
		if (index == 3) limit = 0.6875;
		if (index == 4) limit = 0.8125;
		if (index == 5) limit = 0.3125;
		if (index == 6) limit = 0.9375;
		if (index == 7) limit = 0.4375;
		if (index == 8) limit = 0.25;
		if (index == 9) limit = 0.75;
		if (index == 10) limit = 0.125;
		if (index == 11) limit = 0.625;
		if (index == 12) limit = 1.0;
		if (index == 13) limit = 0.5;
		if (index == 14) limit = 0.875;
		if (index == 15) limit = 0.375;
	}

	return brightness < limit ? 0.0 : 1.0;
}
  
vec3 dither4x4(vec2 position, vec3 color) {
	return color * dither4x4(position, luma(color));
}

vec3 dither8x8(vec2 position, vec3 color) {
	return color * dither8x8(position, luma(color));
}

// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;

void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	//clr.rgb = mix(clr.rgb, vec3(0.5), 0.5);
	gl_FragColor = clr;
	gl_FragColor.rgb = dither4x4(gl_FragCoord.xy, gl_FragColor.rgb);
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
        renderer_1.ambientLight.intensity = 2.7;
        renderer_1.directionalLight = new THREE.DirectionalLight(0x355886, 1.0);
        renderer_1.directionalLight.position.set(0, 0, 1);
        renderer_1.scene.add(renderer_1.directionalLight);
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
