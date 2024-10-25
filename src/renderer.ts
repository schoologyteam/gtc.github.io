import App from './app.js';
import GTA from './gta.js';
import View from './view.js';

const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`

const fragmentPost = `
// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	clr.rgb = mix(clr.rgb, vec3(0.5), 0.0);
	gl_FragColor = clr;
}`


const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

// three quarter

namespace Renderer {

	export const DPI_UPSCALED_RT = true;

	export var ndpi = 1;
	export var delta = 0;

	export var clock
	export var scene
	export var scenert
	export var camera
	export var camera2
	export var target
	export var renderer

	export var ambientLight
	export var directionalLight

	export var materialBg
	export var materialPost

	export var quadPost

	//export var ambientLight: AmbientLight
	//export var directionalLight: DirectionalLight

	export function update() {

		delta = clock.getDelta();

		if (delta > 2)
			delta = 0.016;

		//filmic.composer.render();
	}

	var reset = 0;
	var frames = 0;

	export var fps;
	export var memory;

	// https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
	export function calc() {
		const s = Date.now() / 1000;
		frames++;
		if (s - reset >= 1) {
			reset = s;
			fps = frames;
			frames = 0;
		}

		memory = (<any>window.performance).memory;
	}
	export function render() {

		calc();

		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(scene, camera);

		renderer.setRenderTarget(null);
		renderer.clear();
		renderer.render(scenert, camera2);
	}

	export var wh: vec2;
	export var plane;

	export function init() {

		console.log('renderer init');

		clock = new THREE.Clock();

		scene = new THREE.Scene();
		scene.background = new THREE.Color('#292929');

		scenert = new THREE.Scene();

		ambientLight = new THREE.AmbientLight(0x3a454f);

		directionalLight = new THREE.DirectionalLight(0x355886, 1.0);
		directionalLight.position.set(0, 0, 1);

		scene.add(directionalLight);
		scene.add(directionalLight.target);
		scene.add(ambientLight);

		if (DPI_UPSCALED_RT)
			ndpi = window.devicePixelRatio;

		target = new THREE.WebGLRenderTarget(
			window.innerWidth, window.innerHeight,
			{
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter,
				format: THREE.RGBFormat
			});

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setPixelRatio(ndpi);
		renderer.setSize(100, 100);
		renderer.autoClear = true;
		renderer.setClearColor(0xffffff, 0);

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		materialPost = new THREE.ShaderMaterial({
			uniforms: { tDiffuse: { value: target.texture } },
			vertexShader: vertexScreen,
			fragmentShader: fragmentPost,
			depthWrite: false
		});

		onWindowResize();

		quadPost = new THREE.Mesh(plane, materialPost);
		//quadPost.position.z = -100;

		scenert.add(quadPost);

		(window as any).Renderer = Renderer;
	}

	export var w, h, w2, h2;

	function onWindowResize() {
		w = w2 = window.innerWidth;
		h = h2 = window.innerHeight;
		if (DPI_UPSCALED_RT) {
			w2 = w * ndpi;
			h2 = h * ndpi;
			if (w2 % 2 != 0) {
				w2 -= 1;
			}
			if (h2 % 2 != 0) {
				h2 -= 1;
			}
		}
		console.log(`window inner [${w}, ${h}], new is [${w2}, ${h2}]`);
		target.setSize(w2, h2);
		plane = new THREE.PlaneGeometry(w2, h2);
		if (quadPost)
			quadPost.geometry = plane;
		/*camera = new PerspectiveCamera(
			70, window.innerWidth / window.innerHeight, 1, 3000);
		//camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
		camera.updateProjectionMatrix();
		camera.position.z = 300;*/
		camera = ortographic_camera(w2, h2);
		camera.updateProjectionMatrix();
		camera2 = ortographic_camera(w2, h2);
		camera2.updateProjectionMatrix();
		renderer.setSize(w, h);
	}

	let mem = [];
	
	export function load_texture(file: string, key?: string) {
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

	export function make_render_target(w, h) {
		const o = {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		};
		let target = new THREE.WebGLRenderTarget(w, h, o);
		return target;
	}

	export function ortographic_camera(w, h) {
		let camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, - 100, 100);
		camera.updateProjectionMatrix();

		return camera;
	}

	export function erase_children(group) {
		while (group.children.length > 0)
			group.remove(group.children[0]);
	}
}

export default Renderer;